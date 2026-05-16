const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const API_BASE = RAW_BASE.replace(/\/$/, "");

async function request(path, init) {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
  });
  if (!response.ok) {
    throw new Error(`API ${response.status} ${response.statusText} at ${path}`);
  }
  return response.json();
}

export function fetchTopics() {
  return request("/topics");
}

export function fetchArticles(topicId) {
  const params = new URLSearchParams({ topicId: String(topicId) });
  return request(`/articles?${params.toString()}`);
}

export function fetchArticle(articleId) {
  const params = new URLSearchParams({ articleId: String(articleId) });
  return request(`/article?${params.toString()}`);
}
