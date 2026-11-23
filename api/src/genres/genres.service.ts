import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({ data: dto });
    } catch (error) {
      if (hasCode(error, 'P2002'))
        throw new ConflictException('A genre with this name already exists');
      throw error;
    }
  }

  findAll() {
    return this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException(`Genre ${id} was not found`);
    return genre;
  }

  async update(id: string, dto: UpdateGenreDto) {
    try {
      return await this.prisma.genre.update({ where: { id }, data: dto });
    } catch (error) {
      if (hasCode(error, 'P2025'))
        throw new NotFoundException(`Genre ${id} was not found`);
      if (hasCode(error, 'P2002'))
        throw new ConflictException('A genre with this name already exists');
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.genre.delete({ where: { id } });
    } catch (error) {
      if (hasCode(error, 'P2025'))
        throw new NotFoundException(`Genre ${id} was not found`);
      if (hasCode(error, 'P2003'))
        throw new ConflictException(
          'Cannot delete a genre that still has books',
        );
      throw error;
    }
  }
}

function hasCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
}
