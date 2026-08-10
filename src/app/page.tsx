import { redirect } from "next/navigation";

/**
 * The portal is the product. Send visitors straight to the dashboard; the
 * client-side AuthGuard forwards unauthenticated users to /login.
 */
export default function RootPage() {
  redirect("/dashboard");
}
