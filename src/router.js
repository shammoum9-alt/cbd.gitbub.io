import React from "react";

export default function Router({ tab, routes }) {
  const Page = routes[tab];

  if (!Page) return <div>Page introuvable</div>;

  return <Page />;
}