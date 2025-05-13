/*
  Warnings:

  - A unique constraint covering the columns `[shortname]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortname` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "shortname" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "projects_shortname_key" ON "projects"("shortname");
