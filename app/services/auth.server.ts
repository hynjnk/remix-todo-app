import type { AppLoadContext } from "@remix-run/cloudflare";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { getSessionStorage } from "./session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
let _authenticator: Authenticator<User> | undefined;

export const getAuthenticator = (
  context: AppLoadContext
): Authenticator<User> => {
  if (_authenticator) return _authenticator;

  const sessionStorage = getSessionStorage(context);
  _authenticator = new Authenticator<User>(sessionStorage);
  _authenticator.use(formStrategy, "form-strategy");

  return _authenticator;
};

// XXX Temporary code to make the example work
type User = {
  id: number;
  username: string;
  email: string;
};

const formStrategy = new FormStrategy(async ({ form, context }) => {
  // Here you can use `form` to access and input values from the form.
  // and also use `context` to access more things from the server
  let email = form.get("email");
  let password = form.get("password");

  // XXX Temporary code to make the example work
  if ("admin@example.com" === email && "password" === password) {
    return Promise.resolve({
      id: 1,
      username: "admin",
      email: "admin@example.com",
    });
  }
  throw new AuthorizationError("Invalid email or password");
});
