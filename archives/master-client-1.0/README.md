# 오더뷰 Readme

## 프로젝트 설명

매장 크루나 매니저들이 티오더를 관리 및 주문 제어 시스템

## 프로젝트 특징

- 티오더 접근 방식 [http://orderview.torder.co.kr/](http://orderview.torder.co.kr/) → [http://orderview.torder.co.kr/v/1/0/9/](http://orderview.torder.co.kr/v/1/0/9/) → 로그인 → 매장선택 → 디비에 지정된 매장 버젼 주소로 리다이렉션 (불필요한 주소이동 수정 필요해 보임)
- 프로덕션, 개발(dev), 테스트(Tmp), 데모(demo) 4가지로 빌드 타입 형태가 다르거나 개발 서버도 node 환경 변수로 분배되서 운영 되고 있다
- REST API 을 위한 SERVER URL 하나가 아니다
- 총 4가지의 URL이 있다 dev는 일반적으로 알고 있는 dev이지만 프로덕션에 포함되서 나갈때도 있다. demo도 마찬가지다. 방심한순간 골로가니 항상 배포전 서버담당자분에게 확인을 요청하는게 좋다. 즉 api별로 주소가 다르다.
  1. [http://demo.api.torder.co.kr](http://demo.api.torder.co.kr/)
  2. [http://rest.torder.co.kr](http://rest.torder.co.kr/)
  3. [http://admin.torder.co.kr](http://dev.order.torder.co.kr/)
  4. [http://api.torder.co.kr](http://api.torder.co.kr/)
- Vuex 모듈화 되어있지않다.
- vue socket io 모듈 사용중인데 이부분이 모듈로 분류가 안된다.
- 프로젝트내 이미지 소스들은 svg로 해서 vue컴포넌트화로 해서 사용 하고 있다.
  → 이유는 매장별로 s3에 업로드 되어있는 버젼이 다름이기 때문이다.
  예) 인생맥주 매장 [http://orderview.torder.co.kr/v/1/2/1/#/order](http://orderview.torder.co.kr/v/1/2/1/#/order)
  청담이상 매장 주소 [http://orderview.torder.co.kr/v/1/2/0/#/order](http://orderview.torder.co.kr/v/1/2/1/#/order)
  위와 같은 식일때 이미지 리소스 주소는 [http://orderview.torder.co.kr/](http://orderview.torder.co.kr/v/1/2/1/#/order) 이부분이 기본 패스로 보기때문에 이미지 경로 지정 에러가 난다.
  결국 webpack 번들러 설정을 하든 관련된 script 만들어야한다. Svg - Vue 컴포넌트로 이용 못한것 같은경우에는 그냥 이미지를 특정 s3 에 업로드해 그 주소를 복사해서 쓴다.
- 테스팅 해볼수 환경을 만들기 위해선 팀뷰어, 안드로이드 스튜디오, Aws s3, Aws Route53, 티오더 개발 어드민, 등 사용방법 및 설치를 해두어야 한다. (개발 및 테스팅 환경 구축이 일반 웹 프로젝트와 다름.)
- 프로덕션은 Android Gecko WebView 사용 → 파이어폭스 브라우저에서 디버깅
- 오프라인 Android Chrome WebView를 사용 → Android 코드내에서 디버깅 모드 활성화 시켜줄 코드 활성화 시켜야 디버깅 가능 (안드로이드 담당자에서 문의바람)
- 숫자 형태의 응답 데이터가 스트링으로 올때가 있으니 항상 캐스팅을 해야한다. Number(xxx)으로
- 컴포넌트내에 this.fx 함수가 없을땐, vue 구조체내에 ... 전개 연산자가 있는지 확인해봐야 한다.
- 개발 모드시 [http://localhost:8080/api/session](http://localhost:8080/api/session) 이런식으로 mock-api 등록된 api에 접근 가능하다. 하지만 mock 데이터를 이용해봣자 의미가 없다.

## 사전 필수 지식 목록

- ES6이상 JS 문법
- Vue 2 라이브러리
- Flux 디자인 패턴
- Webpack 5 번들러
- Atomic Design
- SPA 개념 이해
- Flex 스타일링
- Pug 마크업 템플릿
- Babel 트랜스파일러
- AWS S3 사용법
- MVVM 패턴 필수

## 개발 스펙

- vue 2 - 프론트 라이브러리
- webpack 5 - 개발 환경 및 빌드파일 설정
- pug - 마크업 템플릿
- scss - 스타일링
- ES6 이상 - javascirpt 문법
- vue-cli = vue 보일러 플레이트
- yarn 1.x 버전 사용 (node v12.x)

## 디렉토리 구조

```jsx
public - 웹팩 개발 서버에서 참조하는 index.html 파일이 지정
script - npm 및 yarn으로 사용할수 있는 스크립트 코드들
src - 메인 코드 및 리소스 들을 지니고 있는 폴더
tests - 테스팅 관련 코드
.editorconfig - ?
.gitignore - git에 추가 하면 안되는 목록 정보
aliases.config.js - 파일 절대 경로 config
package-lock.json - npm으로 node module 설치시 동일한 version 제공
package.json - 프로젝트 정보와 설치된 node modules 목록
README.md - 현재 읽고 있는 파일 매뉴얼이다.
s3-credentials.demo.json - 체험판 s3 배포 시 위한 키파일 git엔 업로드 금지!! 파일 필요시 담당자에게 요청
s3-credentials.json - 프로덕션 s3 배포 시 위한 키파일 git엔 업로드 금지!! 파일 필요시 담당자에게 요청
vue.config.js - vue cli 개발 환경 및 빌드 파일 생성을 위한 webpack 설정 파일
yarn.lock - yarn으로 node module 설치시 동일한 version 제공
```

### tests 디렉토리 구조

```jsx
mock-api - mock api 서버를 운영을 위한 폴더
 resources - mock datas
  routes - 기능별 api 코드들
 index.js - mock api server 동작 코드
```

### src 디렉토리 구조

```jsx
apis - rest api 및 주소
assets - 체험판에서 쓰일 이미지
componets - 여기서 컴포넌트는 프롭스만 있는게 아니라 섞여있음
config - 각종 config js 모음
modules - 외부 노드 모듈을 커스텀해서 사용하는 것들을 모아둔곳임, 왜인지 모르지만 Mixin.js도 여기에 존재 이유는 알수없음(이동시 또 후처리 작업이 잇어서 진행 안함)
router - vue router 정보
scss - 전역 스타일링
store - vuex 관련 파일 및 개발시 목업 json 파일들
svg - svg vue컴포넌트
translations - 지역화 관련 js
utils - vue 컴포넌트 도와주는 유틸들
App.vue - 최상단 vue 컴포넌트
main.js - 최상단 js
```

## 프로젝트 실행 방법

```jsx
스크립트 사용방법 예시: npm run dev or yarn dev

lint -> linting 실행 한다.
dev:stop-redirect -> 리다이렉션이 안되고 서버는 rest로 카르킨다. (endpoints.js에서 확인바람)
demo:stop-redirect -> 리다이렉션이 안되고 서버는 demo로 카르킨다. (endpoints.js에서 확인바람)
build -> 프로덕션 정적 파일 생성
deploy -> 프로덕션 배포. -> http://orderview.torder.co.kr/v/1/2/1/#/ 정식 넘버링 배포시 -> 스크립트 실행후
 -> 터미널에서 2/1를 입력후 엔터 하면 해당 디렉토리 구조로 s3에 업로드됨. (자세한건 script/deploy.js 코드 참조 바람)
deploy:tmp -> 프로덕션 배포. -> http://orderview.torder.co.kr/tmp/8 -> 스크립트 실행후
 -> 터미널에서 8를 입력후 엔터 하면 해당 디렉토리 구조로 s3에 업로드됨. (자세한건 script/deployTmp.js 코드 참조 바람)
deploy:dev -> 내부 개발자용 배포 -> rest 서버로 연결됨 -> http://dev.orderview.torder.co.kr 확인가능
deploy:dev:demo -> 내부 개발자용 배포 -> demo 서버로 연결됨 -> http://dev.orderview.torder.co.kr 확인가능
```

## 🚨 필독! 주의사항

### 문제 사항

마스터 프로젝트를 프로덕트로 빌드 시 동일한 CSS 파일을 읽어오기에 레이아웃 깨짐 현상이 발생한다.

### 해결 방법

웹팩 세팅을 새롭게 적용해야 하지만, 현재에는 현실적으로 어려움이 있어 프로덕트로 배포 시 development를 바라보게 함으로 대처하였다.
그러므로, 개발 서버 테스트를 할 경우 `isDev` 사용을 금하며, `STOP_REDIRECT`를 사용하여 테스트하도록 한다.

### PR label

모노레포(front-service) 에서 PR 생성시 `master-client-1.0` 라벨이 자동 추가 됩니다.
