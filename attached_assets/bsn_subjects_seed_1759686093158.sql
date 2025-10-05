-- BSN subjects seed (neutral; no school attribution)
create table if not exists bsn_subjects (
  id serial primary key,
  year_level int not null,
  semester int not null,
  subject_code text not null,
  subject_title text not null,
  units int,
  type text not null
);
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,1,'NCM6103','Fundamentals of Nursing Practice',5,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,1,'NURS6103','Microbiology and Parasitology',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,1,'NURS6101','Anatomy and Physiology',5,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,1,'NURS6102','Biochemistry',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,1,'NCM6100','Theoretical Foundations of Nursing',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,1,'GE6100','Understanding the Self',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,1,'GE6101','Readings in Philippine History',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,1,'GE6102','The Contemporary World',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,1,'ETHNS6101','Euthenics 1',2,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,2,'NCM6101','Health Assessment',4,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,2,'GE6106','Purposive Communication',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,2,'GE6114','Mathematics in the Modern World',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,2,'GE6115','Art Appreciation',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (1,2,'ETHNS6102','Euthenics 2',2,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'NCM6200','Biostatistics',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'NCM6206','Pharmacology',4,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'NCM6210','Nursing Informatics',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'NURS6204','Logic and Critical Thinking',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'GE6107','Ethics',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'GE6116','Science, Technology & Society',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'FILI6101','Language and Culture',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'NCM6204','Community Health Nursing 1',4,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'NCM6207','Care of Mother, Child, Adolescent (Well Clients)',5,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'NSTP6101','National Service Training Program 1',3,'NSTP');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,1,'PHYED6101','Physical Fitness',2,'PE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,2,'NCM6202','Health Education',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,2,'NCM6205','Nutrition and Diet Therapy',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,2,'NCM6209','Care of Mother, Child at Risk/with Problems',5,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,2,'FILI6201','Critical Reading and Writing',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,2,'COMP6102','Current Trends and Issues in Information System',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,2,'NSTP6102','National Service Training Program 2',3,'NSTP');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (2,2,'PHYED6102','Rhythmic Activities',2,'PE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (3,1,'NCM6311','Nursing Research 1',3,'RESEARCH');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (3,1,'NCM6312','Care of Clients with Problems in Oxygenation, Fluid and Electrolyte',4,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (3,1,'NCM6313','Community Health Nursing 2',4,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (3,1,'NCM6308','Bioethics',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (3,1,'FILI6301','Translation Studies',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (3,1,'PHYED6103','Individual/Dual Sports',2,'PE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (3,2,'NCM6314','Care of Older Person',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (3,2,'NCM6315','Nursing Research 2',3,'RESEARCH');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (3,2,'NCM6317','Care of Client with Maladaptive Patterns of Behavior',4,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (3,2,'PHYED6200','Team Sports',2,'PE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (4,1,'GE6300','Life and Works (National History)',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (4,1,'NCM6400','Competency Appraisal',2,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (4,1,'NCM6418','Nursing Care of Clients with Life Threatening Conditions',5,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (4,1,'NCM6419','Nursing Leadership and Management',4,'LEADERSHIP');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (4,1,'FREEELECTIVE','Free Elective',3,'GE');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (4,2,'NCM6420','Decent Work Employment and Transcultural Nursing',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (4,2,'NCM6421','Disaster Nursing',3,'MAJOR');
insert into bsn_subjects (year_level, semester, subject_code, subject_title, units, type) values (4,2,'NCM6422','Intensive Nursing Practicum (408 hrs)',0,'RLE');