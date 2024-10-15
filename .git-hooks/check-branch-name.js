const { execSync } = require('child_process');

function checkBranchName() {
    const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const gitFlowPattern = /^(feature|hotfix|release|bugfix)\/[a-zA-Z0-9._-]+$|^HEAD$/;

    if(!gitFlowPattern.test(branchName)) {
        console.error(`🚫 Invalid branch name: ${branchName}`);
        console.error('gitflow branch 이름 형식의 브랜치를 생성해주세요.');
        process.exit(1);
    }
}

checkBranchName();

console.info('Branch name is okay!');
