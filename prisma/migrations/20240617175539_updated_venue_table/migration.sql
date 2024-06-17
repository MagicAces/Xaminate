-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expirationDate" SET DEFAULT now() + interval '15 minutes';

-- AlterTable
ALTER TABLE "venues" ALTER COLUMN "occupied_from" DROP NOT NULL,
ALTER COLUMN "occupied_to" DROP NOT NULL;
