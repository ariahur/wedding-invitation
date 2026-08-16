/**
 * 원본 사진을 웹용 이미지로 변환한다.
 *
 *   assets/originals/<그룹>/*.jpg  →  public/<그룹>/<이름>-<해시>-<너비>.webp (+ 폴백 jpg)
 *
 * 사용법:
 *   1. assets/originals/gallery/ 에 사진을 넣는다 (파일명 순서대로 갤러리에 배치된다)
 *   2. npm run images
 *   3. 생성된 public/gallery/*, public/hero/*, src/data/imageManifest.json 을 커밋한다
 *
 * 원본은 .gitignore 대상이라 저장소에 올라가지 않는다. 따로 보관할 것.
 * 이미 변환된 사진은 건너뛰므로, 새 사진만 추가해도 부담 없이 다시 돌릴 수 있다.
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = 'src/data/imageManifest.json';

/** 레이아웃이 430px 컨테이너 기준이라 3배 해상도까지 커버하면 충분하다 */
const WIDTHS = [480, 960, 1440];
/** webp를 못 읽는 구형 브라우저용 폴백 한 장 */
const FALLBACK_WIDTH = 960;
const WEBP_QUALITY = 80;
const JPEG_QUALITY = 78;
/** 로딩 중 자리를 채우는 흐릿한 미리보기의 가로 픽셀 */
const PLACEHOLDER_WIDTH = 16;

const GROUPS = ['gallery', 'hero', 'about', 'timeline'];

/** 변환 결과 파일명 규칙 — 정리(prune) 대상을 가려낼 때도 쓴다 */
const OUTPUT_PATTERN = /-[0-9a-f]{8}-\d+\.(webp|jpg)$/;

const isSource = (file) => /\.(jpe?g|png)$/i.test(file) && !file.startsWith('.');

/** 원본이 바뀌었을 때만 다시 변환하기 위한 비교 */
const isUpToDate = async (outPath, sourceMtime) => {
  try {
    const { mtimeMs } = await stat(outPath);
    return mtimeMs >= sourceMtime;
  } catch {
    return false;
  }
};

/** 파일 내용 해시 앞 8자 — 사진을 바꾸면 파일명도 바뀌어야 CDN 캐시가 갱신된다 */
const contentHash = async (filePath) =>
  createHash('sha1').update(await readFile(filePath)).digest('hex').slice(0, 8);

const processImage = async (sourcePath, outDir, stem) => {
  const { mtimeMs } = await stat(sourcePath);
  const base = `${stem}-${await contentHash(sourcePath)}`;
  const pipeline = sharp(sourcePath).rotate(); // EXIF 회전 정보를 픽셀에 반영
  const { width, height } = await pipeline.metadata();

  // 원본보다 크게 늘리지 않되, 원본이 작으면 그 크기 그대로도 한 장 남겨
  // 가장 큰 화면에서 필요 이상으로 흐려지지 않게 한다
  const widths = WIDTHS.filter((w) => w < width);
  widths.push(Math.min(width, WIDTHS[WIDTHS.length - 1]));

  let generated = 0;

  for (const targetWidth of widths) {
    const outPath = path.join(outDir, `${base}-${targetWidth}.webp`);
    if (await isUpToDate(outPath, mtimeMs)) continue;

    await pipeline
      .clone()
      .resize({ width: targetWidth })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outPath);
    generated += 1;
  }

  const fallbackWidth = Math.min(FALLBACK_WIDTH, width);
  const fallbackPath = path.join(outDir, `${base}-${fallbackWidth}.jpg`);
  if (!(await isUpToDate(fallbackPath, mtimeMs))) {
    await pipeline
      .clone()
      .resize({ width: fallbackWidth })
      .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
      .toFile(fallbackPath);
    generated += 1;
  }

  const placeholder = await pipeline
    .clone()
    .resize({ width: PLACEHOLDER_WIDTH })
    .webp({ quality: 40 })
    .toBuffer();

  return {
    entry: {
      base,
      width,
      height,
      widths,
      fallbackWidth,
      placeholder: `data:image/webp;base64,${placeholder.toString('base64')}`,
    },
    generated,
  };
};

/** 더 이상 원본이 없는 옛 변환 결과를 지운다 */
const pruneStale = async (outDir, keep) => {
  const existing = await readdir(outDir).catch(() => []);
  const stale = existing.filter((file) => OUTPUT_PATTERN.test(file) && !keep.has(file));

  await Promise.all(stale.map((file) => unlink(path.join(outDir, file))));
  return stale.length;
};

const run = async () => {
  const manifest = {};
  let sourceCount = 0;

  for (const group of GROUPS) {
    const srcDir = path.join(ROOT, 'assets/originals', group);
    const outDir = path.join(ROOT, 'public', group);

    const files = (await readdir(srcDir).catch(() => [])).filter(isSource).sort();
    if (files.length === 0) {
      console.log(`· ${group}: 원본 없음 (${path.relative(ROOT, srcDir)})`);
      manifest[group] = [];
      continue;
    }

    sourceCount += files.length;
    await mkdir(outDir, { recursive: true });

    const entries = [];
    const keep = new Set();
    let generated = 0;

    for (const file of files) {
      const stem = path.basename(file, path.extname(file));
      const result = await processImage(path.join(srcDir, file), outDir, stem);

      generated += result.generated;
      entries.push(result.entry);

      for (const w of result.entry.widths) keep.add(`${result.entry.base}-${w}.webp`);
      keep.add(`${result.entry.base}-${result.entry.fallbackWidth}.jpg`);
    }

    const pruned = await pruneStale(outDir, keep);
    manifest[group] = entries;

    console.log(
      `· ${group}: 원본 ${files.length}장 → 새로 만든 파일 ${generated}개` +
        (pruned ? `, 정리 ${pruned}개` : '')
    );
  }

  // 원본이 하나도 없는 곳(배포 서버, 원본을 못 받은 클론 등)에서 돌면
  // 멀쩡한 manifest를 빈 값으로 덮어써 사진이 통째로 사라진다.
  if (sourceCount === 0) {
    console.error(
      '\n원본을 찾지 못해 중단합니다. assets/originals/ 아래에 사진을 넣고 다시 실행하세요.\n' +
        '(원본은 저장소에 올라가지 않으니 따로 보관한 파일을 가져와야 합니다)'
    );
    process.exit(1);
  }

  await writeFile(path.join(ROOT, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`↳ ${MANIFEST}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
