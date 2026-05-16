"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Globe2,
  HelpCircle,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { useTopics } from "@/hooks/useTopics";
import { useArticles } from "@/hooks/useArticles";
import { useArticle } from "@/hooks/useArticle";
import { mergeArticleDetail } from "@/lib/transforms";

const copy = {
  ko: {
    exit: "나가기",
    date: "05월 16일 토요일",
    title: "시선 TOP10",
    window: "최근 10시간 동안 묶인 주요뉴스",
    tap: "카드를 눌러 양국 보도 관점을 비교하세요",
    back: "목록",
    consensus: "합의된 사실",
    korea: "한국 보도",
    japan: "일본 보도",
    reveal: "언론사 보기",
    hide: "언론사 숨기기",
    full: "원문 보기",
    neutral: "중립 헤드라인",
    reset: "다시 보기",
    close: "닫기",
    loading: "불러오는 중...",
    empty: "표시할 뉴스가 없습니다",
    error: "데이터를 불러오지 못했습니다",
    articles: "건의 묶인 기사",
  },
  ja: {
    exit: "閉じる",
    date: "5月16日 土曜日",
    title: "視線 TOP10",
    window: "直近10時間で集約した主要ニュース",
    tap: "カードを選んで両国報道の視点を比較",
    back: "一覧",
    consensus: "合意された事実",
    korea: "韓国報道",
    japan: "日本報道",
    reveal: "媒体名を表示",
    hide: "媒体名を隠す",
    full: "原文を見る",
    neutral: "中立見出し",
    reset: "もう一度見る",
    close: "閉じる",
    loading: "読み込み中...",
    empty: "表示するニュースがありません",
    error: "データを取得できませんでした",
    articles: "件の集約記事",
  },
};

const suggestedSearches = {
  ko: [
    "라인야후 지분 조정",
    "후쿠시마 오염수 방류",
    "한일 정상회담",
    "독도 표기 논란",
    "강제징용 배상 판결",
    "엔저와 한국 관광",
  ],
  ja: [
    "LINEヤフー資本見直し",
    "福島処理水放出",
    "日韓首脳会談",
    "竹島表記問題",
    "徴用工判決",
    "円安と韓国旅行",
  ],
};

function getOutletHeadline(outlet, language) {
  return (
    outlet.headline?.[language] ??
    outlet.headline?.ko ??
    outlet.tags?.[0] ??
    outlet.outlet
  );
}

export default function App() {
  const [language, setLanguage] = useState("ko");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const t = copy[language];

  const { data: events = [], isLoading, isError, error } = useTopics();

  useEffect(() => {
    if (activeIndex > events.length - 1) {
      setActiveIndex(0);
    }
  }, [events.length, activeIndex]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    function closeSearchOnOutsidePress(event) {
      if (searchRef.current?.contains(event.target)) return;
      setIsSearchOpen(false);
    }

    document.addEventListener("pointerdown", closeSearchOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeSearchOnOutsidePress);
  }, [isSearchOpen]);

  if (selectedEvent) {
    return (
      <NarrativeMap
        event={selectedEvent}
        language={language}
        t={t}
        onBack={() => setSelectedEvent(null)}
      />
    );
  }

  return (
    <main className="phone-shell">
      <section className="home-screen">
        <header className="top-bar">
          <div className="brand-mark">
            <img src="/shisen-logo.png" alt="" aria-hidden="true" />
            <span>Shisen</span>
            <small>시선 / 視線</small>
          </div>

          {isSearchOpen && (
            <button
              type="button"
              className="search-fade"
              aria-label="close search suggestions"
              onClick={() => setIsSearchOpen(false)}
            />
          )}

          <div ref={searchRef} className={`header-search ${isSearchOpen ? "open" : ""}`}>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={language === "ko" ? "한일 이슈 검색" : "日韓イシュー検索"}
              aria-label={language === "ko" ? "한일 이슈 검색" : "日韓イシュー検索"}
            />
            <Search size={24} strokeWidth={3} aria-hidden="true" />
            {isSearchOpen && (
              <div className="search-suggestions" role="listbox">
                {suggestedSearches[language].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setSearchQuery(term);
                      setIsSearchOpen(false);
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="language-switch" aria-label="language selector">
            <button className={language === "ko" ? "active" : ""} onClick={() => setLanguage("ko")}>
              한국어
            </button>
            <button className={language === "ja" ? "active" : ""} onClick={() => setLanguage("ja")}>
              日本語
            </button>
          </div>
        </header>

        <div className="headline-block">
          <p>{t.date}</p>
          <h1>{t.title}</h1>
          <span className="info-pill">
            <HelpCircle size={18} />
            {t.window}
          </span>
        </div>

        <DeckSection
          events={events}
          isLoading={isLoading}
          isError={isError}
          error={error}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          language={language}
          t={t}
          onOpen={setSelectedEvent}
        />
      </section>
    </main>
  );
}

function DeckSection({
  events,
  isLoading,
  isError,
  error,
  activeIndex,
  setActiveIndex,
  language,
  t,
  onOpen,
}) {
  if (isLoading) {
    return <p className="deck-status">{t.loading}</p>;
  }
  if (isError) {
    return (
      <p className="deck-status deck-status-error">
        {t.error}
        {error?.message ? <small>{error.message}</small> : null}
      </p>
    );
  }
  if (events.length === 0) {
    return <p className="deck-status">{t.empty}</p>;
  }

  const maxCurrent = Math.max(events.length - 1, 0);

  return (
    <>
      <ProgressDots total={events.length} current={activeIndex} maxCurrent={maxCurrent} />
      <SwipeDeck
        events={events}
        activeIndex={activeIndex}
        language={language}
        t={t}
        onOpen={onOpen}
        onNavigate={setActiveIndex}
        onReset={() => setActiveIndex(0)}
        fallbackEvent={events[activeIndex] ?? events[0]}
      />
    </>
  );
}

function ProgressDots({ total, current, maxCurrent }) {
  const denominator = Math.max(maxCurrent, 1);
  const progress = Math.min(current / denominator, 1);

  return (
    <div
      className="progress-bar"
      aria-label={`${current + 1} / ${total}`}
      style={{ "--progress": progress }}
    >
      <span />
    </div>
  );
}

function SwipeDeck({
  events,
  activeIndex,
  language,
  t,
  onOpen,
  onNavigate,
  onReset,
  fallbackEvent,
}) {
  const SWIPE_THRESHOLD = 48;
  const DRAG_LIMIT = 82;
  const [drag, setDrag] = useState({
    x: 0,
    startX: 0,
    active: false,
    pointerId: null,
  });
  const topEvent = events[activeIndex];
  const hasMeaningfulDrag = drag.active && Math.abs(drag.x) > 8;
  const targetIndex = drag.x < 0 ? activeIndex - 1 : activeIndex + 1;
  const previewEvent =
    hasMeaningfulDrag && events[targetIndex]
      ? events[targetIndex]
      : events[activeIndex + 1];
  const visibleEvents = [
    topEvent,
    previewEvent,
    events[activeIndex + 2],
  ].filter(
    (event, index, self) =>
      event && self.findIndex((item) => item?.id === event.id) === index,
  );

  function beginDrag(event) {
    if (!topEvent) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDrag({
      x: 0,
      startX: event.clientX,
      active: true,
      pointerId: event.pointerId,
    });
  }

  function moveDrag(event) {
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    setDrag((prev) => ({
      ...prev,
      x: Math.max(
        -DRAG_LIMIT,
        Math.min(DRAG_LIMIT, event.clientX - prev.startX),
      ),
    }));
  }

  function endDrag(event) {
    if (!drag.active || !topEvent || event.pointerId !== drag.pointerId) return;
    const moved = Math.abs(drag.x) > 10;
    if (drag.x > SWIPE_THRESHOLD) {
      onNavigate(Math.min(activeIndex + 1, events.length - 1));
    } else if (drag.x < -SWIPE_THRESHOLD) {
      onNavigate(Math.max(activeIndex - 1, 0));
    } else if (!moved) {
      onOpen(topEvent);
    }
    setDrag({ x: 0, startX: 0, active: false, pointerId: null });
  }

  if (!topEvent) {
    return (
      <div className="empty-deck">
        <NewsCard event={fallbackEvent} language={language} t={t} muted />
        <button className="round-action" onClick={onReset}>
          <RotateCcw size={18} />
          {t.reset}
        </button>
      </div>
    );
  }

  return (
    <div className={`deck ${drag.active ? "dragging" : ""}`}>
      {visibleEvents.map((event, index) => {
        const isTop = index === 0;
        const style = isTop
          ? {
              transform: `translateX(${drag.x}px) rotate(${drag.x / 28}deg)`,
              transition: drag.active ? "none" : undefined,
            }
          : undefined;

        return (
          <div
            key={event.id}
            role={isTop ? "button" : "presentation"}
            tabIndex={isTop ? 0 : -1}
            className={`deck-card layer-${index}`}
            style={style}
            onPointerDown={isTop ? beginDrag : undefined}
            onPointerMove={isTop ? moveDrag : undefined}
            onPointerUp={isTop ? endDrag : undefined}
            onPointerCancel={
              isTop
                ? () =>
                    setDrag({
                      x: 0,
                      startX: 0,
                      active: false,
                      pointerId: null,
                    })
                : undefined
            }
            onKeyDown={(keyboardEvent) => {
              if (!isTop) return;
              if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                keyboardEvent.preventDefault();
                onOpen(event);
              }
              if (keyboardEvent.key === "ArrowLeft") {
                onNavigate(Math.max(activeIndex - 1, 0));
              }
              if (keyboardEvent.key === "ArrowRight") {
                onNavigate(Math.min(activeIndex + 1, events.length - 1));
              }
            }}
          >
            <NewsCard event={event} language={language} t={t} />
          </div>
        );
      })}
    </div>
  );
}

function NewsCard({ event, language, t, muted = false }) {
  return (
    <article className={`news-card ${muted ? "muted" : ""}`}>
      <h2>{event.headline[language]}</h2>
      <IncidentVisual type={event.visual} />
      {event.deck[language] ? <p className="deck-copy">{event.deck[language]}</p> : null}
      <p className="tap-copy">{t.tap}</p>
    </article>
  );
}

function IncidentVisual({ type }) {
  return (
    <div className={`incident-image visual-${type}`} aria-hidden="true">
      <div className="visual-sky" />
      <div className="visual-building visual-building-a" />
      <div className="visual-building visual-building-b" />
      <div className="visual-line" />
      <div className="visual-person primary" />
      <div className="visual-person secondary" />
    </div>
  );
}

function NarrativeMap({ event, language, t, onBack }) {
  const [openOutletId, setOpenOutletId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const { data: outlets = [], isLoading, isError, error } = useArticles(event.topicId);

  const koreanOutlets = outlets.filter((item) => item.side === "korea");
  const japaneseOutlets = outlets.filter((item) => item.side === "japan");
  const selectedOutlet = outlets.find((item) => item.id === openOutletId);
  const selectedOutletIndex = selectedOutlet
    ? (selectedOutlet.side === "korea" ? koreanOutlets : japaneseOutlets).findIndex(
        (item) => item.id === selectedOutlet.id,
      ) + 1
    : 0;

  const facts = event.facts?.[language] ?? [];

  return (
    <main className="map-shell">
      <header className="map-header">
        <button className="icon-label-button" onClick={onBack}>
          <ArrowLeft size={18} />
          {t.back}
        </button>
      </header>

      <section className="map-intro">
        <p>{t.neutral}</p>
        <h1>{event.headline[language]}</h1>
        {event.deck[language] ? (
          <p className="map-summary">{event.deck[language]}</p>
        ) : null}
        <div>
          <Globe2 size={18} />
          <span>
            {outlets.length} {t.articles}
          </span>
        </div>
      </section>

      {facts.length > 0 && (
        <section className="consensus-strip">
          <h2>{t.consensus}</h2>
          <div>
            {facts.map((fact) => (
              <p key={fact}>{fact}</p>
            ))}
          </div>
        </section>
      )}

      <section className="map-stage" aria-label="Korea Japan narrative map">
        <div className="map-image" aria-hidden="true" />
        <button
          className="icon-label-button reveal-outlets-button"
          onClick={() => setRevealed((value) => !value)}
        >
          <Eye size={18} />
          {revealed ? t.hide : t.reveal}
        </button>

        {isLoading && <p className="map-status">{t.loading}</p>}
        {isError && (
          <p className="map-status map-status-error">
            {t.error}
            {error?.message ? <small>{error.message}</small> : null}
          </p>
        )}

        <OutletCluster
          title={t.korea}
          className="korea-cluster"
          outlets={koreanOutlets}
          language={language}
          revealed={revealed}
          openCard={openOutletId}
          setOpenCard={setOpenOutletId}
          t={t}
        />
        <OutletCluster
          title={t.japan}
          className="japan-cluster"
          outlets={japaneseOutlets}
          language={language}
          revealed={revealed}
          openCard={openOutletId}
          setOpenCard={setOpenOutletId}
          t={t}
        />
      </section>

      {selectedOutlet && (
        <OutletDetailModal
          outlet={selectedOutlet}
          language={language}
          t={t}
          revealed={revealed}
          index={selectedOutletIndex}
          onClose={() => setOpenOutletId(null)}
        />
      )}
    </main>
  );
}

function OutletCluster({
  title,
  className,
  outlets,
  language,
  revealed,
  openCard,
  setOpenCard,
  t,
}) {
  return (
    <div className={`outlet-cluster ${className}`}>
      <h2>{title}</h2>
      {outlets.map((outlet, index) => {
        const isOpen = openCard === outlet.id;
        return (
          <article key={outlet.id} className={`outlet-card ${isOpen ? "open" : ""}`}>
            <button onClick={() => setOpenCard(isOpen ? null : outlet.id)}>
              <span className="source-name">
                {revealed ? outlet.outlet : `Source ${index + 1}`}
              </span>
              <strong>{getOutletHeadline(outlet, language)}</strong>
            </button>
            {isOpen && (
              <OutletAccordion
                outlet={outlet}
                language={language}
                t={t}
                onClose={() => setOpenCard(null)}
              />
            )}
          </article>
        );
      })}
    </div>
  );
}

function OutletAccordion({ outlet, language, t, onClose }) {
  const { data: detail, isLoading } = useArticle(outlet.articleId);
  const enriched = useMemo(() => mergeArticleDetail(outlet, detail), [outlet, detail]);
  const summary = enriched.summary[language];

  return (
    <div className="expanded-narrative">
      <p>{summary || (isLoading ? t.loading : "")}</p>
      <div>
        {enriched.url ? (
          <a href={enriched.url} target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            {t.full}
          </a>
        ) : null}
        <button onClick={onClose}>
          <X size={16} />
          {t.close}
        </button>
      </div>
    </div>
  );
}

function OutletDetailModal({ outlet, language, t, revealed, index, onClose }) {
  const { data: detail, isLoading } = useArticle(outlet.articleId);
  const enriched = useMemo(() => mergeArticleDetail(outlet, detail), [outlet, detail]);

  return (
    <div className="narrative-modal-backdrop" role="presentation" onClick={onClose}>
      <article
        className="narrative-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="narrative-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-x-button" aria-label={t.close} onClick={onClose}>
          <X size={16} />
        </button>
        <span className="source-name">
          {revealed ? enriched.outlet : `Source ${index}`}
        </span>
        <h2 id="narrative-modal-title">{getOutletHeadline(enriched, language)}</h2>
        <p>
          {enriched.summary[language] || (isLoading ? t.loading : "")}
        </p>
        <div>
          {enriched.url ? (
            <a href={enriched.url} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              {t.full}
            </a>
          ) : null}
          <button onClick={onClose}>
            <X size={16} />
            {t.close}
          </button>
        </div>
      </article>
    </div>
  );
}
