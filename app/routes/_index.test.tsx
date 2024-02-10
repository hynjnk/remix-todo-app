/**
 * @vitest-environment jsdom
 */
import { json } from "@remix-run/cloudflare";
import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Index from "./_index";

test("render landing page", async () => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: Index,
      loader: async () =>
        json({
          error: null,
        }),
    },
  ]);

  render(<RemixStub />);

  await screen.findByRole("heading", { level: 1, name: "Remix Todo App" });
  await screen.findByText(/Simple todo app .*/);

  const form = await screen.findByRole("form");
  expect(form.getAttribute("action")).toMatch(/\/auth\/discord/);
  expect(form).toHaveProperty("method", "post");
  expect(form.getElementsByTagName("button")).toHaveLength(1);

  await screen.findByRole("button", { name: "Login with Discord" });
  await screen.findByRole("link", { name: "Source code" });
});

test("render login error message if present", async () => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: Index,
      loader: async () =>
        json({
          error: {
            message: "Login failed",
          },
        }),
    },
  ]);

  render(<RemixStub />);

  await screen.findByText("Login failed");
});
