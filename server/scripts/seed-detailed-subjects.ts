import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db';
import { subjects, subjectOutcomes, subjectTopics } from '@shared/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface DetailedSubjectData {
  version: string;
  coverage_note: string;
  subjects: Array<{
    code: string;
    title: string;
    outcomes: string[];
    topics: Array<{
      name: string;
      subtopics: string[];
      tags: string[];
    }>;
  }>;
}

async function seedDetailedSubjects() {
  try {
    console.log('Starting detailed subjects seeding...');
    
    const dataPath = join(__dirname, '../data/bsn_detailed_subjects.json');
    const dataJSON = readFileSync(dataPath, 'utf-8');
    const data: DetailedSubjectData = JSON.parse(dataJSON);
    
    console.log(`Importing ${data.subjects.length} detailed subjects...`);
    
    let outcomeCount = 0;
    let topicCount = 0;
    
    for (const subject of data.subjects) {
      const code = subject.code;
      
      console.log(`Processing ${code}...`);
      
      // First, ensure the subject exists in the subjects table
      const existingSubject = await db.query.subjects.findFirst({
        where: (subjects, { eq }) => eq(subjects.canonicalCode, code),
      });
      
      if (!existingSubject) {
        console.log(`  ⚠️  Subject ${code} not found in subjects table, skipping...`);
        continue;
      }
      
      // Insert outcomes
      for (const outcome of subject.outcomes) {
        await db
          .insert(subjectOutcomes)
          .values({
            subjectCode: code,
            outcome: outcome,
          })
          .onConflictDoNothing();
        outcomeCount++;
      }
      
      // Insert topics
      for (const topic of subject.topics) {
        const tags = topic.tags.map(t => t.toLowerCase());
        await db
          .insert(subjectTopics)
          .values({
            subjectCode: code,
            topicName: topic.name,
            subtopics: topic.subtopics,
            tags: tags,
          })
          .onConflictDoUpdate({
            target: [subjectTopics.subjectCode, subjectTopics.topicName],
            set: {
              subtopics: topic.subtopics,
              tags: tags,
            },
          });
        topicCount++;
      }
    }
    
    console.log(`✅ Seeding complete!`);
    console.log(`   Outcomes imported: ${outcomeCount}`);
    console.log(`   Topics imported: ${topicCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding detailed subjects:', error);
    throw error;
  }
}

seedDetailedSubjects()
  .then(() => {
    console.log('Detailed subjects seeding finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Detailed subjects seeding failed:', error);
    process.exit(1);
  });
