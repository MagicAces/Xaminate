-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "classes" TEXT[],
ADD COLUMN     "course_codes" TEXT[],
ADD COLUMN     "course_names" TEXT[];

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expirationDate" SET DEFAULT now() + interval '15 minutes';
