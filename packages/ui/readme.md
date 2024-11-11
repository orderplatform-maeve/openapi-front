# Storybook


# 주의 사항
## style
CSS 파일에서 tailwind.css 를 import 하지 않도록 주의해야 합니다. <br/>
apps 내의 tailwind.css 와 충돌이 발생하여 compile 오류가 발생합니다. <br/>
개발 단계에서는 Storybook preview 에 import 하기 때문에 이슈 없습니다. <br/>

## tsconfig.json
type 추가를 위해 tsconfig.compilerOptions.types 를 정의하였다. <br/>
이에 따라 자동으로 추가되는 경로들의 타입들이 자동으로 추가되지 않으니 따로 설정해 주어야한다. <br/>
예들 들어 `node_modules/@types`는 자동으로 추가되는 경로이나 types 지정에 따라 자동으로 포함되지 않기 떄문에 `tsconfig.compilerOptions.typeRoots` 를 따로 설정하였다.





# Components (shadcn/ui)
 ``/src/components/ui``

# 주의 사항
packages/ui의 컴포넌트를 사용해서 개발 후 각 apps에서 build할 때는 
각 apps의 tsconfig.json이 참조되어 packages/ui의 경로 설정을 인식하지 못함

해결 방법 
1. Dist폴더 Watch 방식 
   - packages/ui를 빌드하고 dist 폴더를 watch 하는 방법
   - watch 할 패키지가 많은 경우 (ui, util...등) 컴퓨터가 버거워하고 속도가 느려지는 이슈 발생 
2. JIT (Just-In-Time) Compiler 활용
   - 런타임에 코드를 실시간으로 컴파일함 (파일을 가져와서 컴파일) 
   - 따라서 @를 사용 불가. 경로를 상대경로로 작성해줘야함

현재 개발팀에서는 2번 방식을 따라가기 때문에 상대 경로를 사용하도록 바꿔줘야함

## Shadcn/ui 컴포넌트 추가 방법 
shadcn/ui는 라이브러리가 아닌, 복사-붙여넣기 가능한 컴포넌트 모음으로 components.json이 필수적임
components.json의 설정을 읽어서 components/ui 안에 컴포넌트 파일을 생성

[버튼 추가 명렁어 예시](https://ui.shadcn.com/docs/components/button)
```
pnpm dlx shadcn@latest add button
```

components.json
```typescript
 "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
```
해당 부분에서 @를 사용하고 있기 때문에 build시 오류 발생
컴포넌트 파일을 생성해주고 꼭 @사용 부분의 경로를 상대경로로 변경하기


