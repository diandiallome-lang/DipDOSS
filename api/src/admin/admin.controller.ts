import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('content')
  getAllContent() {
    return this.adminService.getAllContent();
  }

  @Post('content')
  createContent(@Body() data: any) {
    return this.adminService.createContent(data);
  }

  @Put('content/:id')
  updateContent(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateContent(id, data);
  }

  @Delete('content/:id')
  deleteContent(@Param('id') id: string) {
    return this.adminService.deleteContent(id);
  }

  @Post('upload/:type')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const type = req.params.type;
        let dest = './uploads';
        if (type === 'video') dest += '/videos';
        else if (type === 'pdf') dest += '/pdfs';
        else if (type === 'thumbnail') dest += '/thumbnails';
        cb(null, dest);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  uploadFile(@Param('type') type: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu');
    }
    // Return the public URL
    // In production, this should use the actual domain
    const host = process.env.UPLOAD_HOST || 'http://localhost:3001';
    const subPath = type === 'video' ? 'videos' : type === 'pdf' ? 'pdfs' : 'thumbnails';
    const url = `${host}/uploads/${subPath}/${file.filename}`;
    return { url };
  }
}
