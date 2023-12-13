import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";

import { getAuthenticator } from "~/services/auth.server";

export const loader = async () => redirect("/");

export const action = async ({ request, context }: ActionFunctionArgs) => {
  return getAuthenticator(context).authenticate("discord", request);
};
