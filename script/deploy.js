const readline = require('readline');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.question('업로드 버젼을 입력해 주세요. ', async (answer) => {
  process.env.UPLOAD_VERSION = answer;
  process.env.UPLOAD_TYPE = '1';
  process.env.SERVER_TYPE = 'rest';

  const { stdout, stderr } = await exec('vue-cli-service build && node ./script/s3Uploader.js');
  if (stderr) {
    console.log(stderr);
  }

  console.log(stdout);
  rl.close();
});
