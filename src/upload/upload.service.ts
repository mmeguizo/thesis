import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File) {
    const fileUrl = `${process.env.APP_URL}/uploads/${file.filename}`;
    return {
      message: 'File uploaded successfully',
      fileUrl,
    };
  }

  async deleteFile(filename: string) {
    const filepath = path.join(process.cwd(), 'uploads', filename);
    console.log('Attempting to delete file:', filepath);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return { message: 'File deleted successfully' };
    }
    
    throw new NotFoundException(`File not found at path: ${filepath}`);
  }
}
