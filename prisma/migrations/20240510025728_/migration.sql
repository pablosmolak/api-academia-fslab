/*
  Warnings:

  - You are about to drop the column `grupoId` on the `usuario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `Usuario_grupoId_fkey`;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `grupoId`;
