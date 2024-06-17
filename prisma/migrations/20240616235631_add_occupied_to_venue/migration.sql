-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expirationDate" SET DEFAULT now() + interval '15 minutes';

-- AlterTable
ALTER TABLE "venues" ADD COLUMN     "occupied" BOOLEAN NOT NULL DEFAULT false;
