"use server";
import prisma from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { authAction } from "./actions";
// import { editCameraSchema } from "@/lib/schema";
import { CameraStatus, Prisma } from "@prisma/client";
import { editCameraSchema } from "@/lib/schema";
import { EditCamerasPayload } from "@/types";
// import { EditCamerasPayload } from "@/types";

export const getCameras = async () => {
  try {
    const cameras = await prisma.camera.findMany({
      include: {
        venue: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            reports: true,
          },
        },
      },
    });

    const formattedCameras = cameras.map((camera) => {
      const { created_on, updated_at, _count, ...rest } = camera;

      return {
        ...rest,
        created_on: created_on?.toISOString(),
        updated_at: updated_at?.toISOString(),
        reportCount: _count.reports,
      };
    });

    return { success: formattedCameras };
  } catch (error) {
    console.error("Error fetching cameras:", error);
    return { error: "Error fetching cameras" };
  }
};

export const editCameras = authAction(
  editCameraSchema,
  async ({ deleted, updated, added }: EditCamerasPayload, { userId }) => {
    try {
      console.log(deleted, updated, added);
      await prisma.$transaction(
        async (prisma) => {
          // Delete cameras
          if (deleted && deleted.length > 0) {
            await prisma.camera.updateMany({
              where: { id: { in: deleted } },
              data: { deleted: true, updated_at: new Date() },
            });
          }

          // Update cameras
          if (updated && updated.length > 0) {
            for (const camera of updated) {
              await prisma.camera.update({
                where: { id: camera.id },
                data: {
                  name: camera.name,
                  venue_id: camera.venue_id,
                  status:
                    camera.status === "Active"
                      ? CameraStatus.Active
                      : camera.status === "Inactive"
                      ? CameraStatus.Inactive
                      : CameraStatus.Maintenance,
                  updated_at: new Date(),
                },
              });
            }
          }

          // Add new cameras
          if (added && added.length > 0) {
            await prisma.camera.createMany({
              data: added.map((camera) => ({
                name: camera.name,
                venue_id: camera.venue_id,
                status:
                  camera.status === "Active"
                    ? CameraStatus.Active
                    : camera.status === "Inactive"
                    ? CameraStatus.Inactive
                    : CameraStatus.Maintenance,
                created_on: new Date(),
                updated_at: new Date(),
              })),
            });
          }
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
        }
      );

      revalidatePath("/settigs");

      return { success: "Cameras updated successfully" };
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong while updating cameras" };
    }
  }
);
