import { 
  Controller, 
  Post, 
  Delete, 
  Param, 
  UseInterceptors, 
  UploadedFile, 
  ParseFilePipe, 
  MaxFileSizeValidator,
  NotFoundException
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Upload an image file',
    description: 'Upload an image (JPEG, PNG, or GIF) with maximum size of 2MB'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Image uploaded successfully',
    schema: {
      example: {
        message: 'File uploaded successfully',
        fileUrl: 'http://localhost:3000/uploads/1234567890-123456.png'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - File too large (>2MB) or invalid file type'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file (max 2MB, formats: jpg, png, gif)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  }))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    return this.uploadService.uploadFile(file);
  }

  @Delete(':filename')
  @ApiOperation({ 
    summary: 'Delete an uploaded image',
    description: 'Delete an image by filename. Must include file extension (e.g., image.png)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'File deleted successfully',
    schema: {
      example: {
        message: 'File deleted successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'File not found - Check if filename includes extension (.jpg, .png, .gif)'
  })
  async deleteFile(@Param('filename') filename: string) {
    return this.uploadService.deleteFile(filename);
  }
}
