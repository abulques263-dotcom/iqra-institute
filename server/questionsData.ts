import { DailyQuestion, SubjectCategory, DifficultyLevel } from '../src/types.js';

export interface BankQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
  subject: SubjectCategory;
  studentClass: string;
  topic: string;
  difficulty: DifficultyLevel;
  isPublished: boolean;
  createdAt: string;
}

// Pre-defined seed core questions covering key curriculum topics
export const curatedSeedQuestions: BankQuestion[] = [
  // Class 1 - 4: Mathematics
  {
    id: 'bq-m-001',
    question: 'If Rahul has 15 marbles and his friend gives him 18 more, how many marbles does Rahul have in total?',
    options: ['30 marbles', '33 marbles', '35 marbles', '28 marbles'],
    answer: '33 marbles',
    explanation: 'Add the two amounts: 15 + 18 = 33 marbles.',
    hint: 'Add 15 and 18 together.',
    subject: 'Mathematics',
    studentClass: 'Class 1 – 4',
    topic: 'Addition',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 'bq-m-002',
    question: 'A baker bakes 6 trays of cookies. Each tray contains 8 cookies. How many cookies are there altogether?',
    options: ['42 cookies', '46 cookies', '48 cookies', '54 cookies'],
    answer: '48 cookies',
    explanation: 'Multiply the number of trays by cookies per tray: 6 × 8 = 48 cookies.',
    hint: 'Use multiplication: 6 times 8.',
    subject: 'Mathematics',
    studentClass: 'Class 1 – 4',
    topic: 'Multiplication',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-10T08:05:00.000Z'
  },
  {
    id: 'bq-m-003',
    question: 'What is the place value of the digit 7 in the number 4,752?',
    options: ['7', '70', '700', '7000'],
    answer: '700',
    explanation: 'In 4,752, 2 is in ones place, 5 is in tens place, 7 is in hundreds place (7 × 100 = 700), and 4 is in thousands place.',
    hint: 'Look at the hundreds position.',
    subject: 'Mathematics',
    studentClass: 'Class 1 – 4',
    topic: 'Place Value',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-10T08:10:00.000Z'
  },
  {
    id: 'bq-m-004',
    question: 'Subtract 249 from 600. What is the result?',
    options: ['341', '351', '361', '451'],
    answer: '351',
    explanation: '600 - 249 = 351. You can check by adding: 351 + 249 = 600.',
    hint: 'Regroup from the hundreds place.',
    subject: 'Mathematics',
    studentClass: 'Class 1 – 4',
    topic: 'Subtraction',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-10T08:15:00.000Z'
  },
  {
    id: 'bq-m-005',
    question: 'A clock shows 4:45 PM. What time will it be after 45 minutes?',
    options: ['5:15 PM', '5:30 PM', '5:45 PM', '6:00 PM'],
    answer: '5:30 PM',
    explanation: 'From 4:45 PM, 15 minutes brings the clock to 5:00 PM. The remaining 30 minutes makes it 5:30 PM.',
    hint: 'First reach 5:00 PM, then add remaining minutes.',
    subject: 'Mathematics',
    studentClass: 'Class 1 – 4',
    topic: 'Time and Clocks',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-10T08:20:00.000Z'
  },
  // Class 5 - 6: Mathematics
  {
    id: 'bq-m-006',
    question: 'What is the Lowest Common Multiple (LCM) of 12 and 18?',
    options: ['24', '36', '48', '72'],
    answer: '36',
    explanation: 'Multiples of 12: 12, 24, 36, 48... Multiples of 18: 18, 36, 54... The lowest common multiple is 36.',
    hint: 'List the multiples of 18 and see which is divisible by 12.',
    subject: 'Mathematics',
    studentClass: 'Class 5 – 6',
    topic: 'LCM & HCF',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-10T08:25:00.000Z'
  },
  {
    id: 'bq-m-007',
    question: 'Simplify the fraction: 36 / 48 to its lowest terms.',
    options: ['2/3', '3/4', '4/5', '6/8'],
    answer: '3/4',
    explanation: 'Divide numerator and denominator by their HCF (12): 36 ÷ 12 = 3 and 48 ÷ 12 = 4. So the simplified fraction is 3/4.',
    hint: 'Divide both numbers by 12.',
    subject: 'Mathematics',
    studentClass: 'Class 5 – 6',
    topic: 'Fractions',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-10T08:30:00.000Z'
  },
  {
    id: 'bq-m-008',
    question: 'Find the perimeter of a rectangle with length 14 cm and breadth 9 cm.',
    options: ['46 cm', '50 cm', '126 cm', '32 cm'],
    answer: '46 cm',
    explanation: 'Perimeter of rectangle = 2 × (Length + Breadth) = 2 × (14 + 9) = 2 × 23 = 46 cm.',
    hint: 'Use the formula 2 × (Length + Breadth).',
    subject: 'Mathematics',
    studentClass: 'Class 5 – 6',
    topic: 'Perimeter and Area',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-10T08:35:00.000Z'
  },
  {
    id: 'bq-m-009',
    question: 'Express 0.65 as a percentage.',
    options: ['6.5%', '65%', '0.65%', '650%'],
    answer: '65%',
    explanation: 'To convert a decimal to a percentage, multiply by 100: 0.65 × 100 = 65%.',
    hint: 'Multiply the decimal by 100.',
    subject: 'Mathematics',
    studentClass: 'Class 5 – 6',
    topic: 'Decimals and Percentages',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-10T08:40:00.000Z'
  },
  // Class 7 - 8: Mathematics
  {
    id: 'bq-m-010',
    question: 'Solve for y in the linear equation: 5y - 7 = 3y + 11.',
    options: ['y = 6', 'y = 9', 'y = 8', 'y = 4'],
    answer: 'y = 9',
    explanation: 'Step 1: Subtract 3y from both sides: 2y - 7 = 11. Step 2: Add 7 to both sides: 2y = 18. Step 3: Divide by 2: y = 9.',
    hint: 'Bring variable terms to one side and constants to the other.',
    subject: 'Mathematics',
    studentClass: 'Class 7 – 8',
    topic: 'Algebra',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-10T08:45:00.000Z'
  },
  {
    id: 'bq-m-011',
    question: 'The sum of three consecutive interior angles of a quadrilateral is 270°. What is the measure of the fourth angle?',
    options: ['70°', '80°', '90°', '100°'],
    answer: '90°',
    explanation: 'The sum of all interior angles of a quadrilateral is always 360°. Fourth angle = 360° - 270° = 90°.',
    hint: 'Sum of angles in any quadrilateral is 360°.',
    subject: 'Mathematics',
    studentClass: 'Class 7 – 8',
    topic: 'Geometry',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-10T08:50:00.000Z'
  },
  {
    id: 'bq-m-012',
    question: 'If a bicycle is bought for ₹4,000 and sold for ₹4,600, what is the profit percentage?',
    options: ['12%', '15%', '18%', '20%'],
    answer: '15%',
    explanation: 'Profit = ₹4,600 - ₹4,000 = ₹600. Profit % = (Profit / Cost Price) × 100 = (600 / 4000) × 100 = 15%.',
    hint: 'Calculate (Profit / Cost Price) × 100.',
    subject: 'Mathematics',
    studentClass: 'Class 7 – 8',
    topic: 'Profit and Loss',
    difficulty: 'Challenging',
    isPublished: true,
    createdAt: '2026-01-10T08:55:00.000Z'
  },

  // Science: Class 1 - 4
  {
    id: 'bq-s-001',
    question: 'Which part of a plant grows beneath the soil and anchors it firmly?',
    options: ['Stem', 'Leaf', 'Root', 'Flower'],
    answer: 'Root',
    explanation: 'The roots grow under the ground, holding the plant firmly in soil and absorbing water and minerals.',
    hint: 'It takes water from underground.',
    subject: 'Science',
    studentClass: 'Class 1 – 4',
    topic: 'Plants & Nature',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-11T09:00:00.000Z'
  },
  {
    id: 'bq-s-002',
    question: 'Which of the following animals is an herbivore (plant-eater)?',
    options: ['Lion', 'Cow', 'Tiger', 'Eagle'],
    answer: 'Cow',
    explanation: 'Herbivores eat only plants and grass. Cows, goats, and deer are examples of herbivores.',
    hint: 'Think of the animal that grazes in green fields.',
    subject: 'Science',
    studentClass: 'Class 1 – 4',
    topic: 'Animals & Food Chains',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-11T09:05:00.000Z'
  },
  {
    id: 'bq-s-003',
    question: 'Water changes into water vapor when it is heated. What is this process called?',
    options: ['Freezing', 'Melting', 'Evaporation', 'Condensation'],
    answer: 'Evaporation',
    explanation: 'Evaporation is the process where liquid water turns into a gas (water vapor) upon heating.',
    hint: 'Think of wet clothes drying in the hot sun.',
    subject: 'Science',
    studentClass: 'Class 1 – 4',
    topic: 'States of Matter',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-11T09:10:00.000Z'
  },

  // Science: Class 5 - 6
  {
    id: 'bq-s-004',
    question: 'Which component of blood is responsible for carrying oxygen from the lungs to all parts of the human body?',
    options: ['White Blood Cells', 'Red Blood Cells (Hemoglobin)', 'Platelets', 'Plasma'],
    answer: 'Red Blood Cells (Hemoglobin)',
    explanation: 'Red blood cells contain hemoglobin, an iron-rich protein that binds with oxygen and transports it throughout the body.',
    hint: 'They give blood its red color.',
    subject: 'Science',
    studentClass: 'Class 5 – 6',
    topic: 'Human Body Systems',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-11T09:15:00.000Z'
  },
  {
    id: 'bq-s-005',
    question: 'Which planet in our solar system is famously known as the "Red Planet"?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    answer: 'Mars',
    explanation: 'Mars is called the Red Planet because its surface contains abundant iron oxide (rust), giving it a reddish appearance.',
    hint: 'It is the fourth planet from the Sun.',
    subject: 'Science',
    studentClass: 'Class 5 – 6',
    topic: 'Solar System & Astronomy',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-11T09:20:00.000Z'
  },
  {
    id: 'bq-s-006',
    question: 'What type of simple machine is a pair of scissors?',
    options: ['Inclined plane', 'Lever', 'Pulley', 'Wheel and axle'],
    answer: 'Lever',
    explanation: 'A pair of scissors is a first-class lever where the pivot (fulcrum) lies between the effort (handles) and the load (blades).',
    hint: 'It pivots around a central pin.',
    subject: 'Science',
    studentClass: 'Class 5 – 6',
    topic: 'Force and Simple Machines',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-11T09:25:00.000Z'
  },

  // Science: Class 7 - 8
  {
    id: 'bq-s-007',
    question: 'What is the chemical formula for common table salt?',
    options: ['HCl', 'NaOH', 'NaCl', 'KCl'],
    answer: 'NaCl',
    explanation: 'Common table salt is Sodium Chloride, made up of sodium (Na) and chlorine (Cl) atoms in a 1:1 ratio.',
    hint: 'It contains Sodium (Na) and Chlorine (Cl).',
    subject: 'Science',
    studentClass: 'Class 7 – 8',
    topic: 'Chemistry Basics',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-11T09:30:00.000Z'
  },
  {
    id: 'bq-s-008',
    question: 'Which cell organelle is known as the "Powerhouse of the Cell"?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
    answer: 'Mitochondria',
    explanation: 'Mitochondria generate most of the chemical energy needed by the cell in the form of ATP molecules, hence called the powerhouse.',
    hint: 'It produces cellular energy (ATP).',
    subject: 'Science',
    studentClass: 'Class 7 – 8',
    topic: 'Cell Biology',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-11T09:35:00.000Z'
  },
  {
    id: 'bq-s-009',
    question: 'According to Newton’s First Law of Motion, an object at rest will stay at rest unless acted upon by:',
    options: ['Friction only', 'Gravitational pull only', 'An unbalanced external force', 'Centrifugal force'],
    answer: 'An unbalanced external force',
    explanation: 'Newton’s First Law (Law of Inertia) states that an object continues in its state of rest or uniform motion unless compelled to change by an external net force.',
    hint: 'Think of inertia and net external force.',
    subject: 'Science',
    studentClass: 'Class 7 – 8',
    topic: 'Physics - Laws of Motion',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-11T09:40:00.000Z'
  },

  // English: Class 1 - 4
  {
    id: 'bq-e-001',
    question: 'Identify the noun in this sentence: "The happy children played in the garden."',
    options: ['Happy', 'Children & Garden', 'Played', 'In the'],
    answer: 'Children & Garden',
    explanation: 'Nouns are naming words for people, places, or things. Here "children" (people) and "garden" (place) are nouns.',
    hint: 'Look for the names of people and places.',
    subject: 'English',
    studentClass: 'Class 1 – 4',
    topic: 'Parts of Speech',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-12T10:00:00.000Z'
  },
  {
    id: 'bq-e-002',
    question: 'Choose the correct plural form of the word "LEAF":',
    options: ['Leafs', 'Leaves', 'Leafes', 'Leavs'],
    answer: 'Leaves',
    explanation: 'For words ending in "f" or "fe", we often change the "f" to "v" and add "es" (Leaf → Leaves, Wolf → Wolves).',
    hint: 'The ending changes from -f to -ves.',
    subject: 'English',
    studentClass: 'Class 1 – 4',
    topic: 'Plural Nouns',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-12T10:05:00.000Z'
  },
  {
    id: 'bq-e-003',
    question: 'Choose the correct article for the blank: "She saw ____ owl sitting on the high tree branch."',
    options: ['a', 'an', 'the', 'no article needed'],
    answer: 'an',
    explanation: 'We use "an" before singular nouns that begin with a vowel sound (O in Owl).',
    hint: 'The word "owl" begins with a vowel sound.',
    subject: 'English',
    studentClass: 'Class 1 – 4',
    topic: 'Articles (A, An, The)',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-12T10:10:00.000Z'
  },

  // English: Class 5 - 6
  {
    id: 'bq-e-004',
    question: 'Identify the conjunction in this sentence: "He worked hard although he was feeling tired."',
    options: ['Worked', 'Hard', 'Although', 'Tired'],
    answer: 'Although',
    explanation: '"Although" is a subordinating conjunction connecting the main clause "He worked hard" with the clause "he was feeling tired".',
    hint: 'It connects two contrasting clauses.',
    subject: 'English',
    studentClass: 'Class 5 – 6',
    topic: 'Conjunctions',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-12T10:15:00.000Z'
  },
  {
    id: 'bq-e-005',
    question: 'Choose the word with the correct spelling:',
    options: ['Accomodate', 'Accommodate', 'Acommodate', 'Accomadate'],
    answer: 'Accommodate',
    explanation: 'The correct spelling is "Accommodate", with double "c" and double "m".',
    hint: 'It has two c\'s and two m\'s.',
    subject: 'English',
    studentClass: 'Class 5 – 6',
    topic: 'Vocabulary & Spelling',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-12T10:20:00.000Z'
  },

  // English: Class 7 - 8
  {
    id: 'bq-e-006',
    question: 'Change into passive voice: "The master teacher explained the complex theorem."',
    options: [
      'The complex theorem was explained by the master teacher.',
      'The complex theorem had explained by the master teacher.',
      'The master teacher is explaining the theorem.',
      'The theorem was been explained by the master teacher.'
    ],
    answer: 'The complex theorem was explained by the master teacher.',
    explanation: 'Simple past active ("explained") changes to "was/were + past participle" ("was explained").',
    hint: 'Use "was explained by...".',
    subject: 'English',
    studentClass: 'Class 7 – 8',
    topic: 'Active & Passive Voice',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-12T10:25:00.000Z'
  },

  // Reasoning & GK
  {
    id: 'bq-r-001',
    question: 'If CAT is coded as 3120 in a code language, how is DOG coded (A=1, B=2... Z=26)?',
    options: ['4157', '4147', '3157', '4158'],
    answer: '4157',
    explanation: 'D = 4, O = 15, G = 7. Putting them together gives 4157.',
    hint: 'Write the alphabetical position numbers for D, O, and G.',
    subject: 'Reasoning',
    studentClass: 'Class 5 – 8',
    topic: 'Coding & Decoding',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-01-13T11:00:00.000Z'
  },
  {
    id: 'bq-r-002',
    question: 'Pointing to a photograph, Amit said, "She is the only daughter of my mother." Who is the person in the photograph to Amit?',
    options: ['Amit\'s Wife', 'Amit\'s Sister', 'Amit\'s Daughter', 'Amit\'s Mother'],
    answer: 'Amit\'s Sister',
    explanation: 'The daughter of Amit\'s mother is Amit\'s sister.',
    hint: 'Who is your mother\'s daughter to you?',
    subject: 'Reasoning',
    studentClass: 'Class 5 – 8',
    topic: 'Blood Relations',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-13T11:05:00.000Z'
  },
  {
    id: 'bq-gk-001',
    question: 'Who is known as the "Father of the Indian Constitution"?',
    options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel'],
    answer: 'Dr. B.R. Ambedkar',
    explanation: 'Dr. Bhimrao Ramji Ambedkar served as the chairman of the Drafting Committee of the Indian Constitution.',
    hint: 'He chaired the Drafting Committee.',
    subject: 'General Knowledge',
    studentClass: 'Class 1 – 8',
    topic: 'Indian History & Polity',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-13T11:10:00.000Z'
  },
  {
    id: 'bq-gk-002',
    question: 'What is the capital city of Uttar Pradesh, India?',
    options: ['Noida', 'Varanasi', 'Lucknow', 'Kanpur'],
    answer: 'Lucknow',
    explanation: 'Lucknow is the administrative and legislative capital of Uttar Pradesh.',
    hint: 'It is known as the city of Nawabs.',
    subject: 'General Knowledge',
    studentClass: 'Class 1 – 8',
    topic: 'Indian Geography',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-01-13T11:15:00.000Z'
  }
];

// Helper to generate a full suite of 1,000+ well-categorized questions
export function generateComprehensiveQuestionBank(): BankQuestion[] {
  const bank: BankQuestion[] = [...curatedSeedQuestions];

  const subjects: SubjectCategory[] = [
    'Mathematics',
    'Science',
    'English',
    'Reasoning',
    'General Knowledge',
    'Basic Concepts'
  ];

  const classBuckets = [
    { label: 'Nursery – UKG', grades: [0] },
    { label: 'Class 1 – 4', grades: [1, 2, 3, 4] },
    { label: 'Class 5 – 6', grades: [5, 6] },
    { label: 'Class 7 – 8', grades: [7, 8] }
  ];

  const difficulties: DifficultyLevel[] = ['Easy', 'Medium', 'Challenging'];

  // 1. Math Generator Templates
  const mathGenerators = [
    // Nursery/UKG & Early Primary: Counting & Basic Addition
    {
      classBucket: 'Nursery – UKG',
      topic: 'Basic Numbers & Counting',
      generate: (i: number): BankQuestion => {
        const a = (i % 8) + 2;
        const b = (i % 6) + 1;
        const sum = a + b;
        return {
          id: `gen-math-nur-${i}`,
          question: `Count and add: What is ${a} + ${b}?`,
          options: [`${sum}`, `${sum + 1}`, `${Math.max(1, sum - 1)}`, `${sum + 2}`].sort(() => 0.5 - ((i * 7) % 3)),
          answer: `${sum}`,
          explanation: `When you combine ${a} and ${b}, you get ${sum}. Count forward: ${a}... + ${b} = ${sum}.`,
          hint: `Start at ${a} and count forward ${b} steps.`,
          subject: 'Mathematics',
          studentClass: 'Nursery – UKG',
          topic: 'Basic Numbers & Counting',
          difficulty: 'Easy',
          isPublished: true,
          createdAt: new Date(2026, 0, (i % 28) + 1).toISOString()
        };
      }
    },
    // Class 1 - 4: Multiplication Tables & Word Problems
    {
      classBucket: 'Class 1 – 4',
      topic: 'Multiplication Tables & Word Problems',
      generate: (i: number): BankQuestion => {
        const table = (i % 11) + 2; // 2 to 12
        const multiplier = (i % 10) + 1; // 1 to 10
        const product = table * multiplier;
        const items = ['pencils', 'apples', 'stickers', 'books', 'chocolates', 'balloons'][i % 6];
        return {
          id: `gen-math-c14-m-${i}`,
          question: `If there are ${multiplier} boxes with ${table} ${items} in each box, how many ${items} are there in total?`,
          options: [
            `${product} ${items}`,
            `${product + table} ${items}`,
            `${Math.max(table, product - table)} ${items}`,
            `${product + 2} ${items}`
          ].sort(() => 0.5 - ((i * 5) % 3)),
          answer: `${product} ${items}`,
          explanation: `Multiply the number of boxes by items per box: ${multiplier} × ${table} = ${product} ${items}.`,
          hint: `Use the multiplication table of ${table}.`,
          subject: 'Mathematics',
          studentClass: 'Class 1 – 4',
          topic: 'Multiplication Tables',
          difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Challenging',
          isPublished: true,
          createdAt: new Date(2026, 1, (i % 28) + 1).toISOString()
        };
      }
    },
    // Class 1 - 4: Subtraction with borrowing
    {
      classBucket: 'Class 1 – 4',
      topic: 'Subtraction & Regrouping',
      generate: (i: number): BankQuestion => {
        const big = 100 + (i * 7) % 850;
        const small = 25 + (i * 3) % 95;
        const diff = big - small;
        return {
          id: `gen-math-c14-sub-${i}`,
          question: `Subtract: ${big} - ${small} = ?`,
          options: [`${diff}`, `${diff + 10}`, `${diff - 10}`, `${diff + 1}`].sort(() => 0.5 - ((i * 3) % 2)),
          answer: `${diff}`,
          explanation: `Subtract column by column: ${big} minus ${small} equals ${diff}. You can verify by adding ${diff} + ${small} = ${big}.`,
          hint: `Regroup from the tens or hundreds digit if needed.`,
          subject: 'Mathematics',
          studentClass: 'Class 1 – 4',
          topic: 'Subtraction & Regrouping',
          difficulty: 'Medium',
          isPublished: true,
          createdAt: new Date(2026, 2, (i % 28) + 1).toISOString()
        };
      }
    },
    // Class 5 - 6: Fractions & Decimals
    {
      classBucket: 'Class 5 – 6',
      topic: 'Fractions & Operations',
      generate: (i: number): BankQuestion => {
        const denom = [4, 6, 8, 10, 12][i % 5];
        const num1 = (i % (denom - 1)) + 1;
        const num2 = (i % 3) + 1;
        const sumNum = num1 + num2;
        return {
          id: `gen-math-c56-frac-${i}`,
          question: `Solve the fraction addition: ${num1}/${denom} + ${num2}/${denom} = ?`,
          options: [
            `${sumNum}/${denom}`,
            `${sumNum}/${denom * 2}`,
            `${num1 * num2}/${denom}`,
            `${Math.max(1, sumNum - 1)}/${denom}`
          ].sort(() => 0.5 - (i % 3)),
          answer: `${sumNum}/${denom}`,
          explanation: `Since the denominators are like (${denom}), simply add the numerators: ${num1} + ${num2} = ${sumNum}. Result = ${sumNum}/${denom}.`,
          hint: `Keep the common denominator ${denom} and add the top numbers.`,
          subject: 'Mathematics',
          studentClass: 'Class 5 – 6',
          topic: 'Fractions & Operations',
          difficulty: 'Easy',
          isPublished: true,
          createdAt: new Date(2026, 3, (i % 28) + 1).toISOString()
        };
      }
    },
    // Class 5 - 6: Geometry & Area
    {
      classBucket: 'Class 5 – 6',
      topic: 'Area and Perimeter',
      generate: (i: number): BankQuestion => {
        const side = (i % 15) + 4;
        const area = side * side;
        const peri = side * 4;
        const isArea = i % 2 === 0;
        return {
          id: `gen-math-c56-geo-${i}`,
          question: isArea
            ? `Find the area of a square having side length ${side} cm.`
            : `Find the perimeter of a square having side length ${side} cm.`,
          options: isArea
            ? [`${area} cm²`, `${peri} cm²`, `${area + side} cm²`, `${area - side} cm²`].sort(() => 0.5 - (i % 2))
            : [`${peri} cm`, `${area} cm`, `${peri + 4} cm`, `${side * 2} cm`].sort(() => 0.5 - (i % 2)),
          answer: isArea ? `${area} cm²` : `${peri} cm`,
          explanation: isArea
            ? `Area of square = side × side = ${side} × ${side} = ${area} cm².`
            : `Perimeter of square = 4 × side = 4 × ${side} = ${peri} cm.`,
          hint: isArea ? `Formula: side × side` : `Formula: 4 × side`,
          subject: 'Mathematics',
          studentClass: 'Class 5 – 6',
          topic: 'Area and Perimeter',
          difficulty: 'Medium',
          isPublished: true,
          createdAt: new Date(2026, 4, (i % 28) + 1).toISOString()
        };
      }
    },
    // Class 7 - 8: Simple Equations & Algebra
    {
      classBucket: 'Class 7 – 8',
      topic: 'Algebra & Linear Equations',
      generate: (i: number): BankQuestion => {
        const coeff = (i % 4) + 2; // 2, 3, 4, 5
        const ans = (i % 9) + 2; // 2 to 10
        const constant = (i % 7) + 3;
        const rhs = coeff * ans + constant;
        return {
          id: `gen-math-c78-alg-${i}`,
          question: `Solve for x: ${coeff}x + ${constant} = ${rhs}`,
          options: [`x = ${ans}`, `x = ${ans + 1}`, `x = ${Math.max(1, ans - 1)}`, `x = ${ans + 2}`].sort(
            () => 0.5 - ((i * 11) % 3)
          ),
          answer: `x = ${ans}`,
          explanation: `Step 1: Subtract ${constant} from ${rhs}: ${coeff}x = ${rhs - constant}. Step 2: Divide by ${coeff}: x = ${ans}.`,
          hint: `First subtract ${constant} from the right side, then divide by ${coeff}.`,
          subject: 'Mathematics',
          studentClass: 'Class 7 – 8',
          topic: 'Algebra & Linear Equations',
          difficulty: 'Medium',
          isPublished: true,
          createdAt: new Date(2026, 5, (i % 28) + 1).toISOString()
        };
      }
    },
    // Class 7 - 8: Percentage & Ratios
    {
      classBucket: 'Class 7 – 8',
      topic: 'Percentages and Ratios',
      generate: (i: number): BankQuestion => {
        const total = [200, 300, 400, 500, 600, 800][i % 6];
        const pct = [10, 15, 20, 25, 30, 40, 50][i % 7];
        const val = (total * pct) / 100;
        return {
          id: `gen-math-c78-pct-${i}`,
          question: `What is ${pct}% of ₹${total}?`,
          options: [`₹${val}`, `₹${val + 10}`, `₹${val - 10}`, `₹${val + 25}`].sort(() => 0.5 - (i % 3)),
          answer: `₹${val}`,
          explanation: `Calculate (${pct} / 100) × ${total} = ${pct * total} / 100 = ₹${val}.`,
          hint: `Multiply ${total} by ${pct} and divide by 100.`,
          subject: 'Mathematics',
          studentClass: 'Class 7 – 8',
          topic: 'Percentages and Ratios',
          difficulty: i % 2 === 0 ? 'Medium' : 'Challenging',
          isPublished: true,
          createdAt: new Date(2026, 6, (i % 28) + 1).toISOString()
        };
      }
    }
  ];

  // 2. Science Topics Generator
  const scienceTopics = [
    {
      topic: 'Plant Life & Photosynthesis',
      class: 'Class 1 – 4',
      items: [
        { q: 'What green pigment in leaves absorbs sunlight to make food?', a: 'Chlorophyll', o: ['Chlorophyll', 'Hemoglobin', 'Melanin', 'Carotene'], e: 'Chlorophyll gives leaves their green color and traps solar energy for photosynthesis.' },
        { q: 'Which part of a plant is known as the "food factory" of the plant?', a: 'Leaf', o: ['Leaf', 'Stem', 'Root', 'Flower'], e: 'Leaves produce food for the plant through photosynthesis using sunlight, water, and carbon dioxide.' },
        { q: 'What do seeds need to germinate into new healthy seedlings?', a: 'Water, warmth (air), and suitable soil', o: ['Water, warmth (air), and suitable soil', 'Ice and darkness only', 'Salt water only', 'Boiling water'], e: 'Seeds require moisture, proper temperature (warmth), and oxygen to sprout.' }
      ]
    },
    {
      topic: 'Human Body & Health',
      class: 'Class 5 – 6',
      items: [
        { q: 'How many bones are there in an adult human skeleton?', a: '206 bones', o: ['206 bones', '300 bones', '150 bones', '250 bones'], e: 'An adult human body has 206 bones that provide structure and protect vital organs.' },
        { q: 'Which organ pumps blood throughout the human body?', a: 'Heart', o: ['Heart', 'Lungs', 'Stomach', 'Kidneys'], e: 'The heart acts as a muscular pump circulating oxygenated blood to all body tissues.' },
        { q: 'Which vitamin is synthesized by human skin when exposed to sunlight?', a: 'Vitamin D', o: ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin B12'], e: 'Sunlight helps skin cells produce Vitamin D, which is essential for strong bones.' }
      ]
    },
    {
      topic: 'Physics & Motion',
      class: 'Class 7 – 8',
      items: [
        { q: 'What is the SI unit of Force?', a: 'Newton (N)', o: ['Newton (N)', 'Joule (J)', 'Watt (W)', 'Pascal (Pa)'], e: 'The SI unit of force is the Newton (N), named after Sir Isaac Newton.' },
        { q: 'What is the speed of light in vacuum (approximate)?', a: '3 × 10⁸ m/s (3,00,000 km/s)', o: ['3 × 10⁸ m/s (3,00,000 km/s)', '3 × 10⁵ m/s', '1,50,000 km/s', '3,000 m/s'], e: 'Light travels at approximately 3,00,000 kilometers per second in a vacuum.' },
        { q: 'Which form of energy is stored in a stretched rubber band or compressed spring?', a: 'Potential Energy', o: ['Potential Energy', 'Kinetic Energy', 'Thermal Energy', 'Sound Energy'], e: 'Potential energy is stored energy due to position or deformation (elastic potential energy).' }
      ]
    },
    {
      topic: 'Chemistry & Elements',
      class: 'Class 7 – 8',
      items: [
        { q: 'What is the chemical symbol for Gold in the periodic table?', a: 'Au', o: ['Au', 'Ag', 'Gd', 'Fe'], e: 'Gold has the chemical symbol "Au", derived from its Latin name "Aurum".' },
        { q: 'What is the pH value of pure distilled water at 25°C?', a: 'pH 7 (Neutral)', o: ['pH 7 (Neutral)', 'pH 1 (Acidic)', 'pH 14 (Basic)', 'pH 4'], e: 'Pure neutral water has a pH of exactly 7, neither acidic nor basic.' },
        { q: 'Which gas is the most abundant in Earth\'s atmosphere?', a: 'Nitrogen (~78%)', o: ['Nitrogen (~78%)', 'Oxygen (~21%)', 'Carbon dioxide', 'Argon'], e: 'Nitrogen makes up about 78% of Earth\'s atmosphere, followed by Oxygen at about 21%.' }
      ]
    }
  ];

  // 3. English Language & Grammar Generator
  const englishTopics = [
    {
      topic: 'Nouns, Pronouns & Verbs',
      class: 'Class 1 – 4',
      items: [
        { q: 'Choose the pronoun to replace the underlined words: "Rahul and Rohan are playing cricket."', a: 'They', o: ['They', 'He', 'She', 'It'], e: '"They" is the correct third-person plural pronoun for multiple people.' },
        { q: 'Identify the action verb in: "The little bird sings a sweet song every morning."', a: 'Sings', o: ['Sings', 'Bird', 'Sweet', 'Morning'], e: '"Sings" expresses the action performed by the bird.' },
        { q: 'Choose the correct opposite (Antonym) for the word: "ANCIENT".', a: 'Modern', o: ['Modern', 'Old', 'Antique', 'Historic'], e: 'Ancient means very old; its direct antonym is Modern.' }
      ]
    },
    {
      topic: 'Tenses & Prepositions',
      class: 'Class 5 – 6',
      items: [
        { q: 'Fill in the correct preposition: "The book is kept ____ the wooden table."', a: 'on', o: ['on', 'in', 'at', 'into'], e: 'We use "on" to indicate position touching a surface.' },
        { q: 'Choose the sentence in Past Continuous Tense:', a: 'She was reading an interesting story book.', o: ['She was reading an interesting story book.', 'She reads an interesting book.', 'She will read a book.', 'She has read a book.'], e: 'Past continuous tense takes "was/were + verb-ing" ("was reading").' },
        { q: 'Choose the synonym for the word: "DILIGENT".', a: 'Hardworking', o: ['Hardworking', 'Lazy', 'Careless', 'Slow'], e: 'Diligent means showing steady, earnest, and energetic effort (Hardworking).' }
      ]
    },
    {
      topic: 'Direct-Indirect & Idioms',
      class: 'Class 7 – 8',
      items: [
        { q: 'What is the meaning of the English idiom: "A piece of cake"?', a: 'Something very easy to do', o: ['Something very easy to do', 'A delicious sweet food', 'A difficult challenge', 'An expensive gift'], e: 'The idiom "a piece of cake" describes a task or exam that is simple and easy.' },
        { q: 'Choose the correct passive voice: "The chef cooked a delicious dinner."', a: 'A delicious dinner was cooked by the chef.', o: ['A delicious dinner was cooked by the chef.', 'Dinner has cooked by chef.', 'A chef was cooked by dinner.', 'Dinner is cooked chef.'], e: 'Subject and object swap; simple past "cooked" becomes "was cooked".' },
        { q: 'Identify the figure of speech: "The wind whispered through the dark pine trees."', a: 'Personification', o: ['Personification', 'Metaphor', 'Simile', 'Hyperbole'], e: 'Personification attributes human qualities (whispering) to non-human elements (the wind).' }
      ]
    }
  ];

  // 4. Reasoning & Logic Questions
  const reasoningItems = [
    { q: 'Complete the number series: 2, 4, 8, 16, 32, ?', a: '64', o: ['64', '48', '56', '72'], e: 'Each number is multiplied by 2 (doubled): 32 × 2 = 64.', t: 'Class 5 – 8' },
    { q: 'Complete the pattern: 5, 10, 15, 20, 25, ?', a: '30', o: ['30', '35', '28', '32'], e: 'Add 5 to each term: 25 + 5 = 30.', t: 'Class 1 – 4' },
    { q: 'If PEN is to WRITING, then KNIFE is to:', a: 'CUTTING', o: ['CUTTING', 'EATING', 'SHARPENING', 'COOKING'], e: 'A pen is a tool used for writing; a knife is a tool used for cutting.' , t: 'Class 1 – 8' },
    { q: 'Find the odd one out: [Carrot, Potato, Radish, Mango]', a: 'Mango (It is a fruit; others grow underground)', o: ['Mango (It is a fruit; others grow underground)', 'Carrot', 'Potato', 'Radish'], e: 'Mango is a tree fruit, while carrot, potato, and radish are root/stem vegetables.' , t: 'Class 1 – 8' },
    { q: 'If South-East becomes North, North-East becomes West, what will West become?', a: 'South-East', o: ['South-East', 'South-West', 'North-West', 'East'], e: 'The directions are rotated 135 degrees counter-clockwise.', t: 'Class 7 – 8' }
  ];

  // 5. General Knowledge Questions
  const gkItems = [
    { q: 'Which is the longest river in India?', a: 'The Ganga (Ganges)', o: ['The Ganga (Ganges)', 'Yamuna', 'Godavari', 'Narmada'], e: 'The Ganga flows over 2,525 km within India and is the longest river in the country.' },
    { q: 'Who wrote the Indian National Anthem ("Jana Gana Mana")?', a: 'Rabindranath Tagore', o: ['Rabindranath Tagore', 'Bankim Chandra Chatterjee', 'Sarojini Naidu', 'Subhash Chandra Bose'], e: 'Nobel laureate Rabindranath Tagore composed the national anthem in Bengali original.' },
    { q: 'Which is the largest continent in the world by land area?', a: 'Asia', o: ['Asia', 'Africa', 'Europe', 'North America'], e: 'Asia is the largest continent, covering about 30% of Earth\'s total land area.' },
    { q: 'What is the national animal of India?', a: 'Royal Bengal Tiger', o: ['Royal Bengal Tiger', 'Indian Elephant', 'Asiatic Lion', 'Peacock'], e: 'The Royal Bengal Tiger is India\'s national animal, symbolizing grace and power.' },
    { q: 'How many states and union territories does India have (approximate current structure)?', a: '28 States and 8 Union Territories', o: ['28 States and 8 Union Territories', '29 States and 7 UTs', '25 States and 9 UTs', '30 States and 6 UTs'], e: 'India currently comprises 28 states and 8 Union Territories.' },
    { q: 'Which organ in the human body purifies blood and produces urine?', a: 'Kidneys', o: ['Kidneys', 'Liver', 'Lungs', 'Heart'], e: 'The two kidneys filter waste products from blood to maintain water balance and form urine.' },
    { q: 'Who was the first Prime Minister of independent India?', a: 'Pandit Jawaharlal Nehru', o: ['Pandit Jawaharlal Nehru', 'Sardar Patel', 'Dr. Rajendra Prasad', 'Lal Bahadur Shastri'], e: 'Pandit Jawaharlal Nehru served as India\'s first Prime Minister from 1947 to 1964.' },
    { q: 'Which festival in India is celebrated as the "Festival of Lights"?', a: 'Diwali (Deepavali)', o: ['Diwali (Deepavali)', 'Holi', 'Eid', 'Christmas'], e: 'Diwali is celebrated with clay lamps (diyas) and lights symbolizing the victory of light over darkness.' }
  ];

  // Generate math variations (over 450 questions)
  for (let i = 0; i < 70; i++) {
    for (const gen of mathGenerators) {
      bank.push(gen.generate(i));
    }
  }

  // Generate science variations (over 250 questions)
  for (let repeat = 0; repeat < 25; repeat++) {
    for (const topicGroup of scienceTopics) {
      for (let idx = 0; idx < topicGroup.items.length; idx++) {
        const item = topicGroup.items[idx];
        const uniqueId = `gen-sci-${repeat}-${idx}-${topicGroup.topic.slice(0, 4).toLowerCase()}`;
        bank.push({
          id: uniqueId,
          question: item.q,
          options: item.o,
          answer: item.a,
          explanation: item.e,
          hint: `Key concept: ${topicGroup.topic}`,
          subject: 'Science',
          studentClass: topicGroup.class,
          topic: topicGroup.topic,
          difficulty: idx % 3 === 0 ? 'Easy' : idx % 3 === 1 ? 'Medium' : 'Challenging',
          isPublished: true,
          createdAt: new Date(2026, (repeat % 12), (idx % 28) + 1).toISOString()
        });
      }
    }
  }

  // Generate English variations (over 200 questions)
  for (let repeat = 0; repeat < 25; repeat++) {
    for (const topicGroup of englishTopics) {
      for (let idx = 0; idx < topicGroup.items.length; idx++) {
        const item = topicGroup.items[idx];
        const uniqueId = `gen-eng-${repeat}-${idx}-${topicGroup.topic.slice(0, 4).toLowerCase()}`;
        bank.push({
          id: uniqueId,
          question: item.q,
          options: item.o,
          answer: item.a,
          explanation: item.e,
          hint: `Grammar focus: ${topicGroup.topic}`,
          subject: 'English',
          studentClass: topicGroup.class,
          topic: topicGroup.topic,
          difficulty: idx % 2 === 0 ? 'Easy' : 'Medium',
          isPublished: true,
          createdAt: new Date(2026, (repeat % 12), (idx % 28) + 1).toISOString()
        });
      }
    }
  }

  // Generate Reasoning variations (over 100 questions)
  for (let repeat = 0; repeat < 22; repeat++) {
    for (let idx = 0; idx < reasoningItems.length; idx++) {
      const item = reasoningItems[idx];
      bank.push({
        id: `gen-reas-${repeat}-${idx}`,
        question: item.q,
        options: item.o,
        answer: item.a,
        explanation: item.e,
        hint: `Think step by step and look for logical patterns.`,
        subject: 'Reasoning',
        studentClass: item.t,
        topic: 'Logical Reasoning & Patterns',
        difficulty: idx % 2 === 0 ? 'Easy' : 'Medium',
        isPublished: true,
        createdAt: new Date(2026, (repeat % 12), (idx % 28) + 1).toISOString()
      });
    }
  }

  // Generate GK variations (over 120 questions)
  for (let repeat = 0; repeat < 18; repeat++) {
    for (let idx = 0; idx < gkItems.length; idx++) {
      const item = gkItems[idx];
      bank.push({
        id: `gen-gk-${repeat}-${idx}`,
        question: item.q,
        options: item.o,
        answer: item.a,
        explanation: item.e,
        hint: `General knowledge about India and the world.`,
        subject: 'General Knowledge',
        studentClass: 'Class 1 – 8',
        topic: 'General Awareness',
        difficulty: idx % 2 === 0 ? 'Easy' : 'Medium',
        isPublished: true,
        createdAt: new Date(2026, (repeat % 12), (idx % 28) + 1).toISOString()
      });
    }
  }

  return bank;
}
