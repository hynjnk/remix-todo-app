import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { TodoCreationForm } from "~/components/todo/creationForm";
import { getTodoRepository } from "~/repositories/todo.server";
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
    <div>
      <h2>To Do</h2>
      <TodoCreationForm />
      <ul>
        {incompleteTodos.map((todo) => (
          <li key={todo.id}>
            {todo.text} {todo.createdAt} {todo.updatedAt}
            <form action={`/todos/${todo.id}/delete`} method="post">
              <button type="submit">Delete</button>
            </form>
            <form action={`/todos/${todo.id}/complete`} method="post">
              <button type="submit">Complete</button>
            </form>
          </li>
        ))}
      </ul>
      <h2>Completed</h2>
      <ul>
        {completedTodos.map((todo) => (
          <li key={todo.id}>
            {todo.text} {todo.createdAt} {todo.updatedAt}
            <form action={`/todos/${todo.id}/delete`} method="post">
              <button type="submit">Delete</button>
            </form>
            <form action={`/todos/${todo.id}/uncomplete`} method="post">
              <button type="submit">Uncomplete</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
