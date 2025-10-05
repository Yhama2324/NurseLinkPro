import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db';
import { curriculumSubjects, curriculumTopics, curriculumSubtopics, curriculumQuestionTags } from '@shared/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CurriculumData {
  program: string;
  country_framework: string;
  version: string;
  notes: string[];
  blueprints_reference: {
    PNLE: string[];
    NCLEX_Client_Needs: string[];
  };
  years: Array<{
    year: number;
    title: string;
    semesters: Array<{
      semester: number;
      subjects: Array<{
        code: string;
        name: string;
        category: string;
        year: number;
        semester: number;
        hours: {
          lec: number;
          lab: number;
          rle: number;
        };
        prerequisites: string[];
        outcomes: string[];
        blueprints: {
          PNLE: string[];
          NCLEX_Client_Needs: string[];
        };
        topics: Array<{
          name: string;
          subtopics: string[];
          question_tags: string[];
        }>;
      }>;
    }>;
  }>;
}

async function importCurriculum() {
  try {
    console.log('Starting curriculum import...');
    
    // Read the curriculum JSON file
    const curriculumPath = join(__dirname, '../data/bsn_curriculum.json');
    const curriculumJSON = readFileSync(curriculumPath, 'utf-8');
    const curriculumData: CurriculumData = JSON.parse(curriculumJSON);
    
    console.log(`Importing ${curriculumData.program} curriculum...`);
    
    let subjectCount = 0;
    let topicCount = 0;
    let subtopicCount = 0;
    let tagCount = 0;
    
    // Import all subjects, topics, and subtopics
    for (const year of curriculumData.years) {
      for (const semester of year.semesters) {
        for (const subject of semester.subjects) {
          // Insert subject
          const [insertedSubject] = await db
            .insert(curriculumSubjects)
            .values({
              code: subject.code,
              name: subject.name,
              category: subject.category,
              year: subject.year,
              semester: subject.semester,
              hoursLec: subject.hours.lec,
              hoursLab: subject.hours.lab,
              hoursRle: subject.hours.rle,
              prerequisites: subject.prerequisites,
              outcomes: subject.outcomes,
              pnleBlueprints: subject.blueprints.PNLE,
              nclexBlueprints: subject.blueprints.NCLEX_Client_Needs,
            })
            .returning();
          
          subjectCount++;
          
          // Insert topics for this subject
          for (let i = 0; i < subject.topics.length; i++) {
            const topic = subject.topics[i];
            
            const [insertedTopic] = await db
              .insert(curriculumTopics)
              .values({
                subjectId: insertedSubject.id,
                name: topic.name,
                orderIndex: i,
              })
              .returning();
            
            topicCount++;
            
            // Insert subtopics for this topic
            for (let j = 0; j < topic.subtopics.length; j++) {
              await db
                .insert(curriculumSubtopics)
                .values({
                  topicId: insertedTopic.id,
                  name: topic.subtopics[j],
                  orderIndex: j,
                });
              
              subtopicCount++;
            }
            
            // Insert question tags for this topic
            for (const tag of topic.question_tags) {
              await db
                .insert(curriculumQuestionTags)
                .values({
                  topicId: insertedTopic.id,
                  tag: tag,
                });
              
              tagCount++;
            }
          }
        }
      }
    }
    
    console.log(`✅ Import complete!`);
    console.log(`   Subjects: ${subjectCount}`);
    console.log(`   Topics: ${topicCount}`);
    console.log(`   Subtopics: ${subtopicCount}`);
    console.log(`   Question Tags: ${tagCount}`);
    
  } catch (error) {
    console.error('❌ Error importing curriculum:', error);
    throw error;
  }
}

// Run the import
importCurriculum()
  .then(() => {
    console.log('Curriculum import finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Curriculum import failed:', error);
    process.exit(1);
  });
