import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/auth";

export const action = createSafeActionClient();

export const authAction = createSafeActionClient({
  async middleware() {
    const session = await auth();

    if (!session || !session?.user) throw new Error("Session not found");

    const { id } = session?.user;

    if (!id) throw new Error("Session is not valid");

    return { userId: id };
  },
});
