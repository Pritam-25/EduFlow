/*
  Warnings:

  - You are about to drop the column `stripCustomerId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `stripePriceId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'CREATOR';

-- DropIndex
DROP INDEX "public"."user_stripCustomerId_key";

-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeProductId" TEXT;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "stripCustomerId",
DROP COLUMN "stripePriceId",
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_stripeCustomerId_key" ON "public"."user"("stripeCustomerId");
