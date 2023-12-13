import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

import { getAuthenticator } from "~/services/auth.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  return getAuthenticator(context).authenticate("discord", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  });
};
