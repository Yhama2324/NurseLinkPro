import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db';
import { subjects } from '@shared/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface DetailedSubjectData {
  subjects: Array<{
    code: string;
    title: string;
  }>;
}

async function seedBaseSubjects() {
  try {
    console.log('Starting base subjects seeding from detailed subjects...');
    
    const dataPath = join(__dirname, '../data/bsn_detailed_subjects.json');
    const dataJSON = readFileSync(dataPath, 'utf-8');
    const data: DetailedSubjectData = JSON.parse(dataJSON);
    
    console.log(`Found ${data.subjects.length} subjects to process...`);
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const subject of data.subjects) {
      const existing = await db.query.subjects.findFirst({
        where: (subjects, { eq }) => eq(subjects.canonicalCode, subject.code),
      });
      
      if (!existing) {
        await db
          .insert(subjects)
          .values({
            canonicalCode: subject.code,
            name: subject.title,
            units: 3,
            active: true,
          });
        console.log(`  ✅ Added ${subject.code} - ${subject.title}`);
        addedCount++;
      } else {
        console.log(`  ⏭️  Skipped ${subject.code} (already exists)`);
        skippedCount++;
      }
    }
    
    console.log(`\n✅ Base subjects seeding complete!`);
    console.log(`   Added: ${addedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding base subjects:', error);
    throw error;
  }
}

seedBaseSubjects()
  .then(() => {
    console.log('Base subjects seeding finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Base subjects seeding failed:', error);
    process.exit(1);
  });
