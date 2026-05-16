"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchArticle } from "@/lib/api";

export function useArticle(articleId) {
  return useQuery({
    queryKey: ["article", articleId],
    queryFn: () => fetchArticle(articleId),
    enabled: articleId != null,
  });
}
