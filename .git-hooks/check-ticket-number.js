const fs = require('fs');

const jiraProjects = ['ODPLFE', 'BTS', 'BTSM']; // JIRA 프로젝트 키워드 배열
const commitMsgFile = process.env.HUSKY_GIT_PARAMS || process.argv[2];
const commitMessage = fs.readFileSync(commitMsgFile, 'utf-8').trim();

const jiraTicketPattern = new RegExp(`\\[(${jiraProjects.join('|')})-\\d+\\]`);

if (!jiraTicketPattern.test(commitMessage)) {
    console.error(`🚫 Commit message is missing a valid JIRA ticket number: ${commitMessage}`);
    process.exit(1);
}



console.info(`Commit msg has ticket number. ${jiraTicketPattern.exec(commitMessage).join(', ')}`);
