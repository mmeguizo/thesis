import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import * as moment from 'moment';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  async submitAnswer(userId: string, dto: SubmitAnswerDto) {
    const { questionId, subjectId, answer, startTime } = dto;
  
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found.');
  
    const isCorrect = question.answer.toLowerCase() === answer.toLowerCase();
  
    // ✅ Calculate time spent in minutes
    const timeSpent = Math.floor((new Date().getTime() - new Date(startTime).getTime()) / 1000 / 60); // time in minutes
  
    let starRating = 0;
    if (isCorrect) {
      if (timeSpent <= 1) starRating = 3;  // For time spent <= 1 minute
      else if (timeSpent <= 2) starRating = 2;  // For time spent <= 2 minutes
      else starRating = 1;  // For time spent greater than 2 minutes
    }
  
    await this.prisma.userQuestion.create({
      data: { userId, questionId, subjectId, starRating, timeSpent, isCorrect },
    });
  
    if (question.lessonId) {
      // ✅ Check if UserLesson exists
      const userLesson = await this.prisma.userLesson.findFirst({
        where: { userId, lessonId: question.lessonId },
      });
  
      if (userLesson) {
        // ✅ If it exists, update the total stars
        await this.prisma.userLesson.update({
          where: { id: userLesson.id },
          data: { totalStars: { increment: starRating } },
        });
      } else {
        // ✅ If it doesn't exist, create a new UserLesson record
        await this.prisma.userLesson.create({
          data: {
            userId,
            lessonId: question.lessonId,
            totalStars: starRating,
          },
        });
      }
    }
  
    return { isCorrect, starRating };
  }
  

  async getTotalStarsForSpecificQuestions( userId: string,subjectId: string) {
    console.log('SubjectID:', subjectId);
    console.log('UserID:', userId);
  
    const userQuestions = await this.prisma.userQuestion.findMany({
      where: {
        subjectId: subjectId,
        userId: userId,
      },
      include: {
        question: {
          include: {
            lesson: true,
          },
        },
      },
    });
  
    console.log('Found user questions:', userQuestions.length);
  
    const grouped = {
      Easy: [],
      Average: [],
      Difficult: [],
    };
  
    for (const uq of userQuestions) {
      const difficulty = uq.question.difficulty?.toLowerCase();
      const entry = {
        questionId: uq.questionId,
        question: uq.question.question,
        lessonId: uq.question.lessonId,
        lessonTitle: uq.question.lesson.title,
        difficulty: uq.question.difficulty,
        star: uq.starRating ?? 0,
        isCorrect: uq.isCorrect,
      };
  
      if (difficulty === 'easy') grouped.Easy.push(entry);
      else if (difficulty === 'average') grouped.Average.push(entry);
      else if (difficulty === 'difficult') grouped.Difficult.push(entry);
    }
  
    return {
      success: true,
      status: 200,
      data: grouped,
    };
  }
  

  // async submitAnswer(userId: string, dto: SubmitAnswerDto) {
  //   const { questionId, subjectId, answer, startTime } = dto;
  
  //   const question = await this.prisma.question.findUnique({ where: { id: questionId } });
  //   if (!question) throw new NotFoundException('Question not found.');
  
  //   const isCorrect = question.answer.toLowerCase() === answer.toLowerCase();
  
  //   // ✅ Calculate time spent in minutes
  //   const timeSpent = Math.floor((new Date().getTime() - new Date(startTime).getTime()) / 1000 / 60);
  
  //   let starRating = 0;
  //   if (isCorrect) {
  //     if (timeSpent <= 3) starRating = 3;
  //     else if (timeSpent <= 5) starRating = 2;
  //     else starRating = 1;
  //   }
  
  //   await this.prisma.userQuestion.create({
  //     data: { userId, questionId, subjectId, starRating, timeSpent, isCorrect },
  //   });
  
  //   if (question.lessonId) {
  //     // ✅ Check if UserLesson exists
  //     const userLesson = await this.prisma.userLesson.findFirst({
  //       where: { userId, lessonId: question.lessonId },
  //     });
  
  //     if (userLesson) {
  //       // ✅ If it exists, update the total stars
  //       await this.prisma.userLesson.update({
  //         where: { id: userLesson.id },
  //         data: { totalStars: { increment: starRating } },
  //       });
  //     } else {
  //       // ✅ If it doesn't exist, create a new UserLesson record
  //       await this.prisma.userLesson.create({
  //         data: {
  //           userId,
  //           lessonId: question.lessonId,
  //           totalStars: starRating,
  //         },
  //       });
  //     }
  //   }
  
  //   return { isCorrect, starRating };
  // }

  // ... existing code ...
  // async getTotalStarsForSpecificQuestions(userId :string, subjectId : string) {
  //   const userQuestions = await this.prisma.userQuestion.findMany({
  //     where: {
  //       userId,
  //       subjectId: subjectId, // Filter by question IDs
  //     },
  //     select: {
  //       starRating: true,
  //       question : {
  //         select : {
  //           lesson : {
  //             select : {
  //               id : true,
  //               title: true,
  //               subject : {
  //                 select : {
  //                   id : true,
  //                   name : true
  //                 }
  //               }
  //             }
  //           },
  //           id : true,
  //           question : true,
  //           difficulty : true,
  //           questionLevel : true,
  //         }
          
  //       }
  //     },
      
  //   });

  //   const totalStars = userQuestions.reduce((sum, userQuestion) => {
  //     return sum + (userQuestion.starRating || 0);
  //   }, 0);

  //   return {
  //     data : {
  //         totalStarsAchieved: totalStars,
  //         userData : userQuestions
  //     },
  //     success: true,
  //     status : 200
  //   };
  // }
  // ... existing code ...
// async getTotalStarsForSpecificQuestions(userId: string, subjectId: string): Promise<any> {

//   const lesson = await this.prisma.lesson.findFirst({
//     where: {
//       subjectId: subjectId,
//     },
//   });
  
//   if (!lesson) {
//     throw new Error("Lesson not found");
//   }
  
//   const lessonId = lesson.id; // Extract the lessonId from the lesson object
  
//   const questions = await this.prisma.question.findMany({
//     where: {
//       lessonId: lessonId, // Now passing the lessonId as a string
//     },
//   });


//   const userQuestions = await this.prisma.userQuestion.findMany({
//     where: {
//       userId,
//       subjectId: subjectId, // Filter by subject ID
//     },
//     select: {
//       starRating: true,
//       question: {
//         select: {
//           lesson: {
//             select: {
//               id: true,
//               title: true,
//               subject: {
//                 select: {
//                   id: true,
//                   name: true,
//                 },
//               },
//             },
//           },
//           id: true,
//           question: true,
//           difficulty: true,
//           questionLevel: true,
//         },
//       },
//     },
//   });
  

//   // Initialize the result object
//   // const result = {
//   //   Easy: [],
//   //   Average: [],
//   //   Difficult: [],
//   // };

//   // Populate the result object based on difficulty
//   // userQuestions.forEach((userQuestion) => {
//   //   const { starRating, question } = userQuestion;
//   //   const { id: questionId, question: questionText, difficulty, questionLevel } = question;

//   //   // Convert difficulty to title case
//   //   const formattedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

//   //   // Check if the difficulty is valid
//   //   if (result[formattedDifficulty]) {
//   //     // Push the formatted data into the corresponding difficulty array
//   //     result[formattedDifficulty].push({
//   //       questionId,
//   //       question: questionText,
//   //       lessonId: question.lesson.id,
//   //       lessonTitle: question.lesson.title,
//   //       subject: {
//   //         id: question.lesson.subject.id,
//   //         name: question.lesson.subject.name,
//   //       },
//   //       level: questionLevel,
//   //       star: starRating,
//   //     });
//   //   } else {
//   //     console.warn(`Unrecognized difficulty level: ${formattedDifficulty} for question ID: ${questionId}`);
//   //   }
//   // });

//   return {
//     // data: result,
//     success: true,
//     status: 200,
//     originalData : userQuestions
//   };
// }
// ... existing code ...
// ... existing code ...
  

}
