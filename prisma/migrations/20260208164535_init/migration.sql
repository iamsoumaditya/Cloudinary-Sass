/*
  Warnings:

  - A unique constraint covering the columns `[publicId,authorId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId,authorId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Image_publicId_authorId_key" ON "Image"("publicId", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_publicId_authorId_key" ON "Video"("publicId", "authorId");
