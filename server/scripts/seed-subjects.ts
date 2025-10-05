import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db';
import { subjects } from '@shared/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CurriculumData {
  years: Array<{
    semesters: Array<{
      subjects: Array<{
        code: string;
        name: string;
        hours: {
          lec: number;
          lab: number;
          rle: number;
        };
      }>;
    }>;
  }>;
}

async function seedSubjects() {
  try {
    console.log('Starting subjects seeding...');
    
    const curriculumPath = join(__dirname, '../data/bsn_curriculum.json');
    const curriculumJSON = readFileSync(curriculumPath, 'utf-8');
    const curriculumData: CurriculumData = JSON.parse(curriculumJSON);
    
    const seenCodes = new Set<string>();
    let subjectCount = 0;
    
    for (const year of curriculumData.years) {
      for (const semester of year.semesters) {
        for (const subject of semester.subjects) {
          if (!seenCodes.has(subject.code)) {
            seenCodes.add(subject.code);
            
            const totalHours = subject.hours.lec + subject.hours.lab + subject.hours.rle;
            const units = Math.ceil(totalHours / 18);
            
            await db
              .insert(subjects)
              .values({
                canonicalCode: subject.code,
                name: subject.name,
                units: units || 3,
                active: true,
              })
              .onConflictDoNothing();
            
            subjectCount++;
          }
        }
      }
    }
    
    console.log(`✅ Seeding complete!`);
    console.log(`   Canonical Subjects: ${subjectCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
    throw error;
  }
}

seedSubjects()
  .then(() => {
    console.log('Subject seeding finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Subject seeding failed:', error);
    process.exit(1);
  });
