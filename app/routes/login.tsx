import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "~/services/auth.server";
import { getSessionStorage } from "~/services/session.server";

// If the user is authenticated with `authenticator.isAuthenticated` and
// redirect to the dashboard if it is or return null if it's not
type LoaderError = { message: string } | null;
export async function loader({ request, context }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to `/` directly
  const authenticator = getAuthenticator(context);
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  // https://github.com/remix-run/examples/blob/main/remix-auth-form/app/routes/login.tsx#L17
  const session = await getSessionStorage(context).getSession(
    request.headers.get("Cookie")
  );
  const error = session.get(authenticator.sessionErrorKey) as LoaderError;
  return json({ error });
}

export async function action({ request, context }: ActionFunctionArgs) {
  // Call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  const authenticator = getAuthenticator(context);
  return await authenticator.authenticate("form-strategy", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <Form method="post">
      {error ? <div>{error.message}</div> : null}
      <input type="email" name="email" required />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
      />
      <button>Sign In</button>
    </Form>
  );
}
