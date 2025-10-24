/*
  Warnings:

  - You are about to drop the `Digest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DigestToPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Digest" DROP CONSTRAINT "Digest_userId_fkey";

-- DropForeignKey
ALTER TABLE "_DigestToPost" DROP CONSTRAINT "_DigestToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_DigestToPost" DROP CONSTRAINT "_DigestToPost_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "summarizationCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Digest";

-- DropTable
DROP TABLE "_DigestToPost";
