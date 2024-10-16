# shared-types

## 배경
- 각 프로젝트의 공통 전역 타입을 설정하기 위해 정의

## 설치방법
- pnpm install --save-dev @types/torder-shared-type
- 위 명령어로 설치가 불가능할때 package.json 의 devDependencies 에 직접 추가후 설치한다
  - 설치 명령어를 실행하지 않으면 하드링크가 생성되지 않음
 
## 주의사항
- tsconfig 에서 별도의 설정을 하지 않고 불러오기 위해 패키지명의 prefix 를 @types 를 사용한다. tsconfig.types 를 설정하게 되면 자동으로 불러올수 없으니 유의
