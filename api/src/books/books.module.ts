import { Module } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { BooksController } from './books.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [BooksController],
  imports: [AuthModule],
  providers: [BooksService],
})
export class BooksModule {}
