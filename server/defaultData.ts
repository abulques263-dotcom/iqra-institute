import {
  WebsiteSettings,
  ClassFeeItem,
  Teacher,
  DailyQuestion,
  NewsUpdate,
  Testimonial,
  GalleryItem,
  FAQItem,
  TrialRequest
} from '../src/types.js';

export const initialSettings: WebsiteSettings = {
  instituteName: 'IQRA INSTITUTE',
  tagline: 'Strong Foundations Today, Confident Futures Tomorrow.',
  phone: '8882257389',
  whatsapp: '7678365870',
  address: '25 Futa Road, Budh Vihar, Sector 63, Noida, Uttar Pradesh, Gali No. 23A, Near Gulshan-e-Tayyaba Mosque',
  announcement: 'Admissions Open for Nursery to Class 8! Join our 3-Day Free Trial Class today.',
  announcementActive: true,
  email: 'abulques263@gmail.com',
  timing: 'Morning & Evening Batches (Monday to Saturday)',
  heroBadge: 'Nursery to Class 8 • Foundation Learning Support',
  heroDescription: 'IQRA INSTITUTE focuses on developing children’s academic foundation, conceptual understanding, discipline, and useful daily study habits from an early age. We believe in understanding concepts rather than rote memorization.'
};

export const initialClasses: ClassFeeItem[] = [
  {
    id: 'cls-nursery-ukg',
    name: 'Nursery – UKG',
    gradeRange: 'Pre-Primary (Nursery, LKG, UKG)',
    monthlyFee: 350,
    description: 'Early childhood foundation focusing on phonics, letter formation, basic counting, motor skills and joyful learning habits.',
    features: [
      'Alphabet, Phonics & Sound recognition',
      'Number sense & Basic counting',
      'Pencil grip, coloring & motor development',
      'Friendly, patient and caring atmosphere',
      'Daily 1.5 hours interactive session'
    ],
    order: 1
  },
  {
    id: 'cls-1-4',
    name: 'Class 1 – 4',
    gradeRange: 'Primary School (Grades 1 to 4)',
    monthlyFee: 300,
    description: 'Strong foundation in core subjects — Arithmetic, Reading, Writing, Science concepts, and good study discipline.',
    features: [
      'Basic Mathematics (Addition, Subtraction, Multiplication, Division)',
      'English reading comprehension & handwriting',
      'Basic Science & Environmental understanding',
      'Daily homework check & practice worksheets',
      'Encouraging curiosity and self-confidence'
    ],
    isPopular: true,
    order: 2
  },
  {
    id: 'cls-5-6',
    name: 'Class 5 – 6',
    gradeRange: 'Upper Primary (Grades 5 & 6)',
    monthlyFee: 400,
    description: 'Transition to structured conceptual learning, problem-solving, English grammar, and systematic subject mastery.',
    features: [
      'Conceptual Mathematics & Word problems',
      'General Science (Physics, Chemistry, Biology basics)',
      'Social Studies & Map concepts',
      'Grammar, Vocabulary & Sentence construction',
      'Weekly concept tests & revision notes'
    ],
    order: 3
  },
  {
    id: 'cls-7-8',
    name: 'Class 7 – 8',
    gradeRange: 'Middle School (Grades 7 & 8)',
    monthlyFee: 600,
    description: 'Pre-secondary preparation to build deep fundamentals before high school academic pressure begins.',
    features: [
      'Advanced Mathematics (Algebra, Geometry, Arithmetic)',
      'In-depth Science with practical examples',
      'English Language skills & Creative writing',
      'Logical reasoning & Analytical thinking',
      'Individual doubt clearing & progress tracking'
    ],
    order: 4
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: 'teacher-abulques',
    name: 'Abulques',
    qualification: 'Graduation completed from University of Delhi (DU)',
    role: 'Faculty Member & Foundation Mentor',
    subjects: ['Mathematics', 'Science', 'Basic Concepts'],
    teachingPhilosophy: 'Focuses on simplifying difficult concepts so young students understand the logic rather than memorizing answers without comprehension.',
    order: 1
  },
  {
    id: 'teacher-inam',
    name: 'Inam',
    qualification: 'Graduation completed from University of Delhi (DU)',
    role: 'Faculty Member & Academic Guide',
    subjects: ['English', 'Reasoning', 'Foundation Studies'],
    teachingPhilosophy: 'Encourages consistent daily study discipline, clear communication, and building confidence in every child through regular practice.',
    order: 2
  }
];

export const initialDailyQuestions: DailyQuestion[] = [
  {
    id: 'dq-1',
    date: '2026-08-31',
    subject: 'Mathematics',
    studentClass: 'Class 5 – 6',
    question: 'A cyclist travels 45 kilometers in 3 hours at a constant speed. How many kilometers will the cyclist cover in 7 hours at the same speed?',
    options: ['90 km', '105 km', '115 km', '120 km'],
    answer: '105 km',
    explanation: 'Step 1: Calculate the speed per hour = 45 km ÷ 3 hours = 15 km/hour.\nStep 2: Distance covered in 7 hours = 15 km/hour × 7 hours = 105 km.',
    hint: 'First find the distance travelled in 1 single hour.',
    difficulty: 'Medium',
    isPublished: true,
    createdAt: '2026-08-31T06:00:00.000Z'
  },
  {
    id: 'dq-2',
    date: '2026-08-30',
    subject: 'Science',
    studentClass: 'Class 7 – 8',
    question: 'Which gas is absorbed by green plants during the process of photosynthesis to prepare their food?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    answer: 'Carbon Dioxide (CO₂)',
    explanation: 'During photosynthesis, green plants absorb carbon dioxide from the air and water from the soil in the presence of sunlight and chlorophyll to produce glucose (food) and release oxygen.',
    hint: 'It is the gas that animals and humans exhale.',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-08-30T06:00:00.000Z'
  },
  {
    id: 'dq-3',
    date: '2026-08-29',
    subject: 'English',
    studentClass: 'Class 1 – 4',
    question: 'Choose the correct opposite (Antonym) for the word: "BRAVE".',
    options: ['Strong', 'Cowardly / Timid', 'Wise', 'Clever'],
    answer: 'Cowardly / Timid',
    explanation: 'Brave means showing courage or ready to face danger. The exact opposite is cowardly or timid (fearful).',
    hint: 'Think of someone who is easily scared.',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-08-29T06:00:00.000Z'
  },
  {
    id: 'dq-4',
    date: '2026-08-28',
    subject: 'Reasoning',
    studentClass: 'Class 5 – 8',
    question: 'Complete the pattern: 3, 7, 15, 31, 63, ?',
    options: ['95', '120', '127', '135'],
    answer: '127',
    explanation: 'Each number is obtained by multiplying the previous number by 2 and adding 1: \n(3×2)+1 = 7, \n(7×2)+1 = 15, \n(15×2)+1 = 31, \n(31×2)+1 = 63, \n(63×2)+1 = 127.',
    hint: 'Double the previous number and add one.',
    difficulty: 'Challenging',
    isPublished: true,
    createdAt: '2026-08-28T06:00:00.000Z'
  },
  {
    id: 'dq-5',
    date: '2026-08-27',
    subject: 'General Knowledge',
    studentClass: 'Class 1 – 4',
    question: 'How many days are there in a Leap Year?',
    options: ['364 days', '365 days', '366 days', '367 days'],
    answer: '366 days',
    explanation: 'A normal year has 365 days, but a leap year occurs once every four years and has 366 days because February has 29 days instead of 28.',
    hint: 'It has one extra day in the month of February.',
    difficulty: 'Easy',
    isPublished: true,
    createdAt: '2026-08-27T06:00:00.000Z'
  }
];

export const initialNews: NewsUpdate[] = [
  {
    id: 'news-1',
    title: 'Admissions Open: 3-Day Free Trial Available for Nursery to Class 8',
    description: 'Parents can enroll their children for a complimentary 3-day trial class to experience the classroom atmosphere, teaching method, and personal attention before taking admission.',
    category: 'Admission',
    date: '2026-08-31',
    isPublished: true,
    isImportant: true
  },
  {
    id: 'news-2',
    title: 'Weekly Concept Revision & Practice Test Every Saturday',
    description: 'All batches will participate in our light weekly concept revision test this Saturday to reinforce what was taught during the week and identify topics needing extra attention.',
    category: 'Test Notice',
    date: '2026-08-28',
    isPublished: true,
    isImportant: false
  },
  {
    id: 'news-3',
    title: 'New Evening Batch Timings for Class 5 to Class 8',
    description: 'To accommodate school schedules, additional evening slots from 4:30 PM to 6:30 PM are now active. Contact us on WhatsApp to select your preferred time slot.',
    category: 'Timing',
    date: '2026-08-25',
    isPublished: true,
    isImportant: false
  },
  {
    id: 'news-4',
    title: 'Monthly Parent-Teacher Progress Discussion',
    description: 'We hold regular individual discussions with parents to review daily attendance, homework completion, and conceptual improvement.',
    category: 'Institute Activity',
    date: '2026-08-20',
    isPublished: true,
    isImportant: false
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    parentName: 'Mohammad Farooq',
    studentClass: 'Class 4',
    quote: 'Teachers explain concepts in a simple way and my child has become more regular with studies. He used to hesitate in mathematics, but now attempts questions happily.',
    rating: 5,
    isPublished: true
  },
  {
    id: 'test-2',
    parentName: 'Shabana Parveen',
    studentClass: 'Class 2',
    quote: 'The 3-day free trial allowed us to see how much personal attention the teachers give to every child. The monthly fee is very reasonable for our family budget.',
    rating: 5,
    isPublished: true
  },
  {
    id: 'test-3',
    parentName: 'Rashid Khan',
    studentClass: 'Class 7',
    quote: 'I like that the focus is on understanding the basics rather than just memorizing answers for exams. My daughter now enjoys solving the daily questions.',
    rating: 5,
    isPublished: true
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Focused Classroom Learning',
    category: 'Classroom',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    caption: 'Students engaged in interactive conceptual problem solving.',
    order: 1
  },
  {
    id: 'gal-2',
    title: 'Teacher Mentorship & Guidance',
    category: 'Learning Environment',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    caption: 'One-on-one attention ensuring every child understands the core concept.',
    order: 2
  },
  {
    id: 'gal-3',
    title: 'Reading & English Comprehension',
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    caption: 'Encouraging independent reading and vocabulary building from early years.',
    order: 3
  },
  {
    id: 'gal-4',
    title: 'Mathematics Practice & Worksheets',
    category: 'Activities',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    caption: 'Step-by-step arithmetic and geometry practice.',
    order: 4
  },
  {
    id: 'gal-5',
    title: 'Young Learners Nursery to Class 2',
    category: 'Students',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
    caption: 'Building love for learning and regular discipline.',
    order: 5
  },
  {
    id: 'gal-6',
    title: 'Group Problem Solving',
    category: 'Learning Environment',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    caption: 'Collaborative discussion and peer motivation.',
    order: 6
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What classes does IQRA INSTITUTE teach?',
    answer: 'We provide structured learning support for young children from Nursery/UKG through Class 8, focusing on basic concepts, subject clarity, and regular study habits.',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'What are the monthly fees?',
    answer: 'Our monthly fees are designed to be affordable for local families: Nursery – UKG is ₹350/month, Class 1 – 4 is ₹300/month, Class 5 – 6 is ₹400/month, and Class 7 – 8 is ₹600/month. No heavy upfront admission charges.',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'Is there a trial class available before admission?',
    answer: 'Yes! We offer a 3-Day Free Trial Class ("Try Before You Decide"). Your child can attend classes for 3 days to experience our classroom environment and teaching approach before you decide.',
    order: 3
  },
  {
    id: 'faq-4',
    question: 'How can I contact the institute or visit?',
    answer: 'You can call us directly at 8882257389 or message us on WhatsApp at 7678365870. You can also submit the trial request form on this website and our team will get in touch with you.',
    order: 4
  },
  {
    id: 'faq-5',
    question: 'Are the fees charged monthly or yearly?',
    answer: 'All our fees are charged on a simple monthly basis with no long-term lock-in or burden on parents.',
    order: 5
  },
  {
    id: 'faq-6',
    question: 'How do teachers communicate with parents about progress?',
    answer: 'We hold regular monthly discussions with parents and maintain direct communication regarding attendance, homework regularity, and areas where the child is improving.',
    order: 6
  }
];

export const initialTrialRequests: TrialRequest[] = [
  {
    id: 'trial-demo-1',
    studentName: 'Zayd Ahmad',
    parentName: 'Tariq Ahmad',
    studentClass: 'Class 3',
    age: '8',
    phone: '9876543210',
    whatsapp: '9876543210',
    preferredTime: 'Evening (4:30 PM - 6:00 PM)',
    message: 'Looking for support in basic mathematics and English reading.',
    status: 'new',
    createdAt: '2026-08-30T10:15:00.000Z',
    notes: 'Called parent; trial scheduled for Wednesday.'
  }
];

export const initialParents: any[] = [
  {
    id: 'parent-1',
    parentName: 'Tariq Ahmad',
    studentName: 'Zayd Ahmad',
    studentClass: 'Class 1 – 4',
    email: 'abulques263@gmail.com',
    phone: '9876543210',
    whatsapp: '9876543210',
    batchTiming: 'Evening Batch (4:00 PM - 5:30 PM)',
    status: 'active',
    notes: 'Focus on Maths tables & reading',
    createdAt: '2026-08-01T09:00:00.000Z',
    lastNotifiedAt: '2026-08-25T11:00:00.000Z'
  },
  {
    id: 'parent-2',
    parentName: 'Mohd Rashid',
    studentName: 'Ayaan Rashid',
    studentClass: 'Class 5 – 6',
    email: 'rashid.m92@example.com',
    phone: '9812345678',
    whatsapp: '9812345678',
    batchTiming: 'Evening Batch (5:30 PM - 7:00 PM)',
    status: 'active',
    notes: 'Science conceptual understanding',
    createdAt: '2026-08-05T10:30:00.000Z',
    lastNotifiedAt: '2026-08-25T11:00:00.000Z'
  },
  {
    id: 'parent-3',
    parentName: 'Farhana Parveen',
    studentName: 'Aliza Khan',
    studentClass: 'Class 7 – 8',
    email: 'farhana.parveen@example.com',
    phone: '9890123456',
    whatsapp: '9890123456',
    batchTiming: 'Evening Batch (5:30 PM - 7:00 PM)',
    status: 'active',
    notes: 'Algebra & Science foundation',
    createdAt: '2026-08-10T14:00:00.000Z',
    lastNotifiedAt: '2026-08-25T11:00:00.000Z'
  },
  {
    id: 'parent-4',
    parentName: 'Shahid Ali',
    studentName: 'Hamza Shahid',
    studentClass: 'Nursery – UKG',
    email: 'shahid.ali.delhi@example.com',
    phone: '9765432109',
    whatsapp: '9765432109',
    batchTiming: 'Morning Batch (9:00 AM - 10:30 AM)',
    status: 'active',
    notes: 'Phonics & basic writing practice',
    createdAt: '2026-08-15T11:20:00.000Z',
    lastNotifiedAt: '2026-08-25T11:00:00.000Z'
  },
  {
    id: 'parent-5',
    parentName: 'Imran Ansari',
    studentName: 'Sana Ansari',
    studentClass: 'Class 1 – 4',
    email: 'imran.ansari78@example.com',
    phone: '9654321098',
    whatsapp: '9654321098',
    batchTiming: 'Evening Batch (4:00 PM - 5:30 PM)',
    status: 'active',
    notes: 'English comprehension & spelling',
    createdAt: '2026-08-18T16:45:00.000Z'
  }
];

export const initialNotificationTemplates: any[] = [
  {
    id: 'tmpl-holiday-1',
    name: 'Holiday Announcement',
    category: 'Holiday',
    subject: 'Holiday Notice: Institute Closure on {{date}}',
    body: `Dear {{parent_name}},\n\nThis is to inform you that IQRA INSTITUTE will remain closed on {{date}} on account of upcoming festival/scheduled break.\n\nRegular classes for {{student_name}} ({{student_class}}) will resume as per standard schedule from the following working day.\n\nStudents are encouraged to complete their revision worksheets during the break.\n\nWarm regards,\nIQRA INSTITUTE\nPhone: {{phone}} | WhatsApp: {{whatsapp}}`,
    isDefault: true
  },
  {
    id: 'tmpl-test-1',
    name: 'Weekly Concept Test Schedule',
    category: 'Test Schedule',
    subject: 'Weekly Assessment Schedule for {{student_class}} - IQRA INSTITUTE',
    body: `Dear {{parent_name}},\n\nPlease be informed that the Weekly Concept Assessment for {{student_class}} will take place this Saturday during regular batch timing.\n\nStudent: {{student_name}}\nSubjects Covered: Mathematics & Science fundamental topics covered this week.\n\nKindly ensure {{student_name}} revises the formula sheets and arrives on time with their notebook.\n\nWarm regards,\nAcademic Mentorship Team\nIQRA INSTITUTE`,
    isDefault: true
  },
  {
    id: 'tmpl-progress-1',
    name: 'Monthly Progress & Parent-Teacher Update',
    category: 'Progress Update',
    subject: 'Academic Progress Update for {{student_name}} ({{student_class}})',
    body: `Dear {{parent_name}},\n\nWe would like to share an update regarding {{student_name}}'s performance at IQRA INSTITUTE.\n\nOver the past month, we have observed positive engagement in daily classroom practice, homework submission, and concept understanding.\n\nIf you would like to discuss specific areas of improvement or test scores, please feel free to visit the institute between 6:00 PM - 7:00 PM or connect with our faculty mentors.\n\nWarm regards,\nFaculty Mentors (Abulques & Inam)\nIQRA INSTITUTE`,
    isDefault: true
  },
  {
    id: 'tmpl-fee-1',
    name: 'Monthly Fee Reminder Notice',
    category: 'Fee Notice',
    subject: 'Monthly Learning Support Fee Notice - IQRA INSTITUTE',
    body: `Dear {{parent_name}},\n\nThis is a gentle reminder regarding the monthly fee for {{student_name}} ({{student_class}}) for the current month.\n\nAs part of our commitment to affordable and accessible education, our monthly fee remains structured without heavy burdens.\n\nKindly submit the fee during your next visit or via direct transfer.\n\nThank you for your continuous cooperation and support.\n\nWarm regards,\nAdministration Desk\nIQRA INSTITUTE`,
    isDefault: true
  },
  {
    id: 'tmpl-general-1',
    name: 'General Institute Announcement',
    category: 'General Announcement',
    subject: 'Important Announcement from IQRA INSTITUTE',
    body: `Dear {{parent_name}},\n\nWe would like to share an important update regarding our foundation learning sessions.\n\n[Insert Announcement Details Here]\n\nPlease let us know if you have any questions or require additional assistance for {{student_name}}.\n\nWarm regards,\nIQRA INSTITUTE\nPhone: {{phone}}`,
    isDefault: true
  }
];

export const initialNotificationLogs: any[] = [
  {
    id: 'notif-demo-1',
    subject: 'Holiday Notice: Institute Closed on Independence Day',
    category: 'Holiday',
    messageBody: 'Dear Parents, Please note that IQRA INSTITUTE will remain closed on 15th August. Classes resume regular schedule from 16th August.',
    targetGroup: 'all',
    recipientCount: 5,
    recipients: [
      {
        parentName: 'Tariq Ahmad',
        studentName: 'Zayd Ahmad',
        studentClass: 'Class 1 – 4',
        email: 'abulques263@gmail.com',
        status: 'sent',
        deliveredAt: '2026-08-14T10:00:00.000Z'
      },
      {
        parentName: 'Mohd Rashid',
        studentName: 'Ayaan Rashid',
        studentClass: 'Class 5 – 6',
        email: 'rashid.m92@example.com',
        status: 'sent',
        deliveredAt: '2026-08-14T10:00:00.000Z'
      }
    ],
    sentAt: '2026-08-14T10:00:00.000Z',
    sentBy: 'Administrator',
    emailMode: 'smtp',
    status: 'success',
    smtpSummary: 'Dispatched to 5 recipients via SMTP'
  }
];

