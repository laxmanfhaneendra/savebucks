import 'dotenv/config';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection configuration from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL environment variable is required');
  process.exit(1);
}

async function applySQL() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'sql', '033_company_enhancements.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('Applying SQL file...');
    await client.query(sqlContent);
    console.log('SQL file applied successfully!');
    
  } catch (error) {
    console.error('Error applying SQL:', error);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

applySQL();
