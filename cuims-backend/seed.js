const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Internship = require('./models/Internship');
const Application = require('./models/Application');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Wipe existing data
  await User.deleteMany();
  await Internship.deleteMany();
  await Application.deleteMany();
  console.log('Cleared existing data');

  // Create admin
  const admin = await User.create({
    name: 'CUIMS Admin',
    email: 'admin@cavendish.ac.ug',
    password: 'Admin@1234',
    role: 'admin',
    isApproved: true,
  });

  // Create supervisors
  const supervisor1 = await User.create({
    name: 'Dr. Sarah Nakato',
    email: 'sarah.nakato@techcorp.ug',
    password: 'Super@1234',
    role: 'supervisor',
    organization: 'TechCorp Uganda',
    jobTitle: 'Head of Engineering',
    phone: '+256700000001',
    isApproved: true,
  });

  const supervisor2 = await User.create({
    name: 'Mr. James Ochieng',
    email: 'james.ochieng@fintech.ug',
    password: 'Super@1234',
    role: 'supervisor',
    organization: 'FinTech Solutions Ltd',
    jobTitle: 'Software Manager',
    phone: '+256700000002',
    isApproved: true,
  });

  // Pending supervisor (not approved yet)
  await User.create({
    name: 'Ms. Grace Atim',
    email: 'grace.atim@startup.ug',
    password: 'Super@1234',
    role: 'supervisor',
    organization: 'GreenStartup Uganda',
    jobTitle: 'CTO',
    phone: '+256700000003',
    isApproved: false,
  });

  // Create students
  const student1 = await User.create({
    name: 'Allan Mukasa',
    email: 'allan.mukasa@students.cavendish.ac.ug',
    password: 'Student@1234',
    role: 'student',
    studentId: 'CU2021/BSC/001',
    course: 'BSc Computer Science',
    yearOfStudy: 3,
    isApproved: true,
  });

  const student2 = await User.create({
    name: 'Brenda Namuli',
    email: 'brenda.namuli@students.cavendish.ac.ug',
    password: 'Student@1234',
    role: 'student',
    studentId: 'CU2021/BIT/042',
    course: 'BSc Information Technology',
    yearOfStudy: 3,
    isApproved: true,
  });

  await User.create({
    name: 'Charles Wasswa',
    email: 'charles.wasswa@students.cavendish.ac.ug',
    password: 'Student@1234',
    role: 'student',
    studentId: 'CU2022/BSC/018',
    course: 'BSc Computer Science',
    yearOfStudy: 2,
    isApproved: true,
  });

  // Create internships
  const internship1 = await Internship.create({
    title: 'Software Engineering Intern',
    description: 'Work on real-world web applications using React and Node.js. You will collaborate with senior engineers on product features, write clean code, and participate in code reviews.',
    company: 'TechCorp Uganda',
    location: 'Kampala, Uganda',
    type: 'hybrid',
    duration: '3 months',
    startDate: new Date('2025-06-01'),
    applicationDeadline: new Date('2025-05-15'),
    slots: 3,
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    requirements: 'Year 3 or 4 CS/IT students. Basic knowledge of web technologies.',
    benefits: 'Mentorship, reference letter, possible employment after graduation.',
    stipend: 'UGX 300,000/month',
    status: 'open',
    createdBy: supervisor1._id,
  });

  const internship2 = await Internship.create({
    title: 'Data Analytics Intern',
    description: 'Support our data team in building dashboards, running SQL queries, and generating business insights from large datasets.',
    company: 'FinTech Solutions Ltd',
    location: 'Kampala, Uganda',
    type: 'on-site',
    duration: '6 weeks',
    startDate: new Date('2025-07-01'),
    applicationDeadline: new Date('2025-06-01'),
    slots: 2,
    skills: ['Python', 'SQL', 'Excel', 'Power BI'],
    requirements: 'Students with knowledge of data analysis tools.',
    benefits: 'Certificate of completion, networking opportunities.',
    stipend: 'UGX 200,000/month',
    status: 'open',
    createdBy: supervisor2._id,
  });

  await Internship.create({
    title: 'UI/UX Design Intern',
    description: 'Join our design team to create intuitive and beautiful user interfaces. You will use Figma to design mockups and prototype interactions.',
    company: 'TechCorp Uganda',
    location: 'Remote',
    type: 'remote',
    duration: '2 months',
    startDate: new Date('2025-08-01'),
    applicationDeadline: new Date('2025-07-01'),
    slots: 1,
    skills: ['Figma', 'UI/UX', 'Adobe XD', 'Prototyping'],
    requirements: 'Portfolio required. Design background preferred.',
    benefits: 'Remote work experience, portfolio-worthy project.',
    stipend: 'Unpaid',
    status: 'open',
    createdBy: supervisor1._id,
  });

  // Create applications
  await Application.create({
    student: student1._id,
    internship: internship1._id,
    coverLetter: 'I am a passionate CS student eager to apply my React and Node.js skills in a professional environment. I have built several full-stack projects and am ready to contribute to TechCorp.',
    status: 'accepted',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-08-31'),
  });

  await Application.create({
    student: student2._id,
    internship: internship1._id,
    coverLetter: 'As a 3rd year IT student with strong JavaScript skills, I believe I would be an excellent fit for this internship. I am highly motivated and eager to learn.',
    status: 'pending',
  });

  await Application.create({
    student: student2._id,
    internship: internship2._id,
    coverLetter: 'I have experience with SQL and Python from my coursework and personal projects. I am excited about data analytics and would love the opportunity to grow at FinTech Solutions.',
    status: 'reviewing',
  });

  console.log('\n✅ Database seeded successfully!\n');
  console.log('--- Login credentials ---');
  console.log('Admin:      admin@cavendish.ac.ug       / Admin@1234');
  console.log('Supervisor: sarah.nakato@techcorp.ug    / Super@1234');
  console.log('Supervisor: james.ochieng@fintech.ug   / Super@1234');
  console.log('Student:    allan.mukasa@students...    / Student@1234');
  console.log('Student:    brenda.namuli@students...   / Student@1234');

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});