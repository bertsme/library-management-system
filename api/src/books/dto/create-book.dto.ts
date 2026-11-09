import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title!: string;

  @IsString()
  author!: string;

  @IsString()
  isbn!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsUUID()
  genreId!: string;
}
