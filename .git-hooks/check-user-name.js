const { execSync } = require('child_process');

// Git config에서 사용자 이름 가져오기
const username = execSync('git config user.name', { encoding: 'utf-8' }).trim();

// 사용자 이름이 'orderplatform-'으로 시작하는지 체크
const usernamePattern = /^orderplatform-[a-zA-Z]+$/;

console.log(`username: ${username}`);

if (usernamePattern.test(username)) {
  console.log(`✅ Username format is correct: ${username}`);
  process.exit(0); // 성공적으로 종료
} else {
  console.error(`❌ Username format is incorrect: ${username}`);
  console.error("Please set your git username in the format 'orderplatform-${name}'");
  process.exit(1); // 에러로 종료
}
