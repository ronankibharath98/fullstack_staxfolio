/*
  Warnings:

  - You are about to drop the `verifyOtp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "verifyOtp";

-- CreateTable
CREATE TABLE "VerifyUserOtp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VerifyUserOtp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerifyAdminOtp" (
    "id" TEXT NOT NULL,
    "orgEmail" TEXT NOT NULL,
    "otp" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VerifyAdminOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifyUserOtp_email_key" ON "VerifyUserOtp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerifyAdminOtp_orgEmail_key" ON "VerifyAdminOtp"("orgEmail");
