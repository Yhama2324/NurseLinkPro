// seed_detailed_subjects.ts
// Usage: DATABASE_URL=... ts-node seed_detailed_subjects.ts /path/to/bsn_detailed_subjects.json
import fs from "fs";
import pg from "pg";

const jsonPath = process.argv[2] || "./bsn_detailed_subjects.json";
if (!fs.existsSync(jsonPath)) {
  console.error("JSON file not found:", jsonPath);
  process.exit(1);
}

const raw = fs.readFileSync(jsonPath, "utf-8");
const data = JSON.parse(raw);

const isSSL = (process.env.DATABASE_URL || "").includes("sslmode=require");
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isSSL ? { rejectUnauthorized: false } : undefined,
  max: 10,
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query("begin");

    for (const subj of data.subjects || []) {
      const code: string = subj.code;
      const outcomes: string[] = subj.outcomes || [];
      const topics: any[] = subj.topics || [];

      // Upsert outcomes
      for (const outcome of outcomes) {
        await client.query(
          `insert into subject_outcomes (subject_code, outcome)
           values ($1,$2)
           on conflict (subject_code, outcome) do nothing`,
          [code, outcome]
        );
      }

      // Upsert topics
      for (const t of topics) {
        const name = t.name || t.topic || "Untitled";
        const subs = JSON.stringify(t.subtopics || []);
        const tags = (t.tags || []).map((x: string) => x.toLowerCase());
        await client.query(
          `insert into subject_topics (subject_code, topic_name, subtopics, tags)
           values ($1,$2,$3,$4)
           on conflict (subject_code, topic_name)
           do update set subtopics = excluded.subtopics, tags = excluded.tags`,
          [code, name, subs, tags]
        );
      }
    }

    await client.query("commit");
    console.log("✅ Imported detailed subjects successfully.");
  } catch (e) {
    await client.query("rollback");
    console.error("❌ Import failed:", e);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
