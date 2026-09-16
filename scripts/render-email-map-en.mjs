/**
 * 확인 메일(영문) 하단에 붙는 지도 이미지를 만든다.
 *
 *   OpenStreetMap(Overpass) 데이터  →  public/email-map-en.jpg (1200×600)
 *
 * 사용법:
 *   npm run email-map
 *   → 생성된 public/email-map-en.jpg 를 커밋한다.
 *
 * 왜 직접 그리는가:
 *   구글·카카오·네이버 지도는 영문 모드에서도 상호·정류장 이름이 한국어로 남고,
 *   라벨 없는 타일 서비스는 API 키가 필요하다. 그래서 건물·도로·하천 도형만 받아
 *   필요한 영문 라벨(예식장, 삼성역, 큰 도로, 탄천)만 얹는다.
 *
 * 한국어 메일의 지도(public/email-map.jpg)는 카카오맵 캡처이며 이 스크립트와 무관하다.
 * 색은 테마 팔레트(네이비 #1A2F4A · 골드 #C9A77C · 베이지 #E6D8C3)를 따른다.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'email-map-en.jpg');

// 그릴 범위(위도·경도). 지도 중심 · 예식장(역삼로 607, OSM way 668205094) · 삼성역
const W = 1200, H = 600, Z = 16, S = 2;
const CENTER = { lat: 37.5072, lon: 127.0650 };
const VENUE = { lat: 37.506074, lon: 127.066693 };
const VENUE_WAY = 668205094;
const STATION = { lat: 37.50884, lon: 127.06314 };
const n = 2 ** Z;
const proj = ({ lat, lon }) => { const r = lat * Math.PI / 180; return { x: (lon + 180) / 360 * n * 256 * S, y: (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n * 256 * S }; };
const c = proj(CENTER); const ox = Math.round(c.x - W / 2), oy = Math.round(c.y - H / 2);
const toPx = (p) => { const q = proj(p); return { x: q.x - ox, y: q.y - oy }; };
const f = (v) => v.toFixed(1);
const pathOf = (pts, close) => 'M' + pts.map((p) => `${f(p.x)} ${f(p.y)}`).join(' L') + (close ? ' Z' : '');

const BBOX = '37.5036,127.0570,37.5108,127.0730';
const QUERY = `[out:json][timeout:60];
(
  way["building"](${BBOX});
  way["highway"](${BBOX});
  nwr["natural"="water"](${BBOX});
  nwr["waterway"](${BBOX});
  nwr["leisure"~"^(park|garden|pitch|playground)$"](${BBOX});
  nwr["landuse"~"^(grass|recreation_ground|forest|meadow)$"](${BBOX});
  nwr["natural"~"^(wood|grassland|scrub)$"](${BBOX});
  way["railway"~"^(rail|subway)$"](${BBOX});
);
out geom;`;
const res = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'wedding-invitation email-map' },
  body: 'data=' + encodeURIComponent(QUERY),
});
if (!res.ok) throw new Error(`Overpass ${res.status} ${res.statusText}`);
const els = (await res.json()).elements;

// stitch relation member ways into rings
function rings(rel, role) {
  const ways = rel.members.filter((m) => m.type === 'way' && m.role === role && m.geometry).map((m) => m.geometry.map(toPx));
  const out = [];
  while (ways.length) {
    let ring = ways.shift();
    let changed = true;
    while (changed) {
      changed = false;
      const first = ring[0], last = ring.at(-1);
      if (Math.hypot(first.x - last.x, first.y - last.y) < 0.5) break;
      for (let i = 0; i < ways.length; i++) {
        const w = ways[i], a = w[0], b = w.at(-1);
        if (Math.hypot(last.x - a.x, last.y - a.y) < 0.5) { ring = ring.concat(w.slice(1)); ways.splice(i, 1); changed = true; break; }
        if (Math.hypot(last.x - b.x, last.y - b.y) < 0.5) { ring = ring.concat(w.slice(0, -1).reverse()); ways.splice(i, 1); changed = true; break; }
      }
    }
    out.push(ring);
  }
  return out;
}
const polyPath = (e) => {
  if (e.type === 'way') return pathOf(e.geometry.map(toPx), true);
  if (e.type === 'relation') return [...rings(e, 'outer'), ...rings(e, 'inner')].map((r) => pathOf(r, true)).join(' ');
  return '';
};

let svg = `<rect width="${W}" height="${H}" fill="#F3EFE6"/>`;
// green
for (const e of els) {
  const t = e.tags || {};
  const green = t.leisure === 'park' || t.leisure === 'garden' || t.landuse === 'grass' || t.landuse === 'recreation_ground' || t.natural === 'grassland' || t.natural === 'wood' || t.landuse === 'forest' || t.landuse === 'meadow';
  const pitch = t.leisure === 'pitch' || t.leisure === 'playground';
  if (e.type === 'node' || (!green && !pitch)) continue;
  svg += `<path d="${polyPath(e)}" fill="${pitch ? '#CFE0C0' : '#D8E6CB'}" fill-rule="evenodd"/>`;
}
// water
for (const e of els) {
  const t = e.tags || {};
  if (t.natural === 'water' || t.waterway === 'riverbank') svg += `<path d="${polyPath(e)}" fill="#B9D3E5" fill-rule="evenodd"/>`;
}
// buildings
for (const e of els) {
  if (e.type !== 'way' || !e.tags?.building) continue;
  const venue = e.id === VENUE_WAY;
  svg += `<path d="${polyPath(e)}" fill="${venue ? '#E6D8C3' : '#E4DFD4'}" stroke="${venue ? '#C9A77C' : '#D3CDC0'}" stroke-width="${venue ? 2 : 0.8}"/>`;
}
// roads
const ROAD = {
  service: { casing: '#DDD7CA', cw: 5, fill: '#FFFFFF', fw: 3.5, z: 1 },
  residential: { casing: '#D6CFC1', cw: 9, fill: '#FFFFFF', fw: 6.5, z: 2 },
  unclassified: { casing: '#D6CFC1', cw: 9, fill: '#FFFFFF', fw: 6.5, z: 2 },
  tertiary: { casing: '#CDC6B7', cw: 13, fill: '#FFFFFF', fw: 10, z: 3 },
  secondary: { casing: '#CDC6B7', cw: 15, fill: '#FFFFFF', fw: 12, z: 4 },
  primary_link: { casing: '#D8C077', cw: 13, fill: '#F8E6AC', fw: 10, z: 5 },
  primary: { casing: '#D8C077', cw: 18, fill: '#F8E6AC', fw: 14, z: 6 },
  trunk_link: { casing: '#D2B660', cw: 13, fill: '#F5DC90', fw: 10, z: 7 },
  trunk: { casing: '#D2B660', cw: 20, fill: '#F5DC90', fw: 16, z: 8 },
};
const roads = els.filter((e) => e.type === 'way' && ROAD[e.tags?.highway]).sort((a, b) => ROAD[a.tags.highway].z - ROAD[b.tags.highway].z);
const line = (e, stroke, w) => `<path d="${pathOf(e.geometry.map(toPx))}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
for (const e of roads) { const s = ROAD[e.tags.highway]; svg += line(e, s.casing, s.cw); }
for (const e of roads) { const s = ROAD[e.tags.highway]; svg += line(e, s.fill, s.fw); }
// subway line 2 (drawn faintly over roads, as on the Korean map)
for (const e of els) if (e.type === 'way' && e.tags?.railway === 'subway') svg += line(e, '#00A84D', 5).replace('stroke-linecap', 'stroke-opacity="0.45" stroke-linecap');

// ---- labels along ways (mid-point of the longest in-view piece)
const inside = (p) => p.x >= 0 && p.x < W && p.y >= 0 && p.y < H;
function labelPath(nameEn, frac = 0.5) {
  const pieces = [];
  for (const e of els) {
    if (e.type !== 'way' || e.tags?.['name:en'] !== nameEn || !e.geometry) continue;
    let cur = [];
    for (const g of e.geometry) { const p = toPx(g); if (inside(p)) cur.push(p); else { if (cur.length > 1) pieces.push(cur); cur = []; } }
    if (cur.length > 1) pieces.push(cur);
  }
  if (!pieces.length) return null;
  const len = (pl) => pl.slice(1).reduce((a, p, k) => a + Math.hypot(p.x - pl[k].x, p.y - pl[k].y), 0);
  const pl = pieces.sort((a, b) => len(b) - len(a))[0];
  const total = len(pl); let acc = 0;
  for (let k = 1; k < pl.length; k++) {
    const seg = Math.hypot(pl[k].x - pl[k - 1].x, pl[k].y - pl[k - 1].y);
    if (acc + seg >= total * frac) {
      const t = (total * frac - acc) / seg;
      const x = pl[k - 1].x + (pl[k].x - pl[k - 1].x) * t, y = pl[k - 1].y + (pl[k].y - pl[k - 1].y) * t;
      let ang = Math.atan2(pl[k].y - pl[k - 1].y, pl[k].x - pl[k - 1].x) * 180 / Math.PI;
      if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
      return { x, y, ang };
    }
    acc += seg;
  }
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const FONT = `font-family="Helvetica Neue, Helvetica, Arial, sans-serif"`;
const haloText = (x, y, text, { size = 22, fill = '#4B5563', weight = 600, ang = 0, anchor = 'middle', halo = '#FFFFFF', dy = 0, spacing = 0, style = 'normal', haloW = 5 } = {}) => {
  const common = `x="${f(x)}" y="${f(y + dy)}" text-anchor="${anchor}" ${FONT} font-size="${size}" font-weight="${weight}" font-style="${style}" letter-spacing="${spacing}"`;
  const tr = ang ? `transform="rotate(${f(ang)} ${f(x)} ${f(y)})"` : '';
  return `<g ${tr}><text ${common} fill="none" stroke="${halo}" stroke-width="${haloW}" stroke-linejoin="round" stroke-opacity="0.95">${esc(text)}</text><text ${common} fill="${fill}">${esc(text)}</text></g>`;
};
const ROAD_LABELS = [
  ['Teheran-ro', {}], ['Yeongdong-daero', {}], ['Yeoksam-ro', {}],
  ['Bundangsuseo-ro', { text: 'Dongbu Expressway', halo: '#F5DC90', frac: 0.22 }],
];
for (const [name, opt] of ROAD_LABELS) {
  const { frac, text, ...style } = opt;
  const l = labelPath(name, frac);
  if (!l) { console.error('no geometry in view for', name); continue; }
  svg += haloText(l.x, l.y, text || name, { size: 21, fill: '#3F4756', weight: 600, ...style, ang: l.ang, dy: 7 });
}
// river label: along the water relation's centre line
const river = labelPath('Tancheon Stream');
if (river) svg += haloText(river.x, river.y, 'Tancheon Stream', { size: 21, fill: '#2F6FA3', weight: 500, style: 'italic', ang: river.ang, dy: 7, halo: '#B9D3E5' });

// ---- landmarks
const st = toPx(STATION);
svg += `<circle cx="${f(st.x)}" cy="${f(st.y)}" r="15" fill="#00A84D" stroke="#FFFFFF" stroke-width="4"/>`;
svg += `<text x="${f(st.x)}" y="${f(st.y + 7)}" text-anchor="middle" ${FONT} font-size="19" font-weight="700" fill="#FFFFFF">2</text>`;
svg += haloText(st.x + 24, st.y, 'Samseong Stn.', { size: 22, fill: '#1F2937', weight: 700, anchor: 'start', dy: 8 });
svg += haloText(st.x + 24, st.y + 24, 'Subway Line 2', { size: 16, fill: '#4B5563', weight: 500, anchor: 'start', dy: 6 });
const coex = toPx({ lat: 37.5094, lon: 127.0601 });
svg += haloText(coex.x, coex.y, 'COEX', { size: 22, fill: '#6B7280', weight: 700, spacing: 2 });

// ---- venue pin + label
const v = toPx(VENUE);
svg += `<g transform="translate(${f(v.x)} ${f(v.y)})">
  <ellipse cx="0" cy="2" rx="12" ry="5" fill="#000" opacity="0.18"/>
  <path d="M0 0 C -14 -22 -22 -30 -22 -42 A 22 22 0 1 1 22 -42 C 22 -30 14 -22 0 0 Z" fill="#1A2F4A" stroke="#FFFFFF" stroke-width="3"/>
  <circle cx="0" cy="-42" r="9" fill="#C9A77C"/>
</g>`;
const lw = 330, lh = 62, lx = v.x - lw / 2 - 30, ly = v.y - 70 - lh - 10, bx = lx + lw / 2;
svg += `<rect x="${f(lx)}" y="${f(ly)}" width="${lw}" height="${lh}" rx="6" fill="#FFFFFF" stroke="#C9A77C" stroke-width="2"/>
<rect x="${f(lx + 1)}" y="${f(ly + lh - 5)}" width="${lw - 2}" height="4" fill="#C9A77C"/>
<path d="M${f(v.x - 9)} ${f(ly + lh)} L${f(v.x)} ${f(ly + lh + 10)} L${f(v.x + 9)} ${f(ly + lh)} Z" fill="#C9A77C"/>
<text x="${f(bx)}" y="${f(ly + 28)}" text-anchor="middle" ${FONT} font-size="24" font-weight="700" fill="#1A2F4A">Grand Hill Convention</text>
<text x="${f(bx)}" y="${f(ly + 49)}" text-anchor="middle" ${FONT} font-size="14" font-weight="500" fill="#666666" letter-spacing="1">607 YEOKSAM-RO, GANGNAM-GU, SEOUL</text>`;

// ---- scale bar + attribution
const mpp = 156543.03 * Math.cos(CENTER.lat * Math.PI / 180) / n / S;
const bar = 100 / mpp;
svg += `<g transform="translate(24 ${H - 24})">
  <path d="M0 -10 V0 H${f(bar)} V-10" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round"/>
  <path d="M0 -10 V0 H${f(bar)} V-10" fill="none" stroke="#1F2937" stroke-width="2"/>
  ${haloText(bar / 2, -8, '100 m', { size: 16, fill: '#1F2937', weight: 600 })}
</g>`;
svg += haloText(W - 12, H - 10, '© OpenStreetMap contributors', { size: 14, fill: '#4B5563', weight: 400, anchor: 'end' });

const jpg = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${svg}</svg>`), { density: 72 })
  .jpeg({ quality: 88, mozjpeg: true }).toBuffer();
await writeFile(OUT, jpg);
console.log('wrote', path.relative(ROOT, OUT), `${W}x${H}`);
