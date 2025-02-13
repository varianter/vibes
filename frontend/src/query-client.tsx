"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  },
  queryCache: new QueryCache({
    onError: (err) => {
      console.error(err);
    },
  }),
});

export function ReactQueryClientProvider(props: PropsWithChildren) {
  return <QueryClientProvider client={queryClient} {...props} />;
}
