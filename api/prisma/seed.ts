
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from the environment.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const genres = [
  {
    name: "Fiction",
    description: "Novels, literary classics and imaginative storytelling.",
  },
  {
    name: "Science & Technology",
    description: "Computing, engineering, science and emerging technology.",
  },
  {
    name: "Business & Finance",
    description: "Entrepreneurship, leadership, economics and personal finance.",
  },
  {
    name: "Personal Development",
    description: "Habits, productivity, psychology and personal growth.",
  },
];

const books = [
  // FICTION
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    genre: "Fiction",
    description: "A dystopian novel about surveillance and authoritarianism.",
    publishedAt: new Date("1949-06-08"),
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    genre: "Fiction",
    description: "A story exploring justice, morality and childhood.",
    publishedAt: new Date("1960-07-11"),
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780062315007",
    genre: "Fiction",
    description: "A shepherd travels in search of his personal legend.",
    publishedAt: new Date("1988-01-01"),
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    genre: "Fiction",
    description: "A portrait of ambition, wealth and the American Dream.",
    publishedAt: new Date("1925-04-10"),
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    genre: "Fiction",
    description: "A classic novel about love, class and first impressions.",
    publishedAt: new Date("1813-01-28"),
  },

  // SCIENCE & TECHNOLOGY
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    genre: "Science & Technology",
    description: "Principles and practices for writing maintainable software.",
    publishedAt: new Date("2008-08-01"),
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas and Andrew Hunt",
    isbn: "9780135957059",
    genre: "Science & Technology",
    description: "Practical techniques for becoming a better software developer.",
    publishedAt: new Date("2019-09-13"),
  },
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "9781449373320",
    genre: "Science & Technology",
    description: "An introduction to reliable, scalable and maintainable systems.",
    publishedAt: new Date("2017-03-16"),
  },
  {
    title: "Code Complete",
    author: "Steve McConnell",
    isbn: "9780735619678",
    genre: "Science & Technology",
    description: "A comprehensive guide to software construction.",
    publishedAt: new Date("2004-06-09"),
  },
  {
    title: "The Phoenix Project",
    author: "Gene Kim, Kevin Behr and George Spafford",
    isbn: "9780988262591",
    genre: "Science & Technology",
    description: "A fictional story about IT operations and DevOps.",
    publishedAt: new Date("2013-02-15"),
  },

  // BUSINESS & FINANCE
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    isbn: "9780307887894",
    genre: "Business & Finance",
    description: "A methodology for building and testing new businesses.",
    publishedAt: new Date("2011-09-13"),
  },
  {
    title: "The E-Myth Revisited",
    author: "Michael E. Gerber",
    isbn: "9780887307287",
    genre: "Business & Finance",
    description: "Why small businesses struggle and how to build systems.",
    publishedAt: new Date("1995-03-01"),
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    isbn: "9781612680194",
    genre: "Business & Finance",
    description: "Lessons about financial literacy and wealth building.",
    publishedAt: new Date("1997-04-01"),
  },
  {
    title: "Good to Great",
    author: "Jim Collins",
    isbn: "9780066620992",
    genre: "Business & Finance",
    description: "Research into what makes companies achieve lasting success.",
    publishedAt: new Date("2001-10-16"),
  },
  {
    title: "Start with Why",
    author: "Simon Sinek",
    isbn: "9781591846444",
    genre: "Business & Finance",
    description: "How purpose can inspire leadership and organizational success.",
    publishedAt: new Date("2009-10-29"),
  },

  // PERSONAL DEVELOPMENT
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    genre: "Personal Development",
    description: "A practical framework for building better habits.",
    publishedAt: new Date("2018-10-16"),
  },
  {
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    isbn: "9781982137274",
    genre: "Personal Development",
    description: "Principles for personal and professional effectiveness.",
    publishedAt: new Date("1989-08-15"),
  },
  {
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    isbn: "9780671027032",
    genre: "Personal Development",
    description: "Timeless advice on communication and relationships.",
    publishedAt: new Date("1936-10-01"),
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    isbn: "9781455586691",
    genre: "Personal Development",
    description: "Strategies for focused work in a distracted world.",
    publishedAt: new Date("2016-01-05"),
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    isbn: "9781585424337",
    genre: "Personal Development",
    description: "Classic ideas about ambition, goals and achievement.",
    publishedAt: new Date("1937-01-01"),
  },
];

async function main() {
  console.log("Starting database seeding...");

  const genreMap = new Map<string, string>();

  for (const genre of genres) {
    const savedGenre = await prisma.genre.upsert({
      where: { name: genre.name },
      update: { description: genre.description },
      create: genre,
    });

    genreMap.set(genre.name, savedGenre.id);
  }

  console.log(`Created/updated ${genres.length} genres.`);

  for (const book of books) {
    const genreId = genreMap.get(book.genre);

    if (!genreId) {
      throw new Error(`Genre not found: ${book.genre}`);
    }

    const { genre, ...bookData } = book;

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        ...bookData,
        genreId,
      },
      create: {
        ...bookData,
        genreId,
      },
    });
  }

  console.log(`Created/updated ${books.length} books.`);

  const [genreCount, bookCount] = await Promise.all([
    prisma.genre.count(),
    prisma.book.count(),
  ]);

  console.log("Database seeding complete!");
  console.log(`Total genres in database: ${genreCount}`);
  console.log(`Total books in database: ${bookCount}`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
