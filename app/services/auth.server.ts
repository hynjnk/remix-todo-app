import type { AppLoadContext, DataFunctionArgs } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import {
  DiscordStrategy,
  DiscordStrategyDefaultName,
  type DiscordProfile,
} from "remix-auth-discord";

import { getUserRepository } from "~/repositories/user.server";
import { getSessionStorage } from "./session.server";

export type AuthenticatedUser = {
  id: number;
  displayName: string;
};

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
let _authenticator: Authenticator<AuthenticatedUser> | undefined;

export const getAuthenticator = (context: AppLoadContext) => {
  if (_authenticator) return _authenticator;

  const sessionStorage = getSessionStorage(context);
  _authenticator = new Authenticator<AuthenticatedUser>(sessionStorage);
  _authenticator.use(getDiscordStrategy(context));

  return _authenticator;
};

/**
 * This function authenticates the user. If the user is not authenticated,
 * it returns `null`.
 */
export const getOptionalUser = async ({ context, request }: DataFunctionArgs) =>
  getAuthenticator(context).isAuthenticated(request);

/**
 * This function authenticates the user. If the user is not authenticated,
 * it redirects them to the login page.
 */
export const getUser = async ({
  context,
  request,
}: Pick<DataFunctionArgs, "context" | "request">) =>
  getAuthenticator(context).isAuthenticated(request, {
    failureRedirect: "/",
  });

const getDiscordStrategy = (context: AppLoadContext) => {
  return new DiscordStrategy<AuthenticatedUser>(
    {
      clientID: context.env.DISCORD_AUTH_CLIENT_ID,
      clientSecret: context.env.DISCORD_AUTH_CLIENT_SECRET,
      callbackURL: context.env.DISCORD_AUTH_CALLBACK_URL,
      scope: ["identify"],
    },
    async ({
      profile,
      // No plan to use the provider API, so we only need the profile
      // https://github.com/sergiodxa/remix-auth-oauth2/discussions/30#discussioncomment-3403767
      // accessToken,
      // refreshToken,
      // extraParams,
    }) => verifyDiscordProfile(DiscordStrategyDefaultName, profile, context)
  );
};

const verifyDiscordProfile = async (
  authProvider: typeof DiscordStrategyDefaultName,
  profile: DiscordProfile,
  context: AppLoadContext
) => {
  const { id } = await getUserRepository(context).upsert({
    authProvider,
    profileId: profile.id,
  });
  return { id, displayName: profile.displayName };
};
