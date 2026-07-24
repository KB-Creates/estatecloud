const fs = require('fs');

const files = [
  'client/src/pages/users.jsx',
  'client/src/pages/units.jsx',
  'client/src/pages/roles.jsx',
  'client/src/pages/properties.jsx',
  'client/src/pages/contracts.jsx',
  'client/src/components/Staff/staff-table.jsx',
  'client/src/components/Owners/owner-table.jsx',
  'client/src/components/Maintenance/maintenance-table.jsx',
  'client/src/components/Customers/customer-table.jsx',
  'client/src/components/Bookings/booking-table.jsx',
  'client/src/components/Agents/agent-table.jsx',
  'client/src/components/Inquiries/inquiry-table.jsx',
  'client/src/pages/expenses.jsx'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // 1. Add import if missing
        if (!content.includes('useSettings')) {
            content = `import { useSettings } from '@/context/SettingsContext';\n` + content;
        }

        // 2. Add hook call if missing (very basic heuristic: look for const columns = useMemo, insert before it)
        if (!content.includes('formatDate')) {
            if (content.includes('useSettings()')) {
                 content = content.replace(/const\s*\{\s*([^\}]+)\s*\}\s*=\s*useSettings\(\)/, 'const { $1, formatDate } = useSettings()');
            } else {
                 content = content.replace(/const columns = useMemo\(\(\) => \[/, `const { formatDate } = useSettings();\n  const columns = useMemo(() => [`);
            }
        }

        // 3. Add column definition
        if (!content.includes('accessorKey: "createdAt"')) {
            const dateCol = `    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <div className="text-muted-foreground">{formatDate ? formatDate(row.getValue("createdAt")) : new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
    },`;
            content = content.replace(/(\s*\{\s*id:\s*"actions",)/, `\n${dateCol}$1`);
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        }
    }
});
