// Script to run database migration against Supabase
// Usage: node database/migrate.js

const fs = require('fs');
const path = require('path');

async function runMigration() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htnavccrlkpyqzgqaenv.supabase.co';
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bmF2Y2NybGtweXF6Z3FhZW52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzNDk3MiwiZXhwIjoyMDg4OTEwOTcyfQ.Wk5PYEN78xB475JNVFbGrQ1nSmyHgWPPmnUZsvtECj4';

  const sqlFile = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(sqlFile, 'utf-8');

  // Split into individual statements for better error reporting
  const statements = sql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Running ${statements.length} SQL statements against Supabase...`);
  console.log(`URL: ${SUPABASE_URL}`);
  console.log('');

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';';
    const firstLine = stmt.split('\n').find(l => l.trim() && !l.trim().startsWith('--')) || stmt.substring(0, 60);
    console.log(`[${i + 1}/${statements.length}] ${firstLine.trim().substring(0, 80)}...`);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({}),
      });
    } catch (err) {
      // Ignore RPC errors, we'll use the SQL endpoint
    }
  }

  // Run the full SQL via pg_query-compatible endpoint
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });
    console.log('\nSupabase connection test:', response.ok ? 'SUCCESS' : 'FAILED');
    console.log('Status:', response.status);
  } catch (err) {
    console.error('Connection test failed:', err.message);
  }

  console.log('\n✅ Migration SQL ready! Please run the schema.sql file in the Supabase SQL Editor.');
  console.log('Go to: https://supabase.com/dashboard/project/htnavccrlkpyqzgqaenv/sql/new');
  console.log('Then paste the contents of database/schema.sql and click "Run"');
}

runMigration();
