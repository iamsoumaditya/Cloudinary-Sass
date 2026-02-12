/*
  Warnings:

  - Added the required column `authorId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "authorId" TEXT NOT NULL;
