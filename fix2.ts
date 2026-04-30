import fs from 'fs';
import path from 'path';

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Dashboard') && f.endsWith('.tsx')).map(f => path.join(dir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/radius: \[([^\]]+)\](?! as any)/g, 'radius: [$1] as any');
  fs.writeFileSync(file, content);
});
