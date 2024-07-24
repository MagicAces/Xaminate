/*
  Warnings:

  - A unique constraint covering the columns `[reference_no]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reference_no` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CameraStatus" AS ENUM ('Active', 'Inactive', 'Maintenance');

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "camera_id" INTEGER;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "reference_no" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expirationDate" SET DEFAULT now() + interval '15 minutes';

-- AlterTable
ALTER TABLE "venues" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "cameras" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "venue_id" INTEGER NOT NULL,
    "status" "CameraStatus" NOT NULL DEFAULT 'Active',
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cameras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cameras_name_key" ON "cameras"("name");

-- CreateIndex
CREATE UNIQUE INDEX "students_reference_no_key" ON "students"("reference_no");

-- AddForeignKey
ALTER TABLE "cameras" ADD CONSTRAINT "cameras_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_camera_id_fkey" FOREIGN KEY ("camera_id") REFERENCES "cameras"("id") ON DELETE SET NULL ON UPDATE CASCADE;
