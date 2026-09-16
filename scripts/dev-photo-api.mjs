/**
 * 로컬 개발용: Vercel CLI 없이 api/photo.js 를 http://localhost:3001/api/photo 로 띄운다.
 *
 *   1. .env 에 MYBOX_PAT=mbx_pat_... 를 넣는다 (REACT_APP_ 접두사가 없어 번들에는 들어가지 않는다)
 *   2. 터미널 A: npm run photo-api
 *   3. 터미널 B: REACT_APP_PHOTO_UPLOAD_URL=http://localhost:3001/api/photo npm start
 *
 * Vercel 이 함수에 넘겨주는 req.query / req.body(Buffer) / res.status().json() 만 흉내낸다.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 3001;

// .env 의 값 중 비어 있는 것만 환경에 채운다 (react-scripts 와 같은 파일을 공유)
const envPath = path.join(root, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

if (!process.env.MYBOX_PAT) {
  console.error('MYBOX_PAT 가 없습니다. .env 에 MYBOX_PAT=mbx_pat_... 를 추가하세요.');
  process.exit(1);
}

const handler = createRequire(import.meta.url)(path.join(root, 'api', 'photo.js'));

http
  .createServer((req, res) => {
    const url = new URL(req.url || '/', `http://localhost:${PORT}`);
    if (url.pathname !== '/api/photo') {
      res.writeHead(404).end('not found');
      return;
    }

    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      req.query = Object.fromEntries(url.searchParams.entries());
      req.body = Buffer.concat(chunks);

      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (payload) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(payload));
      };

      Promise.resolve(handler(req, res)).catch((error) => {
        console.error(error);
        if (!res.headersSent) res.status(500).json({ success: false, error: String(error) });
      });
    });
  })
  .listen(PORT, () => {
    console.log(`photo api: http://localhost:${PORT}/api/photo`);
  });
