# <img src="https://www.torder.com/favicon.png" height=22> 티오더 오더플랫폼 FE 개발

## 목차

[1. 소개](#소개) <br/>
[2. 프로젝트 구조](#프로젝트-구조) <br/>
[3. 필수조건](#필수조건) <br/>
[4. 설치 및 설정](#설치-및-설정) <br/>
[5. 개발 워크 플로우](#개발-워크-플로우) <br/>
[6. 패키지 관리](#패키지-관리) <br/>
[7. 배포 Pipeline](#배포-Pipeline) <br/>
[8. 코드 스타일 및 모범사례](#코드-스타일-및-모범사례) <br/>
[9. 문제 해결](#문제-해결) <br/>
[10. 리소스 및 문서](#리소스-및-문서) <br/>
[11. 라이선스](#라이선스) <br/>

## 소개

### 도입 목적

기존 멀티 레포지토리에서의 문제점을 해결하고자합니다.

- 코드의 일관성
  - 공통모듈을 일관성있게 사용할 수 있도록 합니다.
  - 한곳에서 코드 수정 시 관련된 프로젝트들에 즉시 반영되어 코드 중복 및 버전 문제를 해소할 수 있습니다.
- 개발 환경 단순화
  - 단일 레포지토리에서 여러 프로젝트를 관리하므로 각 프로젝트마다 별도의 개발환경을 구성할 필요가 줄어듭니다.
  - 설정 파일 및 개발도구의 일관성을 유지하는데 도움이 됩니다.
- 협업 효율성 증대
  - 팀내 협업을 촉진시킵니다.
  - 공통의 작업공간에서 개발이 이루어지므로 팀원 간 작업의 명확성이 높아지고, 변경 사항을 쉽게 공유할 수 있습니다.
- 확장성
  - 여러 프로젝트 간의 종속성을 명확하게 정의하고 관리할 수 있어, 복잡한 시스템에서도 개발을 보다 효율적으로 진행 할 수 있습니다.

## 프로젝트 구조

각 하위 디렉토리는 아래와 같은 구조를 갖습니다.

### apps

배포단위의 사이트 프로젝트입니다.

- /apps/

### packages

공유와 책임 분리를 목적으로 구분되는 라이브러리입니다.

- /packages/ui
  - Design system

### archives

운영 되지만 모노레포로 관리할 수 없는 프로젝트입니다.

- /archives/

## 필수조건

### 개발환경

- node: >= 18.0
  - &nbsp;>= 20.0 권장
- pnpm >= 9.0

## 설치 및 설정

## 개발 워크 플로우

- [commit/PR/Code Review 가이드](https://torder.atlassian.net/wiki/spaces/T1PM/pages/520880239/Commit+PR+CodeReview)
- [Jira 사용 가이드](https://torder.atlassian.net/wiki/spaces/T1PM/pages/519700488/JIRA)
- [Git repository 관리 전략 가이드](https://torder.atlassian.net/wiki/spaces/T1PM/pages/541786124/Git+Repository)

## 패키지 관리

### 의존성 관리

- 추가
- 삭제
- 주의 사항

## 배포 Pipeline

## 코드 스타일 및 모범사례

## 문제 해결

### 일반적인 문제와 해결방법

### 자주 묻는 질문
- commit 시 eslint 에서 오류가 발생합니다.
  <details>
    <summary>확인하기</summary>
  
  - package.json 의 type 정의를 확인합니다.
    - type 이 module 인 경우 
      - 프로젝트에서 설치된 라이브러리를 기본적으로 ESM 으로 취급합니다. `eslint@9` 및 `@torder/eslint-config-9` 를 이용하여 eslint 를 설정합니다.
      ```javascript
      // package.json
      {
        devDependencies: {
          "@torder/eslint-config-9": "workspace:*"
        } 
      }

      // eslint.config.js
      import reactEsLint from "@torder/eslint-config-9/react.eslint.config.js"

      export default [
        ...reactEsLint,
      ];
      ```

    - type 이 정의되어 있지 않거나 commonjs 인 경우
      - 프로젝트의 기본설정이 cjs 입니다. `eslint@8` 및 `@torder/eslint-config` 를 이용하여 eslint 를 설정합니다.
      ```javascript
      // package.json
      {
        devDependencies: {
          "@torder/eslint-config": "workspace:*"
        }
      }

      // eslint.config.js
      module.exports = {
        root: true,
        extends: ["@torder/eslint-config/react-internal.js"],
        parser: "@typescript-eslint/parser",
        parserOptions: {
          project: true,
        }
      }
      ```
  </details>
  

## 리소스 및 문서

### 참고 문서

## 라이선스

이 소프트웨어는 티오더의 자산이며, 내부 사용 목적으로만 제공됩니다. 회사의 명시적인 허가 없이 외부로 복사, 수정, 배포하거나 사용할 수 없습니다.

### 사용 조건:

1. 이 소프트웨어는 티오더의 직원 또는 허가받은 계약자에 한해 내부에서만 사용이 허가됩니다.
2. 이 소프트웨어의 일부 또는 전체를 상업적 목적으로 사용하거나, 회사의 사전 서면 동의 없이 외부에 공개할 수 없습니다.
3. 소프트웨어를 제3자에게 무단으로 배포, 수정, 또는 공개하는 것은 엄격히 금지됩니다.
4. 이 소프트웨어는 "있는 그대로" 제공되며, 명시적이거나 묵시적인 어떠한 보증도 포함하지 않습니다. 티오더는 이 소프트웨어 사용으로 인해 발생하는 손해에 대해 책임을 지지 않습니다.
