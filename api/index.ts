import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';
  const pathname = new URL(url, `http://${req.headers.host}`).pathname;
  const lang = pathname.startsWith('/en') ? 'en' : 'ko';
  const baseUrl = `https://${req.headers.host}`;
  const imageUrl = `${baseUrl}/couple.jpg`;

  // 빌드된 index.html 읽기
  let html = '';
  try {
    html = readFileSync(join(process.cwd(), 'build', 'index.html'), 'utf-8');
  } catch (error) {
    // 빌드 파일이 없으면 기본 HTML 사용
    html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <link rel="icon" type="image/svg+xml" href="${baseUrl}/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${lang === 'ko' ? '조준용 ❤️ 허다영 결혼합니다' : 'Daniel ❤️ Aria Wedding'}</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  }

  // 메타 태그 교체
  const metaTags = `
  <meta name="description" content="${lang === 'ko' ? '2월 20일 토요일 오후 3시&#10;그랜드힐 1층 플로리아' : 'February 20, Saturday 3:00 PM&#10;Grand Hill 1F Floria'}" />
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}/${lang}" />
  <meta property="og:title" content="${lang === 'ko' ? '조준용 ❤️ 허다영 결혼합니다' : 'Daniel ❤️ Aria Wedding'}" />
  <meta property="og:description" content="${lang === 'ko' ? '2월 20일 토요일 오후 3시&#10;그랜드힐 1층 플로리아' : 'February 20, Saturday 3:00 PM&#10;Grand Hill 1F Floria'}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="${lang === 'ko' ? 'ko_KR' : 'en_US'}" />
  <meta property="og:site_name" content="${lang === 'ko' ? '조준용 ❤️ 허다영 결혼합니다' : 'Daniel ❤️ Aria Wedding'}" />
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${lang === 'ko' ? '조준용 ❤️ 허다영 결혼합니다' : 'Daniel ❤️ Aria Wedding'}" />
  <meta name="twitter:description" content="${lang === 'ko' ? '2월 20일 토요일 오후 3시&#10;그랜드힐 1층 플로리아' : 'February 20, Saturday 3:00 PM&#10;Grand Hill 1F Floria'}" />
  <meta name="twitter:image" content="${imageUrl}" />`;

  // 기존 메타 태그 제거 및 새 메타 태그 추가
  html = html.replace(/<meta[^>]*name=["']description["'][^>]*>/i, '');
  html = html.replace(/<meta[^>]*property=["']og:[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<meta[^>]*name=["']twitter:[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<title>.*?<\/title>/i, `<title>${lang === 'ko' ? '조준용 ❤️ 허다영 결혼합니다' : 'Daniel ❤️ Aria Wedding'}</title>${metaTags}`);

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
