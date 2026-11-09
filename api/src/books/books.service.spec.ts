import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.book.findMany();
  }

  findOne(id: number) {
    return this.prisma.book.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.book.delete({ where: { id } });
  }

  // temporary: we'll fill these in once the DTO has real fields
  create(createBookDto: CreateBookDto) {
    return 'create not implemented yet';
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return 'update not implemented yet';
  }
}