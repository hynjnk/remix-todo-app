import type { AppLoadContext } from "@remix-run/cloudflare";
import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { getDb } from "~/db/client.server";
import { todos } from "~/db/schema";

let _todoRepository: TodoRepository | undefined;

export const getTodoRepository = (context: AppLoadContext) => {
  if (_todoRepository) return _todoRepository;

  _todoRepository = new TodoRepository(context);
  return _todoRepository;
};

class TodoRepository {
  private readonly db: ReturnType<typeof getDb>;

  constructor(context: AppLoadContext) {
    this.db = getDb(context);
  }

  async list(userId: number, completed: boolean) {
    return this.db
      .select({
        id: todos.id,
        text: todos.text,
        createdAt: todos.createdAt,
        updatedAt: todos.updatedAt,
        completedAt: todos.completedAt,
      })
      .from(todos)
      .where(
        and(
          eq(todos.userId, userId),
          completed ? isNotNull(todos.completedAt) : isNull(todos.completedAt)
        )
      )
      .orderBy(desc(todos.updatedAt));
  }

  async create(userId: number, text: string) {
    return this.db.insert(todos).values({
      userId,
      text,
    });
  }

  async delete(userId: number, id: number) {
    return this.db
      .delete(todos)
      .where(and(eq(todos.userId, userId), eq(todos.id, id)));
  }

  async complete(userId: number, id: number) {
    return this.db
      .update(todos)
      .set({
        updatedAt: sql`CURRENT_TIMESTAMP`,
        completedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(and(eq(todos.userId, userId), eq(todos.id, id)));
  }

  async uncomplete(userId: number, id: number) {
    return this.db
      .update(todos)
      .set({
        updatedAt: sql`CURRENT_TIMESTAMP`,
        completedAt: null,
      })
      .where(and(eq(todos.userId, userId), eq(todos.id, id)));
  }
}
