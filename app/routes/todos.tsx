import { parse } from "@conform-to/zod";
import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { z } from "zod";
import { getTodoRepository } from "~/repositories/todo.server";
import { getUser } from "~/services/auth.server";

export const TODO_TEXT_MAX_LENGTH = 63;
export const todoCreationSchema = z.object({
  text: z.string().min(1).max(TODO_TEXT_MAX_LENGTH),
});

export const action = async ({ request, context }: ActionFunctionArgs) => {
  console.debug("todos.tsx action called");

  // Authenticate
  const user = await getUser({ request, context });

  // Validate
  const formData = await request.formData();
  const submission = parse(formData, {
    schema: todoCreationSchema,
  });
  if (submission.intent !== "submit" || !submission.value) {
    return json(submission);
  }

  // Create
  const todoRepo = getTodoRepository(context);
  const createResult = await todoRepo.create(user.id, submission.value.text);
  if (createResult.error) {
    console.error("Failed to create todo", createResult.error);
    throw createResult.error;
  }

  // await new Promise((resolve) => setTimeout(resolve, 10000)); // wait 10000 ms

  console.debug("Successfully created todo");
  return json({
    ...submission,
    // Notify the client to reset the form using `null`
    payload: null,
  });
};
