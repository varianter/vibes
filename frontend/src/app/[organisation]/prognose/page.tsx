import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prognose | VIBES",
};

export default async function Prognose({}: {}) {
  return <h1 className="main p-4 pt-5 w-full flex flex-col gap-8">Prognose</h1>;
}
