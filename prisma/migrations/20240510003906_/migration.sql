/*
  Warnings:

  - The primary key for the `certificado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `certificado` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `grupo` table. All the data in the column will be lost.
  - You are about to drop the `regras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `regrasongrupos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `Aula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Certificado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ConteudoCurso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Grupo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Inscricao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ProgressoCurso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `regrasongrupos` DROP FOREIGN KEY `RegrasOnGrupos_grupoId_fkey`;

-- DropForeignKey
ALTER TABLE `regrasongrupos` DROP FOREIGN KEY `RegrasOnGrupos_regrasId_fkey`;

-- AlterTable
ALTER TABLE `aula` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `certificado` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`userId`, `cursoId`);

-- AlterTable
ALTER TABLE `conteudocurso` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `curso` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `grupo` DROP COLUMN `descricao`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `inscricao` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `progressocurso` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `ativo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `regras`;

-- DropTable
DROP TABLE `regrasongrupos`;

-- CreateTable
CREATE TABLE `Regra` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Regras_Grupo` (
    `grupoId` VARCHAR(191) NOT NULL,
    `regrasId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`regrasId`, `grupoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuarioOnGrupo` (
    `grupoId` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`grupoId`, `usuarioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instrutores` (
    `id` VARCHAR(191) NOT NULL,
    `cursoId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Regras_Grupo` ADD CONSTRAINT `Regras_Grupo_grupoId_fkey` FOREIGN KEY (`grupoId`) REFERENCES `Grupo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Regras_Grupo` ADD CONSTRAINT `Regras_Grupo_regrasId_fkey` FOREIGN KEY (`regrasId`) REFERENCES `Regra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioOnGrupo` ADD CONSTRAINT `UsuarioOnGrupo_grupoId_fkey` FOREIGN KEY (`grupoId`) REFERENCES `Grupo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioOnGrupo` ADD CONSTRAINT `UsuarioOnGrupo_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instrutores` ADD CONSTRAINT `instrutores_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instrutores` ADD CONSTRAINT `instrutores_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
