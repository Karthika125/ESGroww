"use client";

import dynamic from "next/dynamic";
import React from "react";

const LazyConditionalChatbot = dynamic(
  () => import("./ConditionalChatbot").then((m) => m.ConditionalChatbot),
  { ssr: false, loading: () => null }
);

export default function ConditionalChatbotClient() {
  return <LazyConditionalChatbot />;
}
