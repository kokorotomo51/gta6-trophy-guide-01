// Leonida Trophy Field Guide — the program that hands the guide in.
//
// The guide itself is app/: plain static files a desktop browser opens at
// app/index.html, offline, with the trophy data in app/data/trophies.json.
// This program does three things and nothing else: it copies app/ and
// screenshots/ into the output directory, then writes /output/dossier.json
// with buildDossier from the vendored make.fun library, which is the summary
// the judge reads (the screenshots, the first load's files and bytes, and
// the source). The library must stay exactly as the kit shipped it: the
// scorer rebuilds the dossier with its own copy and compares the two byte
// for byte, so a changed library means a refused entry.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and serve the guide itself with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps (reference/gate.json): text_max_bytes is the only one
// that shapes the dossier's bytes. The rest refuse an entry the scorer
// would refuse — more than 4 screenshots, or one over 256 KiB; more than
// 993 files and directories in app/, or 48 MiB of app files in all. app/
// shares /output's own 1,000-entry cap with screenshots/ and dossier.json,
// so the guide leaves room.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
