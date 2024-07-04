/*
  Warnings:

  - You are about to drop the column `occupied_from` on the `venues` table. All the data in the column will be lost.
  - You are about to drop the column `occupied_to` on the `venues` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "expirationDate" SET DEFAULT now() + interval '15 minutes';

-- AlterTable
ALTER TABLE "venues" DROP COLUMN "occupied_from",
DROP COLUMN "occupied_to";

-- CreateTable
CREATE TABLE "venue_bookings" (
    "id" SERIAL NOT NULL,
    "venue_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venue_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "venue_bookings_session_id_key" ON "venue_bookings"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "venue_bookings_venue_id_start_time_end_time_key" ON "venue_bookings"("venue_id", "start_time", "end_time");

-- AddForeignKey
ALTER TABLE "venue_bookings" ADD CONSTRAINT "venue_bookings_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_bookings" ADD CONSTRAINT "venue_bookings_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
