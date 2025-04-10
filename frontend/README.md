This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Useful commands

Run:

```bash
  yarn dev
```

Autofix formatting:

```bash
yarn prettier
```

## Getting Started

First, run the development server:

```bash
cp .env.template .env
```

- Populate .env-file
- Run the backend (see [backend README](../backend/README.md))
- Or: Override NEXT_PUBLIC_VIBES_BACKEND_URL to use the Dev-api (with reasonable caution)

```bash
## We use yarn instead of npm, so install it:
npm install --global yarn

# Install packages
yarn install

# Run development
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Regenerate types

Want to create TypeScript types for new types in the backend? Make sure the backend is running, then go to the `frontend` folder and run

```bash
yarn generate-types
```

Note: The output file (and other parameters) can be changed in the `"generate-types"` script in `package.json`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

See [project root README](../README.md).
