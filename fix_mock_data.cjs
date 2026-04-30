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

  // Insert import if needed
  if (!code.includes("useDashboard")) {
    code = code.replace("import React,", "import React, { useMemo } from 'react';\nimport { useDashboard } from '@/contexts/DashboardContext';\nimport");
  }

  // Find where the component starts
  const componentRegex = /export default function (Dashboard[A-Za-z]+)\(\) \{/;
  const match = code.match(componentRegex);
  if (match) {
    // If it already has filterScale, skip
    if (!code.includes("const { filterScale } = useDashboard();")) {
      code = code.replace(match[0], `${match[0]}\n  const { filterScale } = useDashboard();`);
    }
  }

  fs.writeFileSync(file, code);
}
console.log('Done injecting hook.');
