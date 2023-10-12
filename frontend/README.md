This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

See [project root README](../README.md).

## Issues

This seem to be a bug in the MUI package. It is only triggered when importing styled from `@mui/material`:

```ts
import { styled } from "@mui/material";

// As a workaround, I recommend importing { styled } from styles instead:
import { styled } from "@mui/material/styles";
```

https://github.com/vercel/next.js/issues/55663
