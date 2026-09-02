import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function run(cmd) {
  const result = spawnSync(cmd, { cwd: root, stdio: 'inherit', shell: true });
  if (result.status !== 0) process.exit(result.status || 1);
}

run('node server/scripts/export-library.js');
run('git add client/public/library');

const staged = spawnSync('git diff --cached --quiet -- client/public/library', {
  cwd: root,
  shell: true,
});

if (staged.status === 0) {
  console.log('Published library is already up to date. git push if Vercel still needs the latest main.');
  process.exit(0);
}

run('git commit -m "Update published music library."');
console.log('Library committed. Run git push so Vercel can show it to everyone.');
