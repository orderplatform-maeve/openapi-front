# packages

공통 로직 혹은 UI 를 개발하고 공유하기 위한 경로입니다. <br/>
package 이름은 @torder/_ 를 사용합니다. <br/>
참조는 `workspace:_` 를 이용하여 참조합니다. <br/>

예시)

```json
{
  "dependencies": {
    "@torder/ui": "workspace:*"
  }
}
```

## eslint-config

- eslint 8.x 를 지원하기 위한 패키지

## eslint-config-9

- eslint 9.x 를 지원하기 위한 패키지

## shared-types

- 공통의 타입정의를 위한 패키지
  - @types/torder-shared-types

## typescript-config

- 공통의 타입스크립트 설정을 위한 패키지
