/*
  Warnings:

  - You are about to alter the column `handle` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "handle" SET DATA TYPE VARCHAR(20);
