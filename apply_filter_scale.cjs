const fs = require('fs');

const files = [
  'src/components/DashboardVolume.tsx',
  'src/components/DashboardFCR.tsx',
  'src/components/DashboardCSAT.tsx',
  'src/components/DashboardBot.tsx',
  'src/components/DashboardTransfer.tsx',
  'src/components/DashboardRetention.tsx',
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');

  // Replace data={ArrayVariable} to scale dynamically
  // We need to avoid replacing dataKeys or other things, only inside main Chart components:
  // LineChart, BarChart, ComposedChart, AreaChart, PieChart, ScatterChart
  
  const charts = ['LineChart', 'BarChart', 'ComposedChart', 'AreaChart', 'PieChart', 'ScatterChart', 'Pie'];
  
  for (const chart of charts) {
    // Regex matches <ChartType ... data={variableName} ... >
    // Note: this simple regex assumes data={variableName} without complex nested objects
    const regex = new RegExp('<(' + chart + '[^>]*?)data=\\{([A-Za-z0-9_]+)\\}([^>]*?)>', 'g');
    
    code = code.replace(regex, (match, prefix, varName, suffix) => {
      // Don't wrap if it's already wrapped with .map
      if (varName.includes('.map')) return match;
      
      return '<' + prefix + 'data={' + varName + '.map(d => Object.fromEntries(Object.entries(d).map(([k,v]) => [k, typeof v === "number" ? (v > 100 ? Math.round(v * filterScale) : Number((v * (0.85 + 0.15 * filterScale)).toFixed(1))) : v])))}' + suffix + '>';
    });
  }

  // Also catch generic data={variableName} but only if we know it's a chart variable (ends with Data)
  const genericRegex = /data=\{([A-Za-z0-9_]+Data)\}/g;
  code = code.replace(genericRegex, (match, varName) => {
    // Don't wrap if it's already wrapped
    if (varName.includes('.map')) return match;
    
    return 'data={' + varName + '.map(d => Object.fromEntries(Object.entries(d).map(([k,v]) => [k, typeof v === "number" ? (v > 100 ? Math.round(v * filterScale) : Number((v * (0.85 + 0.15 * filterScale)).toFixed(1))) : v])))}';
  });

  fs.writeFileSync(file, code);
}
console.log('Done scaling charts.');
