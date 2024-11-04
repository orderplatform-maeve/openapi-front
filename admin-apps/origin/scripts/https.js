import fs from 'fs';

const checkHttpsPemKey = async () => {
  try {
    fs.readFileSync(`./certificates/_wildcard.torder.com.pem`, 'utf8');
    fs.readFileSync(`./certificates/_wildcard.torder.com-key.pem`, 'utf8');
  } catch {
    console.error('구동에 필요한 https 설정을 확인해주세요.');
    process.exit(1);
  }
};

await checkHttpsPemKey();
