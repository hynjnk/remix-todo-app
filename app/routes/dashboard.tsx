import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { getUser, type AuthenticatedUser } from "~/services/auth.server";

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
    <div className="flex flex-col">
      <DashboardHeader user={user} />
      <Outlet />
    </div>
  );
}

const DashboardHeader = ({ user }: { user: AuthenticatedUser }) => {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <img
          className="mr-2 h-10 w-10"
          src="/images/logo-round.png"
          alt="Remix Todo App Logo"
        />
        <h1 className="invisible text-xl font-medium tracking-tight text-gray-900 md:visible">
          Remix Todo App
        </h1>
        <div className="ml-auto flex items-center space-x-4">
          {/* XXX Use Avatar, DropdownMenu */}
          <p className="invisible text-gray-700 md:visible">
            {user.displayName}
          </p>
          <Form action="/logout" method="post">
            <Button variant="secondary" size="sm" type="submit">
              Logout
            </Button>
          </Form>
        </div>
      </div>
    </header>
  );
};
