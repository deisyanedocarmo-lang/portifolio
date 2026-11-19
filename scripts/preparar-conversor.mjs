import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const origem = 'node_modules/@ffmpeg/core/dist/esm';
const destino = 'src/lib';
mkdirSync(destino, { recursive: true });
const core = readFileSync(`${origem}/ffmpeg-core.js`).toString('base64');
const wasm = gzipSync(readFileSync(`${origem}/ffmpeg-core.wasm`), { level: 9 }).toString('base64');
writeFileSync(`${destino}/ffmpeg-assets.ts`, `// Gerado por scripts/preparar-conversor.mjs. Não edite este arquivo.\nexport const ffmpegCoreBase64 = ${JSON.stringify(core)};\nexport const ffmpegWasmGzipBase64 = ${JSON.stringify(wasm)};\n`);
console.log('Conversor local pronto para MP4 e MOV.');
