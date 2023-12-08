import type { AppLoadContext, SessionStorage } from "@remix-run/cloudflare";
import { createCookieSessionStorage } from "@remix-run/cloudflare";

// XXX Use Cloudflare KV to store the session
let _sessionStorage: SessionStorage | undefined;

export const getSessionStorage = (context: AppLoadContext) => {
  if (_sessionStorage) return _sessionStorage;
  _sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "_session", // use any name you want here
      sameSite: "lax", // this helps with CSRF
      path: "/", // remember to add this so the cookie will work in all routes
      httpOnly: true, // for security reasons, make this cookie http only
      secrets: [context.env.SESSION_SECRET], // replace this with an actual secret
      secure: process.env.NODE_ENV === "production", // enable this in prod only
    },
  });
  return _sessionStorage;
};
