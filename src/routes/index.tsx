import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../lib/appwrite";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (user) {
      throw redirect({ to: "/folders" });
    } else {
      throw redirect({ to: "/login" });
    }
  },
  component: () => null,
});
