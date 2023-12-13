import { json, redirect, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { getTodoRepository } from "~/repositories/todo.server";
import { getUser } from "~/services/auth.server";

export const createTodoValidator = withZod(
  z.object({
    text: z.string().min(1).max(255),
  })
);

export const action = async ({ request, context }: ActionFunctionArgs) => {
  console.debug("todos.tsx action called");

  // Authenticate
  const user = await getUser({ request, context });

  // Validate
  const validateResult = await createTodoValidator.validate(
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

  console.debug("Successfully created todo");
  return redirect("/dashboard");
};
