import { PrismaClient, ContentType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const generateContent = (
  type: ContentType,
  count: number,
  categories: string[],
  baseId: string
) => {
  return Array.from({ length: count }).map((_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const idNum = i + 1;
    
    let title = '';
    let duration: string | null = null;
    let pages: number | null = null;

    if (type === 'MOVIE') {
      title = `Le Film ${category} ${idNum}`;
      duration = `${Math.floor(Math.random() * 60) + 90} min`;
    } else if (type === 'SERIES') {
      title = `Série ${category} ${idNum}`;
      duration = `${Math.floor(Math.random() * 3) + 1} Saisons`;
    } else if (type === 'EBOOK') {
      title = `Livre ${category} ${idNum}`;
      pages = Math.floor(Math.random() * 300) + 150;
    }

    return {
      title,
      description: `Une excellente œuvre dans la catégorie ${category}. Découvrez ce chef-d'œuvre disponible dès maintenant sur DipDOSS.`,
      // Use different random seed strings for varied images
      thumbnail: `https://picsum.photos/seed/${baseId}${i}/400/600`,
      url: type === 'EBOOK' 
        ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' 
        : 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      type,
      category,
      rating: Number((Math.random() * 5).toFixed(1)),
      year: Math.floor(Math.random() * 20) + 2004,
      duration,
      pages,
    };
  });
};

async function main() {
  console.log('Cleaning up existing content...');
  await prisma.content.deleteMany();

  console.log('Creating Admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'diandiallome@gmail.com' },
    update: {},
    create: {
      email: 'diandiallome@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
      profiles: {
        create: { name: 'Admin' }
      }
    }
  });

  console.log('Generating dummy content...');

  const movies = generateContent('MOVIE', 30, ['Action', 'Comédie', 'Drame', 'Sci-Fi', 'Horreur'], 'mov');
  const series = generateContent('SERIES', 20, ['Action', 'Comédie', 'Drame', 'Sci-Fi', 'Thriller'], 'ser');
  const ebooks = generateContent('EBOOK', 20, ['Roman', 'Science-Fiction', 'Développement Personnel', 'Histoire'], 'ebk');

  const allContent = [...movies, ...series, ...ebooks];

  console.log(`Inserting ${allContent.length} items...`);
  
  await prisma.content.createMany({
    data: allContent,
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
