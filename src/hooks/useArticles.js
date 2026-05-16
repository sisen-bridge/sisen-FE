"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "@/lib/api";
import { articleToOutlet } from "@/lib/transforms";

export function useArticles(topicId) {
  return useQuery({
    queryKey: ["articles", topicId],
    queryFn: () => fetchArticles(topicId),
    enabled: topicId != null,
    select: (articles) => articles.map(articleToOutlet),
  });
}
