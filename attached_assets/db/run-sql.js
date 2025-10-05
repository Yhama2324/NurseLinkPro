// run-sql.js (CommonJS so it works in most Replit Node projects)
const fs = require("fs");
const { Pool } = require("pg");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node run-sql.js path/to/file.sql");
  process.exit(1);
}

const sql = fs.readFileSync(file, "utf8");

(async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log(`✅ Ran SQL file: ${file}`);
  } catch (err) {
    console.error("❌ Error running SQL:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
})();
