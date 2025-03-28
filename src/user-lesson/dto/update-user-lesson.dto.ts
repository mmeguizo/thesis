import { PartialType } from '@nestjs/swagger';
import { CreateUserLessonDto } from './create-user-lesson.dto';

export class UpdateUserLessonDto extends PartialType(CreateUserLessonDto) {}
