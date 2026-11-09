import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateBookDto) {
    const { publishedAt, ...rest } = dto;
    return this.prisma.book.create({
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.book.findMany();
  }

  findOne(id: string) {
    return this.prisma.book.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateBookDto) {
    const { publishedAt, ...rest } = dto;
    return this.prisma.book.update({
      where: { id },
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }
}
