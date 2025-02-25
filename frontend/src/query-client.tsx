"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export function ReactQueryClientProvider(props: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
        queryCache: new QueryCache({
          onError: (err) => {
            console.error(err);
          },
        }),
      }),
  );
  return <QueryClientProvider client={queryClient} {...props} />;
}
