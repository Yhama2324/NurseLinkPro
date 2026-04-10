const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const questions = [
// FUNDAMENTALS
{s:'fundamentals',t:'Nursing Process',q:'A patient reports pain rated 8/10. The nurse administers the prescribed analgesic. Which step of the nursing process does this represent?',c:['Assessment','Diagnosis','Implementation','Evaluation'],ci:2,r:'Administering medication is an implementation action — carrying out the planned intervention.'},
{s:'fundamentals',t:'Nursing Process',q:'After administering pain medication, the nurse reassesses pain as 3/10. This BEST represents which phase?',c:['Planning','Implementation','Diagnosis','Evaluation'],ci:3,r:'Evaluation involves reassessing the patient to determine if outcomes were achieved after an intervention.'},
{s:'fundamentals',t:'Safety',q:'A nurse is about to give medication and finds the patient asleep. What is the BEST action?',c:['Leave the medication on the bedside table','Skip the dose and document','Gently wake the patient and verify identity before giving','Ask the family to give it later'],ci:2,r:'The patient must be awake and verified before medication administration to ensure safety and proper identification.'},
{s:'fundamentals',t:'Safety',q:'Which action BEST prevents medication errors during administration?',c:['Relying on memory for drug dosages','Checking the 10 rights of medication administration','Administering medications prepared by another nurse','Skipping verification if the patient is familiar'],ci:1,r:'The 10 rights of medication administration (right patient, drug, dose, route, time, documentation, reason, response, refuse, education) are the standard for safe practice.'},
{s:'fundamentals',t:'Infection Control',q:'A patient is diagnosed with pulmonary TB. Which type of isolation precaution is MOST appropriate?',c:['Contact precautions','Droplet precautions','Airborne precautions','Reverse isolation'],ci:2,r:'TB is transmitted via airborne droplet nuclei (<5 microns). Airborne precautions with negative pressure room and N95 respirator are required.'},
{s:'fundamentals',t:'Infection Control',q:'The nurse is about to perform wound care. What is the FIRST action?',c:['Don sterile gloves','Perform hand hygiene','Open the sterile field','Assess the wound'],ci:1,r:'Hand hygiene is always the first step before any procedure to prevent transmission of microorganisms.'},
{s:'fundamentals',t:'Vital Signs',q:'A nurse takes a blood pressure and gets 142/90 mmHg on initial reading. What should the nurse do NEXT?',c:['Immediately call the physician','Document and proceed with care','Recheck in the opposite arm after a few minutes','Administer antihypertensive immediately'],ci:2,r:'A single elevated reading should be rechecked in the opposite arm after allowing the patient to rest. One reading alone is insufficient for diagnosis.'},
{s:'fundamentals',t:'Vital Signs',q:'Which pulse oximetry reading requires IMMEDIATE nursing intervention?',c:['98%','96%','94%','88%'],ci:3,r:'SpO2 below 90% is critically low and requires immediate intervention. 88% indicates severe hypoxemia requiring urgent assessment and oxygen therapy.'},
{s:'fundamentals',t:'Documentation',q:'A nurse makes a charting error. What is the CORRECT way to correct it?',c:['Use correction fluid and rewrite','Draw a single line through the error, write "error," initial, and date','Erase and rewrite the correct information','Tear out the page and rewrite the entry'],ci:1,r:'Legal documentation requires drawing a single line through the error, writing "error," initialing, and dating. Erasure or correction fluid obscures the original entry and is not acceptable.'},
{s:'fundamentals',t:'Ethics',q:'A patient refuses a recommended procedure. What is the PRIORITY nursing action?',c:['Convince the patient to accept treatment','Document refusal and notify physician','Proceed with the procedure for the patient\'s benefit','Ask family to convince the patient'],ci:1,r:'Autonomy is a fundamental ethical principle. A competent patient has the right to refuse. The nurse must document the refusal and notify the physician without coercion.'},
{s:'fundamentals',t:'Oxygenation',q:'A nurse is caring for a patient with COPD receiving oxygen therapy. Which oxygen delivery method is MOST appropriate?',c:['Non-rebreather mask at 15 L/min','Nasal cannula at 1-2 L/min','Simple face mask at 8 L/min','Venturi mask at 40% FiO2'],ci:1,r:'COPD patients rely on hypoxic drive. Low-flow oxygen via nasal cannula (1-2 L/min) prevents suppression of the hypoxic respiratory drive.'},
{s:'fundamentals',t:'Fluid & Electrolytes',q:'A patient has serum sodium of 128 mEq/L. Which symptom is MOST expected?',c:['Excessive thirst','Confusion and headache','Muscle cramps','Peaked T waves on ECG'],ci:1,r:'Hyponatremia (Na <135) causes neurological symptoms: confusion, headache, seizures due to cerebral edema from osmotic fluid shifts.'},
{s:'fundamentals',t:'Wound Care',q:'The nurse observes yellowish-green, thick drainage from a surgical wound. This is BEST described as:',c:['Serous','Sanguineous','Serosanguineous','Purulent'],ci:3,r:'Purulent drainage is thick, yellowish-green, and indicates infection with the presence of white blood cells and bacteria.'},
{s:'fundamentals',t:'Positioning',q:'A patient returns from surgery and is still unconscious. Which position is MOST appropriate?',c:['Supine with head flat','Lateral (recovery) position','High Fowler\'s','Prone position'],ci:1,r:'The lateral (recovery) position maintains airway patency and prevents aspiration of secretions or vomit in an unconscious patient.'},
{s:'fundamentals',t:'Pain Management',q:'A nurse is assessing pain in a non-verbal elderly patient. Which tool is MOST appropriate?',c:['Numeric Rating Scale (NRS)','Visual Analog Scale (VAS)','PAINAD scale','Wong-Baker FACES scale'],ci:2,r:'The PAINAD (Pain Assessment in Advanced Dementia) scale assesses behavioral indicators of pain and is specifically designed for non-verbal patients.'},

// COMMUNITY HEALTH
{s:'community',t:'Epidemiology',q:'The DOH reports 500 new TB cases per 100,000 population this year. This BEST describes:',c:['Prevalence','Incidence rate','Mortality rate','Attack rate'],ci:1,r:'Incidence rate refers to NEW cases in a population over a specific time period. Prevalence includes all existing cases (new and old).'},
{s:'community',t:'Levels of Prevention',q:'A community health nurse conducts blood pressure screening in a barangay health center. This is an example of:',c:['Primary prevention','Secondary prevention','Tertiary prevention','Primordial prevention'],ci:1,r:'Screening for early detection of disease is secondary prevention — identifying disease before symptoms develop to enable early treatment.'},
{s:'community',t:'Levels of Prevention',q:'A nurse teaches mothers about exclusive breastfeeding to prevent infant diarrhea. This is:',c:['Secondary prevention','Tertiary prevention','Primary prevention','Rehabilitation'],ci:2,r:'Health education to prevent disease before it occurs is primary prevention.'},
{s:'community',t:'Family Nursing',q:'In the family nursing process, which is the FIRST step?',c:['Identifying family health problems','Data collection and assessment','Planning family-centered care','Evaluating nursing interventions'],ci:1,r:'Like the individual nursing process, family nursing begins with data collection and thorough assessment of the family unit.'},
{s:'community',t:'Immunization',q:'A 2-month-old infant is due for vaccines. Which vaccines are given at this age per the Philippine EPI?',c:['BCG and Hepatitis B','DPT, OPV, Hepatitis B, and Hib','MMR and Varicella','BCG, DPT, and OPV only'],ci:1,r:'At 2 months, the EPI schedule includes DPT (1st dose), OPV (1st dose), Hepatitis B (2nd dose), and Hib (1st dose).'},
{s:'community',t:'Maternal Health',q:'A pregnant woman at 28 weeks gestation visits the health center. Which assessment finding requires IMMEDIATE referral?',c:['Mild ankle edema','Fundal height of 27 cm','Blood pressure of 150/100 mmHg','Fetal heart rate of 140 bpm'],ci:2,r:'BP ≥140/90 in pregnancy indicates gestational hypertension or preeclampsia, requiring immediate referral to prevent maternal and fetal complications.'},
{s:'community',t:'Nutrition',q:'A 6-month-old is exclusively breastfed. The mother asks when to introduce solid foods. The nurse should advise:',c:['At 4 months','At 6 months','At 8 months','At 1 year'],ci:1,r:'WHO and Philippine guidelines recommend exclusive breastfeeding for 6 months, then introduction of complementary foods while continuing breastfeeding.'},
{s:'community',t:'Epidemiology',q:'During a measles outbreak in a school, 30 out of 200 susceptible children developed measles. The attack rate is:',c:['6%','10%','15%','30%'],ci:2,r:'Attack rate = (cases / susceptible population) × 100 = (30/200) × 100 = 15%.'},
{s:'community',t:'Home Visit',q:'Which principle BEST guides priority setting during a community health nurse home visit?',c:['Visit families with the most members first','Prioritize based on the family\'s felt needs and health risks','Visit the nearest homes first','Focus only on mothers and children'],ci:1,r:'Priority is given based on felt needs (problems the family recognizes) combined with actual health risks to ensure relevant and accepted nursing care.'},
{s:'community',t:'Tuberculosis',q:'A patient has been on anti-TB drugs for 2 weeks. The nurse observes the patient swallow all medications. This is an example of:',c:['Self-administered therapy','Directly Observed Treatment (DOT)','Passive case finding','Contact tracing'],ci:1,r:'DOT (Directly Observed Treatment) requires a health worker to observe the patient swallow every dose to ensure adherence and prevent drug resistance.'},
];

async function seed() {
  const client = await pool.connect();
  let count = 0;
  try {
    for (const q of questions) {
      await client.query(
        `INSERT INTO quiz_items (subject_code, topic_name, question, choices, correct_index, rationale, difficulty)
         VALUES ($1,$2,$3,$4,$5,$6,'medium')`,
        [q.s, q.t, q.q, JSON.stringify(q.c), q.ci, q.r]
      );
      count++;
    }
    console.log(`✅ Inserted ${count} questions!`);
  } finally {
    client.release();
    await pool.end();
  }
}
seed().catch(console.error);
