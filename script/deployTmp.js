const readline = require('readline');
const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');
const mime = require('mime');

const config = require('../s3-credentials.json');

const BUCKET_NAEM = config.bucketName;

const {
  accessKeyId,
  secretAccessKey,
  signatureVersion,
} = config;

const s3 = new AWS.S3({ accessKeyId, secretAccessKey, signatureVersion });

const uploadIndexFile = (fileName, indexKey) => {
  const fileContents = fs.readFileSync(fileName);
  const ContentType = mime.getType(fileName);

  const params = {
    Bucket: BUCKET_NAEM,
    Key: `${indexKey}/${fileName}`,
    Body: fileContents,
    CacheControl: 'no-cache',
    ContentType,
  };

  s3.upload(params, function(err, data) {
    if (err) { throw err; }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

const indexFileName = path.basename('../dist/index.html');

const folderPath  = '../dist';
const distFolderPath = path.join(__dirname, folderPath);

const uploadDistFiles = (distKey, indexKey) => fs.readdir(distFolderPath, (err, files) => {
  if (err) { throw err; }

  if(!files || files.length === 0) {
    console.log(`provided folder '${distFolderPath}' is empty or does not exist.`);
    console.log('Make sure your project was compiled!');
    return;
  }

  // for each file in the directory
  for (const fileName of files) {

    // get the full path of the file
    const filePath = path.join(distFolderPath, fileName);

    // ignore if directory
    if (fs.lstatSync(filePath).isDirectory()) {
      console.log('is directory', filePath, fileName);
      fs.readdir(filePath, (e, subFiles) => {
        if (e) { throw e; }

        if(!subFiles || subFiles.length === 0) {
          console.log(`provided folder '${filePath}' is empty or does not exist.`);
          console.log('Make sure your project was compiled!');
          return;
        }

        for (const subFileName of subFiles) {
          console.log('subFileName', subFileName);
        }

      });
      continue;
    }

    // read file contents
    fs.readFile(filePath, (error, fileContent) => {
      // if unable to read file contents, throw exception
      if (error) { throw error; }

      const ContentType = mime.getType(fileName);

      console.log('1@!#@#@!#!@', ContentType);

      if (fileName === 'index.html') {
        console.log('~~~~~~~~~~', indexKey);
        s3.upload({
          Bucket: BUCKET_NAEM,
          Key: `${indexKey}/${fileName}`,
          Body: fileContent,
          ContentType,
          CacheControl: 'no-cache',
        }, (err) => {
          if (err) { throw err; }
          console.log(`File Successfully uploaded '${fileName}'!`);
        });
      }
      // upload file to S3
      // s3.upload({
      //   Bucket: BUCKET_NAEM,
      //   Key: `${distKey}/${fileName}`,
      //   Body: fileContent,
      //   ContentType,
      //   CacheControl: 'no-cache',
      // }, (err) => {
      //   if (err) { throw err; }
      //   console.log(`Successfully uploaded '${fileName}'!`);
      // });

    });
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.question('업로드 버젼을 입력해 주세요. ', (answer) => {
  process.env.UPLOAD_VERSION = answer;
  const { env: { UPLOAD_TYPE, UPLOAD_VERSION } } = process;

  const indexKey = `v/${UPLOAD_TYPE}/${UPLOAD_VERSION}`;
  const distKey = `${indexKey}/dist`;

  // uploadIndexFile(indexFileName, indexKey);
  uploadDistFiles(distKey, indexKey);

  rl.close();
});
