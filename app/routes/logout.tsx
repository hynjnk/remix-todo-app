import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/services/auth.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  return await authenticator.logout(request, {
    redirectTo: "/login",
  });
};

export const loader = async () => redirect("/");
