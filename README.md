# Remix To Do App

- [Remix Docs](https://remix.run/docs)

## Development

You will be utilizing Wrangler for local development to emulate the Cloudflare runtime. This is already wired up in your package.json as the `dev` script:

```sh
# start the remix dev server and wrangler
npm run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready to go!

## Deployment

Cloudflare Pages are currently only deployable through their Git provider integrations.

If you don't already have an account, then [create a Cloudflare account here](https://dash.cloudflare.com/sign-up/pages) and after verifying your email address with Cloudflare, go to your dashboard and follow the [Cloudflare Pages deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything).

Configure the "Build command" should be set to `npm run build`, and the "Build output directory" should be set to `public`.

## Stacks

- Cloudflare [Pages](https://pages.cloudflare.com/) + [D1](https://developers.cloudflare.com/d1/)
- [Remix](https://remix.run/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [remix-auth](https://github.com/sergiodxa/remix-auth), [remix-auth-discord](https://github.com/JonnyBnator/remix-auth-discord)
- [CONFORM](https://conform.guide/)
- [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
