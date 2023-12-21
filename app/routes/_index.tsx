import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { getAuthenticator } from "~/services/auth.server";
import { getSessionStorage } from "~/services/session.server";

// If the user is authenticated with `authenticator.isAuthenticated` and
// redirect to the dashboard if it is or return null if it's not
type LoaderError = { message: string } | null;
export async function loader({ request, context }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to `/` directly
  const authenticator = getAuthenticator(context);
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });

  // https://github.com/remix-run/examples/blob/main/remix-auth-github/app/routes/_index.tsx#L10
  const session = await getSessionStorage(context).getSession(
    request.headers.get("Cookie")
  );
  const error = session.get(authenticator.sessionErrorKey) as LoaderError;
  return json({ error });
}

export default function Index() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <main className="w-full py-12 text-center md:py-24">
      <div className="container px-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
          Remix Todo App
        </h1>
        <p className="mt-6 text-lg text-gray-700">
          Simple todo app built with Remix and Drizzle ORM, hosted on Cloudflare
          Pages and D1
        </p>
      </div>
      <Form className="mt-8" action="/auth/discord" method="post">
        {error ? <div>{error.message}</div> : null}
        <Button className="bg-[#5865f2] hover:bg-[#7289da]">
          <DiscordMarkWhite className="mr-2 h-4 w-4" />
          Login with Discord
        </Button>
      </Form>
      <div className="mt-6">
        <a
          href="https://github.com/hynjnk/remix-todo-app"
          className="text-gray-700 underline hover:text-gray-500"
        >
          Source code
        </a>
      </div>
    </main>
  );
}

const DiscordMarkWhite = ({ className }: { className: string }) => {
  // https://discord.com/branding
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 127.14 96.36"
    >
      <path
        fill="#fff"
        d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
      />
    </svg>
  );
};
