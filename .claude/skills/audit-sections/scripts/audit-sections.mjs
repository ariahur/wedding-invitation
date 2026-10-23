/**
 * 섹션 CSS가 src/sections/CLAUDE.md 의 정본과 같은지, 색·폰트가 테마 규칙 안에 있는지 검사한다.
 *
 *   node .claude/skills/audit-sections/scripts/audit-sections.mjs
 *
 * 정본은 이 파일에 박아두지 않고 src/sections/CLAUDE.md 의 3·4·5절 코드 블록과
 * THEME_COLORS.md 의 색상 표를 매번 읽어서 쓴다. 문서를 고치면 검사 기준도 같이 바뀐다.
 *
 * 종료 코드: 위반(✗)이 하나라도 있으면 1, 없으면 0.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const rel = (p) => path.relative(ROOT, p);

/* ---------- 아주 작은 CSS 파서 (규칙·선언·미디어쿼리만) ---------- */

const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
const lineOf = (src, index) => src.slice(0, index).split('\n').length;

/** { rules: [{selector, media, decls, line}], topLevel: [{kind:'rule'|'media', name, line}] } */
const parseCss = (raw) => {
  const src = stripComments(raw);
  const rules = [];
  const topLevel = [];
  let i = 0;

  const skipBlock = () => {
    let depth = 1;
    while (depth && i < src.length) {
      if (src[i] === '{') depth += 1;
      else if (src[i] === '}') depth -= 1;
      i += 1;
    }
  };

  const walk = (media) => {
    while (i < src.length) {
      const open = src.indexOf('{', i);
      const close = src.indexOf('}', i);
      if (open < 0) return;
      if (close >= 0 && close < open) {
        i = close + 1;
        return;
      }
      const selector = src.slice(i, open).trim();
      const line = lineOf(src, open);
      i = open + 1;

      if (selector.startsWith('@media')) {
        if (!media) topLevel.push({ kind: 'media', name: selector.replace(/\s+/g, ' '), line });
        walk(selector.replace(/\s+/g, ' '));
        continue;
      }
      if (selector.startsWith('@')) {
        skipBlock();
        continue;
      }

      const end = src.indexOf('}', i);
      const body = src.slice(i, end);
      i = end + 1;

      const decls = {};
      for (const part of body.split(';')) {
        const k = part.indexOf(':');
        if (k <= 0) continue;
        const prop = part.slice(0, k).trim();
        const value = part.slice(k + 1).trim().replace(/\s+/g, ' ').replace(/'/g, '"');
        decls[prop] = value;
      }
      for (const sel of selector.split(',').map((s) => s.trim())) {
        if (!media) topLevel.push({ kind: 'rule', name: sel, line });
        rules.push({ selector: sel, media, decls, line });
      }
    }
  };

  walk(null);
  return { rules, topLevel };
};

/** 같은 선택자+미디어의 선언을 순서대로 합친다 (뒤에 온 값이 이김) */
const mergedDecls = (rules, selector, media) => {
  const hits = rules.filter((r) => r.selector === selector && r.media === media);
  if (hits.length === 0) return null;
  return { decls: Object.assign({}, ...hits.map((r) => r.decls)), line: hits[0].line };
};

/* ---------- 정본 읽기 ---------- */

const guide = readFileSync(path.join(ROOT, 'src/sections/CLAUDE.md'), 'utf8');

/** "## N." 절 아래 첫 ```css 블록 */
const cssBlockOfSection = (n) => {
  const start = guide.search(new RegExp(`^## ${n}\\.`, 'm'));
  if (start < 0) return '';
  const rest = guide.slice(start);
  const m = rest.match(/```css\n([\s\S]*?)```/);
  return m ? m[1] : '';
};

const canonical = parseCss([3, 4, 5].map(cssBlockOfSection).join('\n'));
const canonicalRules = canonical.rules; // 선택자는 .my-section / .my-section__title / .my-section__subtitle

const theme = stripComments(readFileSync(path.join(ROOT, 'THEME_COLORS.md'), 'utf8'));
const allowedHex = new Set(theme.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []);
const allowedHexLower = new Map([...allowedHex].map((h) => [h.toLowerCase(), h]));

const indexHtml = readFileSync(path.join(ROOT, 'public/index.html'), 'utf8');
const loadedFonts = new Set(
  [...indexHtml.matchAll(/family=([A-Za-z+]+)/g)].map((m) => m[1].replace(/\+/g, ' '))
);
const genericFonts = new Set(['serif', 'sans-serif', 'monospace', 'system-ui', 'inherit', 'cursive']);

/* ---------- 대상 파일 ---------- */

const walkDir = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walkDir(p) : [p];
  });

const allCss = walkDir(path.join(ROOT, 'src')).filter((p) => p.endsWith('.css'));
const sectionCss = allCss.filter((p) => /src\/sections\/[A-Za-z]+Section\.css$/.test(p)).sort();

/* ---------- 리포트 ---------- */

let failures = 0;
let warnings = 0;
const out = [];
const fail = (msg) => { failures += 1; out.push(`  ✗ ${msg}`); };
const warn = (msg) => { warnings += 1; out.push(`  ! ${msg}`); };
const ok = (msg) => out.push(`  ✓ ${msg}`);
const head = (msg) => out.push(`\n${msg}`);

/* 1. 섹션별 타이틀 / 루트 / 보조문구 */

head('■ 섹션 정본 대조 (src/sections/CLAUDE.md 3·4·5절)');

const compare = (file, parsed, block, canonSelector, media, required) => {
  const selector = canonSelector.replace('.my-section', `.${block}`);
  const canon = mergedDecls(canonicalRules, canonSelector, media);
  if (!canon) return;
  const actual = mergedDecls(parsed.rules, selector, media);
  const where = media ? `${selector} @ ${media}` : selector;

  if (!actual) {
    if (required) fail(`${rel(file)}: ${where} 블록이 없음`);
    return;
  }
  const diffs = [];
  for (const [prop, value] of Object.entries(canon.decls)) {
    if (!(prop in actual.decls)) diffs.push(`${prop} 누락 (정본 ${value})`);
    else if (actual.decls[prop] !== value) diffs.push(`${prop}: ${actual.decls[prop]} → 정본 ${value}`);
  }
  for (const prop of Object.keys(actual.decls)) {
    if (!(prop in canon.decls) && canonSelector.includes('__title')) diffs.push(`${prop} 는 정본에 없는 추가 선언`);
  }
  if (diffs.length) fail(`${rel(file)}:${actual.line} ${where}\n      - ${diffs.join('\n      - ')}`);
};

for (const file of sectionCss) {
  const parsed = parseCss(readFileSync(file, 'utf8'));
  const titleRule = parsed.rules.find((r) => !r.media && /^\.[a-z-]+__title$/.test(r.selector));
  const name = path.basename(file, '.css');

  if (!titleRule) {
    out.push(`  · ${name}: __title 없음 — Hero/ThankYou 계열 예외 섹션으로 보고 정본 대조 생략`);
  } else {
    const block = titleRule.selector.slice(1).replace(/__title$/, '');
    const before = failures;
    compare(file, parsed, block, '.my-section', null, true);
    compare(file, parsed, block, '.my-section__title', null, true);
    compare(file, parsed, block, '.my-section__title:lang(en)', null, true);
    compare(file, parsed, block, '.my-section__title', '@media (max-width: 430px)', true);
    compare(file, parsed, block, '.my-section__title:lang(en)', '@media (max-width: 430px)', true);
    compare(file, parsed, block, '.my-section__subtitle', null, false);
    compare(file, parsed, block, '.my-section__subtitle:lang(en)', null, false);
    if (failures === before) ok(`${name} (.${block})`);
  }

  // 반응형 규칙
  const medias = parsed.topLevel.filter((t) => t.kind === 'media');
  for (const m of medias) {
    if (m.name !== '@media (max-width: 430px)' && m.name !== '@media (prefers-reduced-motion: reduce)') {
      fail(`${rel(file)}:${m.line} 허용되지 않은 브레이크포인트 ${m.name} (430px 하나만 사용)`);
    }
  }
  const firstMediaIdx = parsed.topLevel.findIndex((t) => t.kind === 'media');
  if (firstMediaIdx >= 0) {
    const after = parsed.topLevel.slice(firstMediaIdx).filter((t) => t.kind === 'rule');
    if (after.length) warn(`${rel(file)}:${after[0].line} 미디어쿼리 뒤에 일반 규칙이 있음 — 미디어쿼리는 파일 끝에 모은다`);
    const names = medias.map((m) => m.name);
    const rm = names.indexOf('@media (prefers-reduced-motion: reduce)');
    const mw = names.lastIndexOf('@media (max-width: 430px)');
    if (rm >= 0 && mw > rm) warn(`${rel(file)}: 순서는 430px → prefers-reduced-motion 이어야 함`);
    if (names.filter((n) => n === '@media (max-width: 430px)').length > 1) {
      warn(`${rel(file)}: @media (max-width: 430px) 블록이 ${names.filter((n) => n === '@media (max-width: 430px)').length}개 — 하나로 합치는 편이 대조하기 쉬움`);
    }
  }
}

/* 2. 색상 */

head('■ 색상 (THEME_COLORS.md 에 적힌 표기만 허용)');

const hexUses = new Map(); // hex → Set(file:line)
for (const file of allCss) {
  const src = stripComments(readFileSync(file, 'utf8'));
  src.split('\n').forEach((lineText, idx) => {
    for (const m of lineText.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      const hex = m[0];
      if (!hexUses.has(hex)) hexUses.set(hex, new Set());
      hexUses.get(hex).add(`${rel(file)}:${idx + 1}`);
    }
  });
}
let colorIssues = 0;
for (const [hex, places] of [...hexUses].sort()) {
  if (allowedHex.has(hex)) continue;
  colorIssues += 1;
  const canonSpelling = allowedHexLower.get(hex.toLowerCase());
  const list = [...places].slice(0, 4).join(', ') + (places.size > 4 ? ` 외 ${places.size - 4}곳` : '');
  if (canonSpelling) fail(`${hex} 표기 불일치 → 정본 ${canonSpelling}  (${list})`);
  else fail(`${hex} 는 THEME_COLORS.md 에 없는 색  (${list})`);
}
if (!colorIssues) ok(`hex ${hexUses.size}종 모두 정본에 있음`);

/* 3. 폰트 */

head('■ 폰트 (public/index.html 에서 로드하는 것만, 역할대로)');

let fontIssues = 0;
for (const file of allCss) {
  const parsed = parseCss(readFileSync(file, 'utf8'));
  const base = path.basename(file);
  for (const r of parsed.rules) {
    const ff = r.decls['font-family'];
    if (!ff) continue;
    const names = ff.split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
    // 코드 블록용 모노스페이스 스택(CRA 기본)은 화면 문구가 아니므로 제외
    if (names[names.length - 1] === 'monospace') continue;
    for (const n of names) {
      if (genericFonts.has(n) || loadedFonts.has(n)) continue;
      fontIssues += 1;
      fail(`${rel(file)}:${r.line} 로드하지 않는 폰트 "${n}" (${r.selector})`);
    }
    // Roboto 는 "기계 인쇄 라벨" 장치다. 라벨 서명(letter-spacing 또는 uppercase)이 없으면 본문에 쓴 것으로 본다
    if (names.includes('Roboto') && base !== 'HeroBoardingPassSection.css') {
      const isLabel = 'letter-spacing' in r.decls || r.decls['text-transform'] === 'uppercase';
      if (!isLabel) {
        fontIssues += 1;
        warn(`${rel(file)}:${r.line} Roboto 를 라벨 서명(letter-spacing / uppercase) 없이 사용 — 본문에 쓴 것이면 Gowun Dodum/Lora 로 (${r.selector})`);
      }
    }
    if (names.includes('Dancing Script') && base !== 'LoadingScreen.css') {
      fontIssues += 1;
      warn(`${rel(file)}:${r.line} Dancing Script 는 로딩 화면 한 곳 전용 (${r.selector})`);
    }
  }
}
if (!fontIssues) ok('font-family 전부 역할표 안에 있음');

/* ---------- 출력 ---------- */

console.log(out.join('\n'));
console.log(`\n결과: 위반 ${failures}건, 주의 ${warnings}건`);
process.exit(failures ? 1 : 0);
