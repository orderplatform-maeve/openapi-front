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

## ui

- 공통의 UI 개발을 위한 패키지

## utils

- 공통의 util 을 개발을 위한 패키지

# 패키지 추가시 주의 사항
- apps/{my-app} 에서 package/{my-package} 를 import 하여 빌드할때 절대 경로를 못찾는 문제가 있다.
- 왜냐하면 apps/{my-app} 의 ts-config 를 쓰기 때문에 package/{my-package} 에서 설정한 tsconfig 를 사용하지 않는다.
- 이를 해결하기 위해 최상위 tsconfig 인 `@torder/typescript-config/base.json` 에서 추가되는 하위 package 의 경로를 설정하도록 한다.
```json
    "paths": {
      "@/*": [
        "src/*",
        "../../packages/client-fetcher/src/*",
        "../../packages/ui",
        /* 각 apps 의 root 로 부터의 상대 경로를 적어야 함 */
      ]
    }
```
- 이렇게 설정 후 apps/{my-app} 에서 빌드 시 `@` 경로의 우선순위에 따라 `src/*` 를 먼저 탐색하고 찾지 못하게 되면 다음 경로에서 탐색을 이어나간다.
  - 단, 빌드하는 프로젝트(apps/{my-app})의 tsconfig.json 에 `compilerOptions.baseUrl: "."`이 설정되어 있어야 한다.
  - 그리고 tsconfig.json 에 paths 도 정의되어 있으면 안된다. 새로 정의하게 되면 path 를 덮어쓰기 때문
- 혹시라도 정말로 package 하위의 다른 라이브러리에서 같은 path 를 사용하게되면 이슈가 있을수 있으니 해당 내용을 항상 기억하고 있자. 
