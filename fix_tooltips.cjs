const fs = require('fs');

const files = [
  'src/components/DashboardFCR.tsx',
  'src/components/DashboardBot.tsx',
  'src/components/DashboardTransfer.tsx',
  'src/components/DashboardRetention.tsx',
  'src/components/DashboardCSAT.tsx'
];

for(const file of files) {
  let code = fs.readFileSync(file, 'utf8');

  // Replace contentStyle tooltips
  code = code.replace(/<Tooltip cursor=\{\{ fill: 'rgba\(0,0,0,0\.05\)' \}\} contentStyle=\{\{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' \}\} \/>/g, 
                      "<Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<CustomTooltip />} />");

  // Determine label logic
  let labelLogic = '{label}';
  if (file.includes('DashboardFCR') || file.includes('DashboardCSAT')) {
    labelLogic = '{label && label.toString().length <= 2 && !isNaN(Number(label)) ? `Dia ${label}` : label}';
  } else if (file.includes('DashboardBot') || file.includes('DashboardTransfer')) {
    labelLogic = '{label && label.toString().includes("Dia") ? label : `Dia ${label}`}';
  } else if (file.includes('DashboardRetention')) {
    labelLogic = "{label && label.toString().includes('min') || isNaN(Number(label)) ? label : `Dia ${label}`}";
  }

  // Value formatting
  let valueFormat = '{typeof entry.value === "number" && entry.value % 1 !== 0 ? entry.value.toFixed(1) : (typeof entry.value === "number" ? entry.value.toLocaleString("pt-BR") : entry.value)}%';

  const newCustomTooltip = `const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    let variationInfo = null;
    const atualEntry = payload.find((p: any) => p.name?.toLowerCase() === 'atual' || p.dataKey === 'atual' || p.dataKey === 'Atual');
    const anteriorEntry = payload.find((p: any) => p.name?.toLowerCase() === 'anterior' || p.dataKey === 'anterior' || p.dataKey === 'Anterior');

    if (atualEntry && anteriorEntry && anteriorEntry.value > 0) {
      const perc = ((atualEntry.value - anteriorEntry.value) / anteriorEntry.value) * 100;
      const isPositive = perc > 0;
      // Para FCR, CSAT, Bot, Retenção, uma variação positiva geralmente é boa, então verde. 
      // Em casos como "Taxa de Transferência", positivo pode ser ruim, mas o padrão será mantido ou ajustaremos conforme a cor.
      let variationColor = isPositive ? 'text-success' : 'text-danger';
      // Inversão de cor para Transferência (mais = ruim)
      if (typeof window !== 'undefined' && window.location.pathname.includes('transferencia')) {
        variationColor = isPositive ? 'text-danger' : 'text-success';
      }

      variationInfo = (
        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between gap-4">
          <span className="text-[11px] text-muted uppercase">Var. Período Ant.:</span>
          <span className={\`text-[12px] font-bold \${variationColor}\`}>
            {isPositive ? '+' : ''}{perc.toFixed(1)}%
          </span>
        </div>
      );
    }

    return (
      <div className="bg-card border text-[13px] border-border p-3 rounded-lg shadow-lg min-w-[170px]">
        <p className="font-semibold text-foreground mb-2">
          ${labelLogic}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || '#2563eb' }} />
                <span className="text-muted font-medium">{entry.name}:</span>
              </div>
              <span className="text-foreground font-bold">
                ${valueFormat}
              </span>
            </div>
          ))}
        </div>
        {variationInfo}
      </div>
    );
  }
  return null;
};`;

  // Find the old CustomTooltip and replace it.
  const regex = /const CustomTooltip = \(\{ active, payload, label \}: any\) => \{[\s\S]*?return null;\n\};/m;
  code = code.replace(regex, newCustomTooltip);

  fs.writeFileSync(file, code);
}
console.log('Tooltips updated!');
