import { json, redirect, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { getTodoRepository } from "~/repositories/todo.server";
import { getUser } from "~/services/auth.server";

export const TODO_TEXT_MAX_LENGTH = 63;
export const todoCreationValidator = withZod(
  z.object({
    text: z.string().min(1).max(TODO_TEXT_MAX_LENGTH),
  })
);

export const action = async ({ request, context }: ActionFunctionArgs) => {
  console.debug("todos.tsx action called");

  // Authenticate
  const user = await getUser({ request, context });

  // Validate
  const validateResult = await todoCreationValidator.validate(
    await request.formData()
  );
  if (validateResult.error) {
    console.error("Failed to validate todo", validateResult.error);
    return validationError(validateResult.error);
  }

  // Create
  const todoRepo = getTodoRepository(context);
  const createResult = await todoRepo.create(user.id, validateResult.data.text);
  if (createResult.error) {
    console.error("Failed to create todo", createResult.error);
    return json({ errors: createResult.error }, { status: 500 });
  }

  // wait 10000 ms
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  console.debug("Successfully created todo");
  return redirect("/dashboard");
};
