# Animal Farm 단어 암기 체크 (React + Vite)

43개 단어 / 뜻 · 유의어 · 영영풀이 / 4지선다 / Chapter별 시험 / 자동 채점 / 오답 재시험.

## StackBlitz

1. StackBlitz에서 **React + Vite** 프로젝트를 만듭니다.
2. 이 ZIP의 파일을 프로젝트 루트에 같은 폴더 구조로 배치합니다.
3. `npm install` 후 `npm run dev`로 미리보기합니다.
4. StackBlitz에서 GitHub 저장소를 연결하고 `main` 브랜치로 푸시합니다.

## GitHub Pages

1. 저장소 이름을 `animal-farm-vocab`으로 만듭니다.
2. 다른 이름을 쓸 경우 `vite.config.js`의 `base: '/animal-farm-vocab/'`를 저장소 이름으로 바꿉니다.
3. GitHub → **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. `main` 브랜치에 푸시하면 `.github/workflows/deploy.yml`가 빌드 및 배포합니다.
5. 완료 후 `https://<GitHub아이디>.github.io/animal-farm-vocab/`로 접속합니다.

> 일반적인 `username.github.io` 루트 저장소라면 `base: '/'`를 사용합니다.

## 저장 안내

Firebase가 필요 없습니다. 현재 기기의 최근 총점 1회만 `localStorage`에 저장합니다.
학생별 로그인·서버 성적 수집·기기간 공유는 구현하지 않았습니다.
원본 학교 필기에는 오기 가능성이 있어 정답은 뜻/유의어/영영풀이 기준입니다.
