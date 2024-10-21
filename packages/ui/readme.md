# Storybook


# 주의 사항
## tsconfig.json
type 추가를 위해 tsconfig.compilerOptions.types 를 정의하였다. <br/>
이에 따라 자동으로 추가되는 경로들의 타입들이 자동으로 추가되지 않으니 따로 설정해 주어야한다. <br/>
예들 들어 `node_modules/@types`는 자동으로 추가되는 경로이나 types 지정에 따라 자동으로 포함되지 않기 떄문에 `tsconfig.compilerOptions.typeRoots` 를 따로 설정하였다.
