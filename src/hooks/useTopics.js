"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/api";
import { topicToEvent } from "@/lib/transforms";

export function useTopics() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
    select: (topics) => topics.map(topicToEvent),
  });
}
