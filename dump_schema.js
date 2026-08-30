import { query } from './src/data/backend/db.js';
import fs from 'fs';

async function run() {
  try {
    const tables = await query('SHOW TABLES');
    let output = '';
    output += 'Tables:\n' + JSON.stringify(tables, null, 2) + '\n\n';
    
    for (const row of tables) {
      const tableName = Object.values(row)[0];
      try {
        const desc = await query(`DESCRIBE \`${tableName}\``);
        output += `\n--- Table: ${tableName} ---\n`;
        output += JSON.stringify(desc, null, 2);
      } catch {
        output += `\n--- Table: ${tableName} (ERROR) ---\n`;
      }
    }
    fs.writeFileSync('db_schema_dump.txt', output);
    console.log('Schema dumped to db_schema_dump.txt');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
