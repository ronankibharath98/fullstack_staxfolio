/*
  Warnings:

  - A unique constraint covering the columns `[orgEmail]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_orgEmail_key" ON "Admin"("orgEmail");
