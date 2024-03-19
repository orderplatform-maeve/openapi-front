# FE OpenAPI Generator 적용 프로젝트
[FE 커피챗 문서: 코드 자동화 OpenAPI Generator](https://www.notion.so/torderkorea/OpenAPI-Generator-6b739273d53a4265b0c25db065369979?pvs=4) 문서의 내용 적용


## OpenAPI Generator 적용 환경
- OpenAPI Generator: [typescript-axios](https://openapi-generator.tech/docs/generators/typescript-axios/) 사용
- Swagger에서 제공하는 [PetStore sample api](https://editor.swagger.io/?url=https://petstore.swagger.io/v2/swagger.yaml) 활용
  - generate target: https://petstore.swagger.io/v2/swagger.json
---

### 1. openapi-generator-cli 의존성 추가
- `npm install @openapitools/openapi-generator-cli -D`

###

### 2. package.json
```json
"scripts": {
"openapi-tsc": "openapi-generator-cli generate -g typescript-axios -i https://petstore.swagger.io/v2/swagger.json -o ./src/generate",
"openapi-tsc-template": "openapi-generator-cli author template -g typescript-axios -o ./mustaches",
}
```
- `$ npm run openapi-tsc`
  - openapi-generator-cli 기본 generator 설정
  - ./src/generate 에 모든 산출물이 생성됨


- `$ npm run openapi-tsc-template`
  - generate 결과물들의 포맷팅을 위해 기본 템플릿 받아오기.
  - ./mustaches 에 생성된 .mustache 파일을 수정해서 컨벤션 수정 필요
