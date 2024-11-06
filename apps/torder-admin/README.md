# 티오더 어드민

- 국내 (origin)
- 북미 (us)
- 싱가포르 (singapore)
- 시드니 (sydney)

## Folder Structure

> public - resources <br/>
> src <br/>
> ⎣&nbsp;**api** - BFF <br/>
> ⎣&nbsp;**components** - 컴포넌트<br/>
> ⎣&nbsp;**pages** <br/>
> ⎣&nbsp;**styles** - css 모음<br/>

## Installation & Run

### 1. node 버전 세팅

```
// node version 20버전 이상 사용 권장
nvm use v20.12.0
```

### 2. dependency 설치
pnpm-lock 파일 기준으로 설치

```
pnpm install --frozen-lock
```

### 3. Localhost Domain 추가(MAC Ver)

```
// 터미널 실행후 아래 경로의 파일을 수정
sudo vim /private/etc/hosts

// 아래의 내용 추가
127.0.0.1    local.torder.com    // 티오더 국내(new)+해외
```

### 4. 로컬환경 실행

터미널 실행 후 아래 내용 입력
```
pnpm dev
```

## Version Control

- `Major.Minor.Patch-Hotfix`
    - package.json version 에 기재
    - Hotfix: 정식배포 이후 긴급 배포 시 1씩 증가. 필수 X
- 좌측 메뉴바 하단 `v.Major.Minor.Patch` 형식으로 표기
