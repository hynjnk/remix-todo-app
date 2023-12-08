import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
// https://github.com/remix-run/remix/issues/6868#issuecomment-1711878481
import { z } from "zod";

export const AppEnvSchema = z.object({
  SESSION_SECRET: z.string(),
});

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    env: z.output<typeof AppEnvSchema>;
  }
}

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    const env = AppEnvSchema.parse(context.env);
    return { env };
  },
  mode: build.mode,
});
