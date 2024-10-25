# master-tablet
마스터1,2를 통합하는 마스터 태블릿 

## 기술스택
- Vite (v5)
- pnpm (v9)
- React 18
- TypeScript (v5)
- Tailwind CSS (v3)
- TanStack Query (v4)
- Vitest + MSW
- Lodash-es
- Day.js
- Storybook 

## 시작하기
- Node.js (v18 이상)
- pnpm (v9 이상)

## 프로젝트 디렉토리 구조

```
src/
├── assets/           # assets 파일들
│   ├── images/ 
│   ├── svgs/ 
│   ├── ...
│
├── configs/          # 설정 파일들
│   
├── features/          # 도메인별 기능들 
│   └── commons/      # {feature} + {feature}  
│   ├── auth/          # features/{feature} 
│   │   ├── components/  # 컴포넌트들
│   │   │   ├── LoginForm
│   │   │   │   ├── LoginForm.module.css  # CSS 파일
│   │   │   │   ├── LoginForm.test.tsx    # 테스트 파일
│   │   │   │   ├── index.tsx  
│   │   └── contexts/      # 기능에서 사용하는 context 파일  
│   │
│   └── products/ 
│   │    ├── components/ 
│   │    └── contexts/ 
│   └── ...
│
├── pages/           
│   │── HomePage   
│   │   ├── HomePage.styles.css  # CSS 파일
│   │   ├── HomePage.test.tsx    # 테스트 파일
│   │   ├── HomePage.stories.tsx # 스토리북 파일
│   │   ├── index.tsx 
│   └── ...
│
├── routes/           # 라우팅 설정들
│
├── utills/           # utill 설정들  
│
│── stores/      # 상태 관리 파일들

```

## 구조 설명

### assets 
필요한 assets 파일들을 포함합니다:
- images
- svgs
- ...

### configs
필요한 설정 파일들을 포함합니다:
- mocks
- ...

### features 
각 기능(feature)은 다음 요소들을 포함합니다:
- components/
  - 해당 기능에서 사용되는 모든 컴포넌트
  - 컴포넌트별로 스타일, 테스트 파일 포함 
- context/ 
  - 기능 내부에서 사용하는 context 


### 페이지
페이지는 여러 기능을 조합할 수 있습니다

### 라우팅
라우팅 설정을 포함합니다:


## 컨벤션 
### export/import
{component}/index.tsx 에서는 가능한 default를 사용하지 않고 여러 요소를 export 합니다: