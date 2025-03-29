// // import { PrismaClient } from '@prisma/client';

// // const prisma = new PrismaClient();

// // async function main() {
// //   await prisma.badge.createMany({
// //     data: [
// //       { name: 'Bronze', description: 'Earn 5+ stars', minStars: 5 },
// //       { name: 'Silver', description: 'Earn 10+ stars', minStars: 10 },
// //       { name: 'Gold', description: 'Earn 15+ stars', minStars: 15 },
// //     ],
// //   });

// //   console.log('Badges seeded successfully!');
// // }

// // main()
// //   .catch((e) => console.error(e))
// //   .finally(() => prisma.$disconnect());

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌱 Seeding database...');

//   // 🌟 Create Users
//   const user1 = await prisma.user.create({
//     data: {
//       username: 'student1',
//       password: 'hashedpassword1',
//       firstName: 'John',
//       lastName: 'Doe',
//       role: 'STUDENT',
//     },
//   });

//   const user2 = await prisma.user.create({
//     data: {
//       username: 'student2',
//       password: 'hashedpassword2',
//       firstName: 'Jane',
//       lastName: 'Doe',
//       role: 'STUDENT',
//     },
//   });

//   console.log('✅ Users created');

//   // 📚 Create Lessons
//   const mathLesson = await prisma.lesson.create({
//     data: {
//       title: 'Math Level 1',
//       subject: 'Math',
//       level: 1,
//     },
//   });

//   const scienceLesson = await prisma.lesson.create({
//     data: {
//       title: 'Science Level 1',
//       subject: 'Science',
//       level: 1,
//     },
//   });

//   console.log('✅ Lessons created');

//   // ❓ Create Questions
//   const question1 = await prisma.question.create({
//     data: {
//       question: 'What is 2 + 2?',
//       answer: '4',
//       hint: 'Think about basic addition',
//       tutorialLink: 'https://example.com/math-tutorial',
//       gradeLevel: 1,
//       subject: 'Math',
//       lessonId: mathLesson.id,
//     },
//   });

//   const question2 = await prisma.question.create({
//     data: {
//       question: 'What is H2O commonly known as?',
//       answer: 'Water',
//       hint: 'It’s essential for life!',
//       tutorialLink: 'https://example.com/science-tutorial',
//       gradeLevel: 1,
//       subject: 'Science',
//       lessonId: scienceLesson.id,
//     },
//   });

//   console.log('✅ Questions created');

//   // ⭐ Create User Question Attempts
//   await prisma.userQuestion.createMany({
//     data: [
//       {
//         userId: user1.id,
//         questionId: question1.id,
//         starRating: 3,
//         isCorrect: true,
//       },
//       {
//         userId: user2.id,
//         questionId: question2.id,
//         starRating: 2,
//         isCorrect: false,
//       },
//     ],
//   });

//   console.log('✅ User Questions created');

//   // 🏆 Create Badges
//   const bronzeBadge = await prisma.badge.create({
//     data: {
//       name: 'Bronze',
//       description: 'Earn 5+ stars',
//       minStars: 5,
//     },
//   });

//   const silverBadge = await prisma.badge.create({
//     data: {
//       name: 'Silver',
//       description: 'Earn 10+ stars',
//       minStars: 10,
//     },
//   });

//   const goldBadge = await prisma.badge.create({
//     data: {
//       name: 'Gold',
//       description: 'Earn 15+ stars',
//       minStars: 15,
//     },
//   });

//   console.log('✅ Badges created');

//   // 🏅 Assign User Badges
//   await prisma.userBadge.createMany({
//     data: [
//       { userId: user1.id, badgeId: bronzeBadge.id },
//       { userId: user2.id, badgeId: silverBadge.id },
//     ],
//   });

//   console.log('✅ User Badges assigned');

//   console.log('🎉 Seeding completed successfully!');
// }

// // Run the script
// main()
//   .catch((error) => {
//     console.error('Error seeding database:', error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
