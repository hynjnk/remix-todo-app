import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { Check, Loader2, X } from "lucide-react";
import { ValidatedForm, useField, useIsSubmitting } from "remix-validated-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getTodoRepository } from "~/repositories/todo.server";
import { TODO_TEXT_MAX_LENGTH, todoCreationValidator } from "~/routes/todos";
import { getUser } from "~/services/auth.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await getUser({ request, context });
  const todoRepo = getTodoRepository(context);
  const [incompleteTodos, completedTodos] = await Promise.all([
    todoRepo.list(user.id, false),
    todoRepo.list(user.id, true),
  ]);
  return { incompleteTodos, completedTodos };
};

export default function Index() {
  const { incompleteTodos, completedTodos } = useLoaderData<typeof loader>();
  return (
    // 100vh - 4rem (header) - 1px (border)
    <main className="min-h-[calc(100vh-4rem-1px)] p-4">
      <div className="max-w-2xl">
        <TodoCreationForm />
        <ul>
          {incompleteTodos.map((todo) => (
            <li className="flex items-center space-x-2" key={todo.id}>
              <TodoCompletionForm todoId={todo.id.toString()} />
              <span className="w-full">{todo.text}</span>
              <TodoDeletionForm todoId={todo.id.toString()} />
            </li>
          ))}
          {completedTodos.map((todo) => (
            <li className="flex items-center space-x-2" key={todo.id}>
              <TodoUncompletionForm todoId={todo.id.toString()} />
              <span className="w-full text-gray-500 line-through">
                {todo.text}
              </span>
              <TodoDeletionForm todoId={todo.id.toString()} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

const TodoCreationForm = () => {
  return (
    <ValidatedForm
      validator={todoCreationValidator}
      resetAfterSubmit={true}
      action="/todos"
      method="post"
    >
      <TodoCreationInput name="text" />
    </ValidatedForm>
  );
};

const TodoCreationInput = ({ name }: { name: string }) => {
  const { error, getInputProps } = useField(name);
  return (
    <div className="h-16">
      <div className="flex space-x-2">
        <Input
          className="flex-auto"
          {...getInputProps({ id: name })}
          maxLength={TODO_TEXT_MAX_LENGTH}
          placeholder="To Do..."
        />
        <TodoCreationSubmitButton />
      </div>
      {error && <p className="ml-2 text-sm text-red-700">{error}</p>}
    </div>
  );
};

const TodoCreationSubmitButton = () => {
  const isSubmitting = useIsSubmitting();
  return (
    <Button className="w-14 flex-none" type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <Loader2 aria-label="Adding..." className="h-4 w-4 animate-spin" />
      ) : (
        "Add"
      )}
    </Button>
  );
};

const TodoCompletionForm = ({ todoId }: { todoId: string }) => {
  return (
    <Form
      className="flex items-center"
      action={`/todos/${todoId}/complete`}
      method="post"
      preventScrollReset={true}
    >
      <button
        type="submit"
        className="h-4 w-4 shrink-0 rounded-sm border border-primary text-background ring-offset-background hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Check className="h-4 w-4" />
      </button>
    </Form>
  );
};

const TodoUncompletionForm = ({ todoId }: { todoId: string }) => {
  return (
    <Form
      className="flex items-center"
      action={`/todos/${todoId}/uncomplete`}
      method="post"
      preventScrollReset={true}
    >
      <button
        type="submit"
        className="h-4 w-4 shrink-0 rounded-sm border border-gray-500 text-gray-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Check className="h-4 w-4" />
      </button>
    </Form>
  );
};

const TodoDeletionForm = ({ todoId }: { todoId: string }) => {
  return (
    <Form action={`/todos/${todoId}/delete`} method="post">
      <button className="mx-4 h-6 w-6 rounded-full text-gray-500 hover:bg-destructive/90 hover:text-destructive-foreground">
        <X className="m-auto h-4 w-4" aria-label="Delete" />
      </button>
    </Form>
  );
};
