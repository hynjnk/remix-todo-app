import { type AppLoadContext } from "@remix-run/cloudflare";
import { sql } from "drizzle-orm";
import { getDb } from "~/db/client.server";
import { users } from "~/db/schema";

let _userRepository: UserRepository | undefined;

export const getUserRepository = (context: AppLoadContext) => {
  if (_userRepository) return _userRepository;

  _userRepository = new UserRepository(context);
  return _userRepository;
};

class UserRepository {
  private readonly db: ReturnType<typeof getDb>;

  constructor(context: AppLoadContext) {
    this.db = getDb(context);
  }

  async upsert(value: { authProvider: string; profileId: string }) {
    return this.db
      .insert(users)
      .values({
        ...value,
        lastLoginAt: sql`CURRENT_TIMESTAMP`,
      })
      .onConflictDoUpdate({
        target: [users.authProvider, users.profileId],
        set: {
          lastLoginAt: sql`CURRENT_TIMESTAMP`,
        },
      })
      .returning({
        id: users.id,
      })
      .then(<T>(rows: T[]) => {
        // Upserted with a unique constraint, so there's only one row
        return rows[0] as T;
      });
  }
}
