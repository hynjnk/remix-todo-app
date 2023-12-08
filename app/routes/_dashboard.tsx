import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "~/services/auth.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return { user };
};

export default function DashboardRoute() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <header>
        <p>email: {user.email}</p>
        <Form action="/logout" method="post">
          <button type="submit" className="button">
            Logout
          </button>
        </Form>
      </header>
      <Outlet />
    </div>
  );
}
