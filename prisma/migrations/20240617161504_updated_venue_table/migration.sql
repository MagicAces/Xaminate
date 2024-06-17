/*
  Warnings:

  - You are about to drop the column `occupied` on the `venues` table. All the data in the column will be lost.
  - Added the required column `occupied_from` to the `venues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupied_to` to the `venues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expirationDate" SET DEFAULT now() + interval '15 minutes';

-- AlterTable
ALTER TABLE "venues" DROP COLUMN "occupied",
ADD COLUMN     "occupied_from" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "occupied_to" TIMESTAMP(3) NOT NULL;
