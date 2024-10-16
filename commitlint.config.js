/**
 * 라이브러리: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
 *
 * 허용 패턴 예시 (https://torder.atlassian.net/wiki/spaces/T1PM/pages/520880239/Commit+PR+CodeReview#Commit-%EC%9E%91%EC%84%B1%EA%B7%9C%EC%B9%99)
 *    •	feat(auth): [ODPLFE-123] Implement new authentication flow
 *    •	fix(ui)!: [ODPLFE-456] Fix button alignment issue
 *    •	fix(user)!: [ODPLFE-789] Change user data format (BREAKING CHANGE)
 *    •	chore: [ODPLFE-321] Update dependencies
 *
 *    단, header 에 티켓번호 작성을 강제하는 옵션이 제공되지 않아 별도의 스크립트에서 검사
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    "body-max-line-length": [0, "always", Number.MAX_SAFE_INTEGER]
  },
};
