import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.defaultVideo.createMany({
    data: [
      {
        title: "Deer Portrait in Nature",
        description: "Gentle deer captured in a serene natural setting highlighting its eyes and facial features.",
        publicId: "cloudinary-saas/video/seed1",
        originalSize: "9039428",
        compressedSize: "2776255",
        duration: 10.48,
      },
      {
        title: "Evening Sky Clouds",
        description: "Golden sunset sky with soft drifting clouds creating a calm atmospheric evening scene.",
        publicId: "cloudinary-saas/video/seed2",
        originalSize: "6312783",
        compressedSize: "3154850",
        duration: 18.44,
      },
      {
        title: "Wild Lynx Close-Up",
        description: "Detailed close-up of a lynx showcasing its fur texture, alert eyes, and natural habitat presence.",
        publicId: "cloudinary-saas/video/seed3",
        originalSize: "8217311",
        compressedSize: "2889707",
        duration: 9.02,
      },
      {
        title: "Seagulls Over Ocean",
        description: "Seagulls flying gracefully above sea waters in a peaceful coastal environment.",
        publicId: "cloudinary-saas/video/seed4",
        originalSize: "21561670",
        compressedSize: "7285257",
        duration: 14.34,
      },
      {
        title: "Pond Frog on Stones",
        description: "A green frog resting on pond stones surrounded by natural wetland scenery.",
        publicId: "cloudinary-saas/video/seed5",
        originalSize: "3985843",
        compressedSize: "1518536",
        duration: 7.9,
      },
      {
        title: "Spring Insect Macro",
        description: "Macro shot of an insect on blossom flowers capturing fine springtime details.",
        publicId: "cloudinary-saas/video/seed6",
        originalSize: "4249136",
        compressedSize: "1875886",
        duration: 11,
      },
      {
        title: "Frog in Green Reeds",
        description: "A camouflaged frog resting among lush green reeds in its natural habitat.",
        publicId: "cloudinary-saas/video/seed7",
        originalSize: "4794234",
        compressedSize: "1863854",
        duration: 14.66652,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.defaultImage.createMany({
    data: [
      {
        title: "Lone Tree Above Mountain Clouds",
        type: "image/jpg",
        publicId: "cloudinary-saas/image/seed7",
        size: 147261.44,
      },
      {
        title: "Sun Rays Above Mountain Peaks",
        type: "image/jpg",
        publicId: "cloudinary-saas/image/seed8",
        size: 80250.88,
      },
      {
        title: "Sunset Riverside Gathering",
        type: "image/jpg",
        publicId: "cloudinary-saas/image/seed2",
        size: 44800,
      },
      {
        title: "Riverside Sunset Horizon",
        type: "image/jpg",
        publicId: "cloudinary-saas/image/seed4",
        size: 418764.8,
      },
      {
        title: "City Skyline Night Lights",
        type: "image/jpg",
        publicId: "cloudinary-saas/image/seed5",
        size: 83701.76,
      },
      {
        title: "Rocky Mountain River Stream",
        type: "image/jpg",
        publicId: "cloudinary-saas/image/seed6",
        size: 118579.2,
      },
      {
        title: "Lakeside Evening Reflection",
        type: "image/jpg",
        publicId: "cloudinary-saas/image/seed1",
        size: 87767.04,
      },
      {
        title: "Cloudy Sky Over Forest Hills",
        type: "image/jpg",
        publicId: "cloudinary-saas/image/seed3",
        size: 132966.4,
      },
      {
        title: "Autumn Forest Road Path",
        type: "image/jpg",
        publicId: "cloudinary-saas/image/seed9",
        size: 1405091.84,
      },
      {
        title: "Temple Pavilion Across the Green Lake",
        type: "image/jpg",
        publicId: "cloudinary-saas/image/seed10",
        size: 941864.96,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeding completed");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });