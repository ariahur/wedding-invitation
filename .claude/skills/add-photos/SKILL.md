---
name: add-photos
description: 사진을 추가·교체·삭제·순서 변경할 때의 이미지 파이프라인 절차. assets/originals/<그룹>/ 확인 → npm run images → public/<그룹>/ 과 src/data/imageManifest.json 갱신 확인 → 커밋 대상 정리까지. "사진 추가해줘 / 바꿔줘 / 빼줘", "갤러리 순서 바꿔", "히어로 사진 교체", "about 사진", "타임라인 이미지", "이미지 최적화", "매니페스트 갱신" 등 사진·이미지 파일을 건드리는 모든 요청에 사용한다. 원본이 없는 상태에서 npm run images 를 돌리면 사진이 통째로 사라질 수 있으므로, 사진 관련 작업은 반드시 이 스킬의 사전 확인을 거친다.
---

# 사진 추가·교체

파이프라인은 한 줄이다:

```
assets/originals/<그룹>/*.jpg  →  npm run images  →  public/<그룹>/<이름>-<해시>-<너비>.webp (+jpg)  +  src/data/imageManifest.json
```

코드는 파일 경로를 직접 쓰지 않고 `imageProps('<그룹>/<파일명>', sizes)` / `imageGroup('<그룹>')` (`src/data/images.ts`) 로 매니페스트를 조회한다.
그래서 사진 작업의 산출물은 **`public/<그룹>/` 과 매니페스트 두 가지** 이고, 둘 다 커밋해야 배포에 반영된다.

그룹은 `scripts/optimize-images.mjs` 의 `GROUPS` 에 고정돼 있다: `gallery`, `hero`, `about`, `timeline`.
새 그룹이 필요하면 그 배열에 추가해야 변환된다.

## 0. 돌리기 전에 반드시 — 원본이 전부 있는지

원본(장당 5~7MB)은 `.gitignore` 대상이라 저장소에 없다. 이 기기의 `assets/originals/` 는 **비어 있을 수 있다.**

```bash
for g in gallery hero about timeline; do
  printf '%-9s 원본 %3d장 / 매니페스트 %3d장\n' "$g" \
    "$(ls assets/originals/$g 2>/dev/null | grep -Eic '\.(jpe?g|png)$')" \
    "$(node -e "console.log((require('./src/data/imageManifest.json')['$g']||[]).length)")"
done
```

읽는 법:
- **어떤 그룹이든 원본 < 매니페스트** 면 그 그룹은 원본이 부족한 상태다. 이대로 `npm run images` 를 돌리면 그 그룹의 `public/` 파일이 **정리(prune)되어 삭제** 되고 매니페스트가 줄어든다 — 스크립트는 "원본이 하나도 없을 때" 만 중단하지, 일부만 없을 때는 막지 않는다.
  → 사용자에게 원본 보관처(로컬/클라우드)에서 가져와 달라고 요청하고 멈춘다. 대신 돌리지 않는다.
- 원본 수가 매니페스트와 같거나 많으면 진행한다.

이 확인을 건너뛰고 사진이 사라진 것을 커밋하면 되돌리기 어렵다 (원본이 없으니 다시 만들 수도 없다).

## 1. 원본 넣기

- 파일명 규칙: 갤러리는 **파일명 정렬 순서가 곧 화면 배치 순서** 다 (`src/data/gallery.ts`). 현재 `14-79180.jpg` 처럼 `<순번>-<사진번호>` 를 쓴다. 중간에 끼워 넣으려면 순번을 다시 매긴다.
- 사진 내용이 같아도 파일이 바뀌면 해시가 바뀌어 파일명이 달라진다. 이건 의도된 것(CDN 캐시 갱신)이니 놀라지 않는다.
- 교체는 같은 파일명으로 덮어쓰기, 삭제는 원본 파일을 지우면 다음 실행에서 `public/` 도 정리된다.
- EXIF 회전은 스크립트가 픽셀에 반영하므로 미리 돌려둘 필요 없다.

## 2. 변환

```bash
npm run images
```

이미 변환된 파일은 건너뛰므로 사진 몇 장을 추가해도 금방 끝난다. 출력에서 그룹별 `원본 N장 → 새로 만든 파일 M개, 정리 K개` 를 확인하고, **정리 K개가 예상과 다르면** (지운 적 없는데 정리됐다면) 0절로 돌아가 원본 누락을 의심한다.

## 3. 코드 쪽 확인

- 갤러리: `PAGE_BREAKS` (`src/data/gallery.ts`) 는 사진 번호 기준이라 순번을 바꿔도 유지된다. 페이지 시작점을 옮기고 싶을 때만 손댄다.
- 타임라인·About: `imageProps('timeline/2013', ...)` 처럼 **파일명(확장자 제외)** 으로 참조하므로, 파일명을 바꿨으면 참조도 바꾼다. `grep -rn "imageProps(\|singleSrc(" src/` 로 찾는다.
- Hero: `HeroPassFlip` 의 크롭 프레이밍이 특정 사진에 맞춰져 있다 (최근 커밋 "adjust HeroPassFlip crop framing"). 히어로 사진을 바꾸면 `src/components/HeroPassFlip/HeroPassFlip.css` 의 `object-position` 류를 사용자와 확인한다.
- OG 이미지는 `App.tsx` 가 `/hero/hero-couple.jpg` 를 직접 가리킨다 — 매니페스트와 무관한 별도 파일이므로 히어로 교체 시 이 파일도 바꿀지 묻는다.

## 4. 검증과 커밋 대상

```bash
npm run build
git status --short public/ src/data/imageManifest.json
```

커밋에 들어가야 하는 것: `public/<그룹>/` 의 추가·삭제 파일 전부 + `src/data/imageManifest.json`.
들어가면 안 되는 것: `assets/originals/` (gitignore 가 막지만 `git add -f` 는 쓰지 않는다).
커밋은 사용자가 요청할 때만 하고, 요청받으면 위 두 가지가 같은 커밋에 들어가게 한다 — 매니페스트만 올라가면 배포에서 404 가 난다.

## 보고

그룹별 장수 변화, 새로 만든/정리한 파일 수, 코드에서 바꾼 참조, 원본 보관처에 새 원본을 올려두라는 안내를 남긴다.
