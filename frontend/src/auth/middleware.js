import { redirect } from "react-router";
import { getCurrentUser } from "./auth";

export async function authMiddleware({ context }) {
  const user = await getCurrentUser();

  if (!user) {
    throw redirect("/login");
  }
}
