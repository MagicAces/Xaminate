-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expirationDate" SET DEFAULT now() + interval '15 minutes';
