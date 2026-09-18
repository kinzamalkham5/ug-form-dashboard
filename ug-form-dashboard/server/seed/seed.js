require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Course = require('../models/Course');

const PROGRAM = 'BS Computer Science';

// NOTE: This is demo/seed course data for development purposes only.
// It does NOT represent the official University of Faisalabad curriculum.
const demoCourses = [
  { courseCode: 'CS-101', courseName: 'Programming Fundamentals', creditHours: 3, semester: 1 },
  { courseCode: 'CS-102', courseName: 'Object Oriented Programming', creditHours: 3, semester: 1 },
  { courseCode: 'MATH-101', courseName: 'Calculus I', creditHours: 3, semester: 1 },
  { courseCode: 'ENG-101', courseName: 'Functional English', creditHours: 3, semester: 1 },

  { courseCode: 'CS-201', courseName: 'Data Structures & Algorithms', creditHours: 3, semester: 2 },
  { courseCode: 'CS-202', courseName: 'Database Systems', creditHours: 3, semester: 2 },
  { courseCode: 'MATH-201', courseName: 'Calculus II', creditHours: 3, semester: 2 },
  { courseCode: 'STAT-201', courseName: 'Probability & Statistics', creditHours: 3, semester: 2 },

  { courseCode: 'CS-301', courseName: 'Operating Systems', creditHours: 3, semester: 3 },
  { courseCode: 'CS-302', courseName: 'Computer Networks', creditHours: 3, semester: 3 },
  { courseCode: 'CS-303', courseName: 'Software Engineering', creditHours: 3, semester: 3 },
  { courseCode: 'MATH-301', courseName: 'Discrete Mathematics', creditHours: 3, semester: 3 },

  { courseCode: 'CS-401', courseName: 'Web Technologies', creditHours: 3, semester: 4 },
  { courseCode: 'CS-402', courseName: 'Artificial Intelligence', creditHours: 3, semester: 4 },
  { courseCode: 'CS-403', courseName: 'Theory of Automata', creditHours: 3, semester: 4 },
  { courseCode: 'CS-404', courseName: 'Computer Architecture', creditHours: 3, semester: 4 },

    // Semester 5
  { courseCode: 'CS-501', courseName: 'Advanced Database Systems', creditHours: 3, semester: 5 },
  { courseCode: 'CS-502', courseName: 'Web Engineering', creditHours: 3, semester: 5 },
  { courseCode: 'CS-503', courseName: 'Information Security', creditHours: 3, semester: 5 },
  { courseCode: 'CS-504', courseName: 'Human Computer Interaction', creditHours: 3, semester: 5 },

  // Semester 6
  { courseCode: 'CS-601', courseName: 'Artificial Intelligence', creditHours: 3, semester: 6 },
  { courseCode: 'CS-602', courseName: 'Machine Learning', creditHours: 3, semester: 6 },
  { courseCode: 'CS-603', courseName: 'Mobile Application Development', creditHours: 3, semester: 6 },
  { courseCode: 'CS-604', courseName: 'Software Project Management', creditHours: 3, semester: 6 },

  // Semester 7
  { courseCode: 'CS-701', courseName: 'Cloud Computing', creditHours: 3, semester: 7 },
  { courseCode: 'CS-702', courseName: 'Computer Vision', creditHours: 3, semester: 7 },
  { courseCode: 'CS-703', courseName: 'Distributed Systems', creditHours: 3, semester: 7 },
  { courseCode: 'CS-704', courseName: 'Final Year Project I', creditHours: 3, semester: 7 },

  // Semester 8
  { courseCode: 'CS-801', courseName: 'Deep Learning', creditHours: 3, semester: 8 },
  { courseCode: 'CS-802', courseName: 'Natural Language Processing', creditHours: 3, semester: 8 },
  { courseCode: 'CS-803', courseName: 'Professional Practices', creditHours: 3, semester: 8 },
  { courseCode: 'CS-804', courseName: 'Final Year Project II', creditHours: 3, semester: 8 },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding.');

    // 1 admin account
    const adminEmail = 'admin@university.edu';
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({ name: 'System Admin', email: adminEmail, password: 'Admin@123' });
      console.log(`Admin created -> email: ${adminEmail} / password: Admin@123`);
    } else {
      console.log('Admin already exists, skipping.');
    }

    // Sample demo courses
    for (const c of demoCourses) {
      await Course.updateOne(
        { courseCode: c.courseCode, program: PROGRAM, semester: c.semester },
        { $set: { ...c, program: PROGRAM, isDemoData: true } },
        { upsert: true }
      );
    }
    console.log(`Seeded ${demoCourses.length} demo courses for ${PROGRAM}.`);

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

run();
