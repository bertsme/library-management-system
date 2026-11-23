import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../prisma/prisma.service.js';
import { BooksService } from './books.service.js';

describe('BooksService', () => {
  const book = {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  let service: BooksService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new BooksService({ book } as unknown as PrismaService);
  });

  it('filters by genre and title or author, and paginates with skip/take', async () => {
    book.findMany.mockResolvedValue([{ id: 'b1' }]);
    book.count.mockResolvedValue(21);

    const result = await service.findAll({
      genreId: 'genre-1',
      search: 'Tolkien',
      page: 3,
      limit: 10,
    });

    expect(book.findMany).toHaveBeenCalledWith({
      where: {
        genreId: 'genre-1',
        OR: [
          { title: { contains: 'Tolkien', mode: 'insensitive' } },
          { author: { contains: 'Tolkien', mode: 'insensitive' } },
        ],
      },
      skip: 20,
      take: 10,
      orderBy: { title: 'asc' },
    });
    expect(book.count).toHaveBeenCalledWith({ where: expect.any(Object) });
    expect(result.pagination).toEqual({
      page: 3,
      limit: 10,
      total: 21,
      totalPages: 3,
    });
  });

  it('throws not found when a book does not exist', async () => {
    book.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
