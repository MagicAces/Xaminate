-- CreateEnum
CREATE TYPE "session_statuses" AS ENUM ('pending', 'active', 'closed');

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "temp_status" "session_statuses" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expirationDate" SET DEFAULT now() + interval '15 minutes';
