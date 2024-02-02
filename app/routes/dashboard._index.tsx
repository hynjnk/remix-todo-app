import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getTodoRepository } from "~/repositories/todo.server";
import { getUser } from "~/services/auth.server";
import { TODO_TEXT_MAX_LENGTH, todoCreationSchema, type action } from "./todos";

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
  const todoCreationPath = "/todos";
  const fetcher = useFetcher<typeof action>();

  const lastResult = fetcher.data;
  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onSubmit",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: todoCreationSchema });
    },
  });

  const isSubmitting = fetcher.state === "submitting";

  return (
    <fetcher.Form
      action={todoCreationPath}
      method="post"
      {...getFormProps(form)}
    >
      <div className="h-16">
        <div className="flex space-x-2">
          <div className="flex-auto">
            <Input
              maxLength={TODO_TEXT_MAX_LENGTH}
              placeholder="To Do..."
              disabled={isSubmitting}
              {...getInputProps(fields.text, { type: "text" })}
            />
            {fields.text.errors?.map((error) => (
              <p className="ml-2 mt-1 text-sm text-red-700" key={error}>
                {error}
              </p>
            ))}
          </div>
          <Button
            className="w-14 flex-none"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2
                aria-label="Adding..."
                className="h-4 w-4 animate-spin"
              />
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
};

const TodoCompletionForm = ({ todoId }: { todoId: string }) => {
  const todoCompletionPath = `/todos/${todoId}/complete`;
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <fetcher.Form
      className="flex items-center"
      action={todoCompletionPath}
      method="post"
      preventScrollReset={true}
    >
      {isSubmitting ? (
        <Loader2 aria-label="Completing..." className="h-4 w-4 animate-spin" />
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-4 w-4 shrink-0 rounded-sm border border-primary text-background ring-offset-background hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Check aria-label="Complete" className="h-4 w-4" />
        </button>
      )}
    </fetcher.Form>
  );
};

const TodoUncompletionForm = ({ todoId }: { todoId: string }) => {
  const todoUncompletionPath = `/todos/${todoId}/uncomplete`;
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <fetcher.Form
      className="flex items-center"
      action={todoUncompletionPath}
      method="post"
      preventScrollReset={true}
    >
      {isSubmitting ? (
        <Loader2
          aria-label="Uncompleting..."
          className="h-4 w-4 animate-spin"
        />
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-4 w-4 shrink-0 rounded-sm border border-gray-500 text-gray-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Check aria-label="Uncomplete" className="h-4 w-4" />
        </button>
      )}
    </fetcher.Form>
  );
};

const TodoDeletionForm = ({ todoId }: { todoId: string }) => {
  const todoDeletionPath = `/todos/${todoId}/delete`;
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <fetcher.Form
      action={todoDeletionPath}
      method="post"
      preventScrollReset={true}
    >
      <button
        type="submit"
        disabled={isSubmitting}
        className="mx-4 h-6 w-6 rounded-full text-gray-500 hover:bg-destructive/90 hover:text-destructive-foreground"
      >
        {isSubmitting ? (
          <Loader2
            aria-label="Deleting..."
            className="m-auto h-4 w-4 animate-spin"
          />
        ) : (
          <X aria-label="Delete" className="m-auto h-4 w-4" />
        )}
      </button>
    </fetcher.Form>
  );
};
