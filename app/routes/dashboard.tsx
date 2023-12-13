import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | Remix Todo App" },
    { name: "description", content: "Welcome to Remix Todo App!" },
  ];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await getUser({ request, context });

  return { user };
};

export default function DashboardRoute() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <header>
        <p>Hello, {user.displayName}!</p>
        <Form action="/logout" method="post">
          <button type="submit">Logout</button>
        </Form>
      </header>
      <Outlet />
    </div>
  );
}
