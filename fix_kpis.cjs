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

  // Match the large percentage text: 72,9% or 85,4% etc limit to <div className="text-[48px] ...">XY,Z%</div>
  code = code.replace(/<div className="text-\[48px\] font-bold text-foreground mb-1 leading-none tracking-tight">([0-9]+),([0-9]+)(%*)<\/div>/g, (match, p1, p2, pct) => {
    let base = parseFloat(`${p1}.${p2}`);
    return `<div className="text-[48px] font-bold text-foreground mb-1 leading-none tracking-tight">{((${base} * (0.85 + 0.15 * Math.max(0.5, filterScale))).toFixed(1)).replace('.', ',')}${pct}</div>`;
  });
  
  // Also match pure numbers without percentage (like volume) 1.455 atend.
  code = code.replace(/<div className="font-semibold text-foreground">([0-9.]+) atend\.<\/div>/g, (match, p1) => {
    let base = parseInt(p1.replace(/\./g, ''), 10);
    return `<div className="font-semibold text-foreground">{Math.round(${base} * filterScale).toLocaleString('pt-BR')} atend.</div>`;
  });

  fs.writeFileSync(file, code);
}
console.log('KPIs fixed');
