const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const path = require('path');
const mime = require('mime');

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  SIGNATURE_VERSION,
  BUCKET_NAME,
} = process.env;

const s3 = new S3({ AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SIGNATURE_VERSION });

const folderPath  = '../dist';
const distFolderPath = path.join(__dirname, folderPath);

const uploadDistFiles = () => fs.readdir(distFolderPath, (err, files) => {
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
      // // console.log('is directory', filePath, fileName);
      fs.readdir(filePath, (e, subFiles) => {
        if (e) { throw e; }

        if(!subFiles || subFiles.length === 0) {
          // console.log(`provided folder '${filePath}' is empty or does not exist.`);
          // console.log('Make sure your project was compiled!');
          return;
        }

        for (const subFileName of subFiles) {
          // // console.log('subFileName', subFileName);

          const subFilePath = `${filePath}/${subFileName}`;

          fs.readFile(subFilePath, (err, fileContent) => {
            if (err) { throw err; }

            const ContentType = mime.getType(subFileName);

            // upload file to S3
            s3.upload({
              Bucket: BUCKET_NAME,
              Key: `${fileName}/${subFileName}`,
              Body: fileContent,
              ContentType,
              CacheControl: 'no-cache',
            }, (err) => {
              if (err) { throw err; }
              // console.log(`Successfully uploaded '${subFileName}'`);
            });

          });
        }

      });
      continue;
    }

    // read file contents
    fs.readFile(filePath, (error, fileContent) => {
      // if unable to read file contents, throw exception
      if (error) { throw error; }

      const ContentType = mime.getType(fileName);

      const isGzip = ContentType.indexOf('gzip') > -1;
      // console.log(ContentType);

      const basicUploadConfig = {
        Bucket: BUCKET_NAME,
        Key: `${fileName}`,
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
      s3.upload(uploadConfig, (err) => {
        if (err) { throw err; }
        console.log(`Successfully uploaded '${fileName}'!`);
      });

    });
  }
});

uploadDistFiles();
