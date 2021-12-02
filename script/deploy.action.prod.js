const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('@actions/exec');
const os = require('os');
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const path = require('path');
const mime = require('mime');
const { Client } = require("@notionhq/client");

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  SIGNATURE_VERSION,
  BUCKET_NAME,
  GITHUB_TOKEN,
  NOTION_TOKEN,
} = process.env;

const s3 = new S3({ AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SIGNATURE_VERSION });

const majorVersion = 2;
const minorVersion = 0;

const getCurrentHotfixVersionAtS3 = async (prefix) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    };
    const data = await s3.listObjectsV2(params).promise();

    let beforeFolderName = -1;
    const defineNextFolderName = (obj) => {
      const skimPrefixPath = obj.Key.replace(prefix, '');
      const slashIndex = skimPrefixPath.indexOf('/');
      const currentFolderName = Number(skimPrefixPath.substr(0, slashIndex));
      // console.log(currentFolderName, "<<<file path")
      if (beforeFolderName < currentFolderName) {
        beforeFolderName = currentFolderName;
      }
    };

    data.Contents.forEach(defineNextFolderName);

    const hotfixNumber = beforeFolderName + 1;
    return hotfixNumber;
  } catch (error) {
    core.setFailed('There was an error viewing your album: ' + error.stack);
    return false;
  }
};

const getCurrentBucketKey = async () => {
  try {
    const prefix = `v/${majorVersion}/${minorVersion}/`;
    const hotfixVersion = await getCurrentHotfixVersionAtS3(prefix);
    if (!hotfixVersion) { throw 'hotFix 버젼 넘버를 찾을수 없습니다.'; }
    const key = `${prefix}${hotfixVersion}`;

    return {
      prefix,
      hotfixVersion,
      key,
    };
  } catch (error) {
    core.setFailed(error);
    return false;
  }
};

async function build(hotfixVersion) {
  try {
    process.env.UPLOAD_TYPE = majorVersion;
    process.env.UPLOAD_VERSION = `${minorVersion}/${hotfixVersion}`;
    process.env.SERVER_TYPE = 'rest';

    const { stdout, stderr } = await exec('vue-cli-service build --mode development');
    if (stderr) {
      core.setFailed(stderr);
      return false;
    }

    core.notice(stdout ? stdout : '빌드 성공');
    return true;
  } catch (error) {
    return false;
  }
}

const uploadDistFilesAtS3 = async (distKey) => {
  try {
    const folderPath  = '../dist';
    const distFolderPath = path.join(__dirname, folderPath);
    const files = await fs.promises.readdir(distFolderPath);

    if (!files || files.length === 0) {
      console.log(`provided folder '${distFolderPath}' is empty or does not exist.`);
      console.log('Make sure your project was compiled!');
      throw '업로드 할 파일 없습니다. 빌드를 확인하시오.';
    }

    let uploadFileCount = 3;
    // for each file in the directory
    for (const fileName of files) {

      // get the full path of the file
      const filePath = path.join(distFolderPath, fileName);

      // ignore if directory
      if (fs.lstatSync(filePath).isDirectory()) {
        const subFiles = await fs.promises.readdir(filePath);

        if (!subFiles || subFiles.length === 0) {
          console.log(`provided folder '${filePath}' is empty or does not exist.`);
          console.log('Make sure your project was compiled!');
          continue;
        }

        for (const subFileName of subFiles) {
          console.log('subFileName', subFileName);
          const subFilePath = `${filePath}/${subFileName}`;

          const fileContent = await fs.promises.readFile(subFilePath);

          if (!fileContent) {
            throw 's3 파일 컨텐츠를 찾지 못했습니다.';
          }

          const ContentType = mime.getType(subFileName);

          // upload file to S3
          const subS3Data = await s3.upload({
            Bucket: BUCKET_NAME,
            Key: `${distKey}/${fileName}/${subFileName}`,
            Body: fileContent,
            ContentType,
            CacheControl: 'no-cache',
          }).promise();
          console.log(subS3Data);
          const isKey = Object.prototype.hasOwnProperty.call(subS3Data, 'key');
          if (isKey) {
            uploadFileCount = uploadFileCount -1;
            console.log(`Successfully uploaded '${subS3Data.key}'!`);
          }
        }
        continue;
      }

      const ContentType = mime.getType(fileName);
      const isGzip = ContentType.indexOf('gzip') > -1;

      // read file contents
      const fileContent = await fs.promises.readFile(filePath);
      const basicUploadConfig = {
        Bucket: BUCKET_NAME,
        Key: `${distKey}/${fileName}`,
        Body: fileContent,
        ContentType,
        CacheControl: 'no-cache',
      };

      const gzipUploadConfig = {
        ...basicUploadConfig,
        ContentType: 'text/javascript',
        ContentEncoding: 'gzip',
      };

      const uploadConfig = isGzip ? gzipUploadConfig : basicUploadConfig;

      // upload file to S3
      const s3Data = await s3.upload(uploadConfig).promise();
      console.log(s3Data);
      const isKey = Object.prototype.hasOwnProperty.call(s3Data, 'key');
      if (isKey) {
        uploadFileCount = uploadFileCount -1;
        console.log(`Successfully uploaded '${s3Data.key}'!`);
      }
    }
    if (uploadFileCount > 0) {
      throw '업로드 필요한 파일들이 다올라가지 않았습니다.';
    }

    if (uploadFileCount < 0) {
      throw '업로드 필요한 파일 갯수가 초과 업로드 되었습니다.';
    }

    return true;
  } catch (error) {
    core.setFailed('There was an error viewing your album: ' + error);
    return false;
  }
};

async function createTag(tag) {
  try {
    if (!Object.hasOwnProperty.call(process.env, 'GITHUB_TOKEN')) {
      throw 'Invalid or missing GITHUB_TOKEN.';
    }
    const octokit = github.getOctokit(GITHUB_TOKEN);
    // console.log(github.context)
    const {
      owner,
      repo,
    } = github.context.repo;

    const getMessage = () => {
      try {
        if (!github.context.payload.pull_request.body) {
          throw 'git merge시 풀리퀘스트 바디내용을 기입 하지 않으셨습니다. 조재훈 팀장에게 알려주세요.';
        }

        return github.context.payload.pull_request.body;

      } catch (error) {
        core.setFailed('git merge시 풀리퀘스트 바디내용을 기입 하지 않으셨습니다.');
        return String(error);
      }
    };

    const params = {
      owner,
      repo,
      tag: tag.replace(/([/])/g, '.'),
      message: getMessage(),
      object: process.env.GITHUB_SHA,
      type: 'commit',
    };

    const newTag = await octokit.rest.git.createTag(params);
    core.notice(`Created new tag: ${newTag.data.tag}`);

    const newParams = {
      owner,
      repo,
      ref: `refs/tags/${newTag.data.tag}`,
      sha: newTag.data.sha,
    };
    const newReference = await octokit.rest.git.createRef(newParams);
    core.notice(`Reference ${newReference.data.ref} available at ${newReference.data.url}` + os.EOL);
    return params.message;
  } catch (error) {
    core.setFailed(error);
    return false;
  }
}

const writeNotionRow = async (hotfixNum, comment) => {
  try {
    const notion = new Client({
      auth: NOTION_TOKEN,
    });

    const myPage = await notion.pages.create({
      parent: {
        database_id: 'c69bda09fcbd4652a8858a36d92c5adc',
      },
      properties: {
        'Major Version': {
          number: majorVersion,
        },
        'Minor Version': {
          number: minorVersion,
        },
        'Hotfix Version': {
          number: hotfixNum,
        },
        status: {
          select: {
            name: '배포'
          },
        },
        Comment: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: comment
              }
            }
          ]
        },
        '관련자': {
          people: [
            {
              object: 'user',
              id: 'fb7f21d8-2268-45a8-a4f9-668bd9a79a48'
            }
          ]
        },
      },
    });

    console.log(myPage);
    return true;
  } catch (error) {
    core.setFailed(error);
    return false;
  }
};

async function run() {
  try {
    const s3BucketKey = await getCurrentBucketKey();
    if (!s3BucketKey) { throw 's3 업로드할 객체를 찾지 못했습니다.'; }
    if (!s3BucketKey.prefix) { throw 's3 업로드할 프리픽스를 찾지 못했습니다.'; }
    if (!s3BucketKey.hotfixVersion) { throw 's3 업로드할 핫픽스 버젼을 찾지 못했습니다.'; }
    if (!s3BucketKey.key) { throw 's3 업로드할 버킷 키를 찾지 못하였습니다.'; }

    const isBuild = await build(s3BucketKey.hotfixVersion);
    if (!isBuild) { throw '빌드 실패 하였습니다.'; }

    const isS3UploadOk = await uploadDistFilesAtS3(s3BucketKey.key);
    if (!isS3UploadOk) { throw 's3 업로드 에러 발생 조재훈 팀장에게 안내바람'; }

    const githubMessage = await createTag(s3BucketKey.key);
    if (!githubMessage) { throw '깃 허브 태그 push 실패'; }

    writeNotionRow(s3BucketKey.hotfixVersion, githubMessage);
  } catch (error) {
    core.setFailed(error);
  }
}

run();
