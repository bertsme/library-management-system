import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BooksQueryDto } from './dto/books-query.dto.js';
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

  async findAll({ genreId, search, page, limit }: BooksQueryDto) {
    const where = {
      ...(genreId ? { genreId } : {}),
      ...(search?.trim()
        ? {
            OR: [
              {
                title: {
                  contains: search.trim(),
                  mode: 'insensitive' as const,
                },
              },
              {
                author: {
                  contains: search.trim(),
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { title: 'asc' },
      }),
      this.prisma.book.count({ where }),
    ]);
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException(`Book ${id} was not found`);
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    const { publishedAt, ...rest } = dto;
    try {
      return await this.prisma.book.update({
        where: { id },
        data: {
          ...rest,
          publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        },
      });
    } catch (error) {
      if (isMissingRecord(error))
        throw new NotFoundException(`Book ${id} was not found`);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.book.delete({ where: { id } });
    } catch (error) {
      if (isMissingRecord(error))
        throw new NotFoundException(`Book ${id} was not found`);
      throw error;
    }
  }
}

function isMissingRecord(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2025'
  );
}
