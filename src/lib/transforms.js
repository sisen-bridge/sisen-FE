const VISUAL_CYCLE = ["labor", "water", "security"];

function pickVisual(topicId) {
  const n = Number(topicId);
  if (!Number.isFinite(n)) return VISUAL_CYCLE[0];
  return VISUAL_CYCLE[Math.abs(n) % VISUAL_CYCLE.length];
}

function normalizeSide(nation) {
  if (!nation) return null;
  const value = String(nation).toLowerCase();
  if (["kr", "ko", "korea", "한국", "south korea"].includes(value)) return "korea";
  if (["jp", "ja", "japan", "日本"].includes(value)) return "japan";
  return null;
}

export function topicToEvent(topic) {
  return {
    id: String(topic.topic_id),
    topicId: topic.topic_id,
    count: 0,
    visual: pickVisual(topic.topic_id),
    headline: {
      ko: topic.ko_neutral_title ?? topic.name ?? "",
      ja: topic.ja_neutral_title ?? topic.name ?? "",
    },
    deck: {
      ko: topic.ko_summary ?? "",
      ja: topic.ja_summary ?? "",
    },
    facts: { ko: [], ja: [] },
    outlets: [],
  };
}

export function articleToOutlet(article) {
  const side = normalizeSide(article.nation) ?? "korea";
  return {
    id: String(article.article_id),
    articleId: article.article_id,
    side,
    outlet: article.press_name ?? "",
    tags: [],
    headline: {
      ko: article.ko_title ?? "",
      ja: article.ja_title ?? "",
    },
    summary: { ko: "", ja: "" },
    url: "",
  };
}

export function mergeArticleDetail(outlet, detail) {
  if (!detail) return outlet;
  return {
    ...outlet,
    url: detail.url ?? outlet.url,
    summary: {
      ko: detail.ko_text ?? outlet.summary.ko,
      ja: detail.ja_text ?? outlet.summary.ja,
    },
    headline: {
      ko: detail.ko_title ?? outlet.headline.ko,
      ja: detail.ja_title ?? outlet.headline.ja,
    },
  };
}
