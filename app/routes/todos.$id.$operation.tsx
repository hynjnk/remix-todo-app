import { redirect, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { z } from "zod";
import { getTodoRepository } from "~/repositories/todo.server";
import { getUser } from "~/services/auth.server";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
  operation: z.enum(["delete", "uncomplete", "complete"]),
});

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  console.log("todo.$id.$operation.tsx action called");
  // Authenticate
  const user = await getUser({ request, context });

  // Validate path params
  const { id, operation } = await paramsSchema
    .parseAsync(params)
    .catch((error) => {
      console.error("Failed to parse params", error);
      throw new Response(error, {
        status: 400,
      });
    });

  const result = await getTodoRepository(context)[operation](user.id, id);
  if (result.error) {
    console.error(`Failed to ${operation} todo`, result.error);
    return new Response(null, {
      status: 500,
    });
  }

  console.log(`Successfully ${operation} todo ${id}`);
  return redirect("/dashboard");
};
