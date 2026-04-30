const fs = require('fs');
const files = [
  'src/components/DashboardFCR.tsx',
  'src/components/DashboardCSAT.tsx',
  'src/components/DashboardBot.tsx',
  'src/components/DashboardTransfer.tsx',
  'src/components/DashboardRetention.tsx',
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');

  // Also match pure numbers without percentage (like volume) 1.234 sessões or 1.234 resp.
  code = code.replace(/<div className="font-semibold text-foreground">([0-9.]+)\s+(sessões|resp\.)<\/div>/g, (match, p1, p2) => {
    let base = parseInt(p1.replace(/\./g, ''), 10);
    return `<div className="font-semibold text-foreground">{Math.round(${base} * filterScale).toLocaleString('pt-BR')} ${p2}</div>`;
  });

  fs.writeFileSync(file, code);
}
console.log('Extra KPIs fixed');
