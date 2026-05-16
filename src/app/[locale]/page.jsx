"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Eye, Globe2, HelpCircle, RotateCcw, X } from "lucide-react";

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
  },
};

const events = [
  {
    id: "forced-labor-foundation",
    count: 42,
    visual: "labor",
    headline: {
      ko: "한일 강제동원 해법 논의, 피해자 지원 재단을 둘러싼 이견 지속",
      ja: "日韓の徴用問題解決策、被害者支援財団をめぐり見解の違い続く",
    },
    deck: {
      ko: "양국 정부 관계자와 피해자 측은 강제동원 배상 해법의 재원, 사과 표현, 후속 조치 범위를 두고 협의를 이어가고 있다.",
      ja: "両国政府関係者と被害者側は、徴用問題の解決策について財源、謝罪表現、今後の措置を協議している。",
    },
    facts: {
      ko: [
        "한국 정부는 피해자 지원을 위한 재단 중심의 변제 방안을 논의했다.",
        "일본 정부는 1965년 청구권 협정에 대한 기존 입장을 유지하고 있다.",
        "피해자 단체 일부는 일본 기업의 직접 참여와 명확한 사과를 요구하고 있다.",
      ],
      ja: [
        "韓国政府は被害者支援財団を軸にした弁済案を議論している。",
        "日本政府は1965年請求権協定に関する従来の立場を維持している。",
        "一部の被害者団体は日本企業の直接参加と明確な謝罪を求めている。",
      ],
    },
    outlets: [
      {
        id: "kr-1",
        side: "korea",
        outlet: "한겨레",
        tags: ["피해자 동의", "사과 표현", "절차적 정당성"],
        summary: {
          ko: "피해자 중심 원칙이 충분히 반영됐는지에 초점을 맞추며, 외교적 속도보다 당사자 동의와 일본 측 책임 인정의 구체성을 강조한다.",
          ja: "被害者中心の原則が十分反映されたかに焦点を当て、外交的な速度より当事者の同意と日本側の責任認定の具体性を強調する。",
        },
        url: "https://www.hani.co.kr/",
      },
      {
        id: "kr-2",
        side: "korea",
        outlet: "조선일보",
        tags: ["관계 복원", "안보 협력", "미래지향"],
        summary: {
          ko: "한일 관계 복원의 필요성을 전면에 두고, 과거사 갈등 관리가 경제와 안보 협력의 재개 조건이라는 관점으로 설명한다.",
          ja: "日韓関係回復の必要性を前面に置き、歴史問題の管理が経済・安保協力再開の条件だという視点で説明する。",
        },
        url: "https://www.chosun.com/",
      },
      {
        id: "jp-1",
        side: "japan",
        outlet: "朝日新聞",
        tags: ["被害者救済", "歴史認識", "国内反発"],
        summary: {
          ko: "한국 내 피해자 반발과 역사 인식의 긴장을 함께 다루며, 실무 합의가 사회적 수용성을 얻을 수 있는지가 핵심이라고 본다.",
          ja: "韓国内の被害者反発と歴史認識の緊張を扱い、実務合意が社会的受容性を得られるかを核心に置く。",
        },
        url: "https://www.asahi.com/",
      },
      {
        id: "jp-2",
        side: "japan",
        outlet: "読売新聞",
        tags: ["協定尊重", "外交安定", "再発防止"],
        summary: {
          ko: "1965년 협정의 안정성을 강조하고, 한국 정부가 국내 절차를 어떻게 정리하느냐가 관계 개선의 지속성을 좌우한다고 해석한다.",
          ja: "1965年協定の安定性を重視し、韓国政府が国内手続きをどう整理するかが関係改善の持続性を左右すると見る。",
        },
        url: "https://www.yomiuri.co.jp/",
      },
    ],
  },
  {
    id: "fukushima-water",
    count: 37,
    visual: "water",
    headline: {
      ko: "후쿠시마 처리수 방류 점검 결과 공개, 안전성 해석 놓고 보도 차이",
      ja: "福島処理水の点検結果公表、安全性の解釈で報道に差",
    },
    deck: {
      ko: "일본 정부와 국제기구는 방류 기준과 측정치를 공개했고, 한국 정부와 시민단체는 검증 방식과 장기 영향에 대한 설명을 요구하고 있다.",
      ja: "日本政府と国際機関は放出基準と測定値を公表し、韓国政府と市民団体は検証方法と長期影響への説明を求めている。",
    },
    facts: {
      ko: [
        "일본은 원전 처리수를 희석해 해양 방류하는 절차를 진행하고 있다.",
        "국제기구는 기준 충족 여부를 점검하는 보고서를 발표했다.",
        "인접국 여론은 식품 안전과 해양 생태 영향에 민감하게 반응하고 있다.",
      ],
      ja: [
        "日本は原発処理水を希釈して海洋放出する手続きを進めている。",
        "国際機関は基準適合を点検する報告書を発表した。",
        "近隣国の世論は食品安全と海洋生態への影響に敏感に反応している。",
      ],
    },
    outlets: [
      {
        id: "kr-3",
        side: "korea",
        outlet: "경향신문",
        tags: ["장기 영향", "검증 투명성", "소비자 불안"],
        summary: {
          ko: "단기 수치보다 장기 감시 체계와 정보 공개의 신뢰성을 묻고, 시민 불안이 과학 소통의 부족에서 커진다고 본다.",
          ja: "短期数値より長期監視体制と情報公開の信頼性を問い、市民不安は科学コミュニケーション不足で拡大すると見る。",
        },
        url: "https://www.khan.co.kr/",
      },
      {
        id: "kr-4",
        side: "korea",
        outlet: "중앙일보",
        tags: ["기준 충족", "외교 관리", "수산업"],
        summary: {
          ko: "국제 기준과 국내 수산업 피해 관리 사이의 균형을 강조하며, 정부 설명 책임과 시장 안정 대책을 함께 다룬다.",
          ja: "国際基準と国内水産業被害管理の均衡を重視し、政府説明責任と市場安定策をあわせて扱う。",
        },
        url: "https://www.joongang.co.kr/",
      },
      {
        id: "jp-3",
        side: "japan",
        outlet: "NHK",
        tags: ["基準値", "モニタリング", "風評被害"],
        summary: {
          ko: "측정치와 절차 설명을 중심으로 보도하며, 기준 이하 결과와 풍평 피해 대응을 주요 쟁점으로 제시한다.",
          ja: "測定値と手続き説明を中心に報じ、基準以下の結果と風評被害対応を主要論点として提示する。",
        },
        url: "https://www3.nhk.or.jp/news/",
      },
      {
        id: "jp-4",
        side: "japan",
        outlet: "毎日新聞",
        tags: ["説明責任", "漁業者", "近隣国"],
        summary: {
          ko: "정부와 전력회사의 설명 책임을 강조하고, 어업 관계자와 주변국의 신뢰 확보가 방류 정책의 관건이라고 본다.",
          ja: "政府と電力会社の説明責任を強調し、漁業者と近隣国の信頼確保が放出政策の鍵だと見る。",
        },
        url: "https://mainichi.jp/",
      },
    ],
  },
  {
    id: "security-dialogue",
    count: 28,
    visual: "security",
    headline: {
      ko: "한일 안보 대화 재개, 정보 공유와 역사 현안 병행 논의",
      ja: "日韓安保対話再開、情報共有と歴史懸案を並行協議",
    },
    deck: {
      ko: "양국 외교·안보 당국은 역내 긴장 고조에 대응하기 위해 실무 대화를 재개했으며, 국내 정치권은 협력의 범위와 조건을 두고 엇갈린 평가를 내놓고 있다.",
      ja: "両国の外交・安保当局は地域緊張に対応するため実務対話を再開し、国内政界では協力範囲と条件をめぐり評価が分かれている。",
    },
    facts: {
      ko: [
        "양국 당국자는 안보 분야 실무 협의를 열었다.",
        "논의에는 정보 공유, 공급망, 역내 정세가 포함됐다.",
        "역사 문제와 국내 여론은 협력 확대의 제약 요인으로 남아 있다.",
      ],
      ja: [
        "両国当局者は安全保障分野の実務協議を開いた。",
        "議題には情報共有、供給網、地域情勢が含まれた。",
        "歴史問題と国内世論は協力拡大の制約要因として残る。",
      ],
    },
    outlets: [
      {
        id: "kr-5",
        side: "korea",
        outlet: "동아일보",
        tags: ["북핵 대응", "실용 외교", "정보 협력"],
        summary: {
          ko: "북핵과 지역 안보 위험을 중심에 두고, 한일 협력이 선택이 아니라 실용적 필요라는 방향으로 서사를 구성한다.",
          ja: "北朝鮮核と地域安保リスクを中心に、日韓協力は選択ではなく実用的必要だという流れで構成する。",
        },
        url: "https://www.donga.com/",
      },
      {
        id: "kr-6",
        side: "korea",
        outlet: "오마이뉴스",
        tags: ["국내 동의", "역사 현안", "균형 외교"],
        summary: {
          ko: "안보 협력의 필요성을 인정하되, 역사 현안이 정리되지 않은 상태에서 협력이 앞서가는 위험을 강조한다.",
          ja: "安保協力の必要性は認めつつ、歴史懸案が整理されないまま協力が先行する危険を強調する。",
        },
        url: "https://www.ohmynews.com/",
      },
      {
        id: "jp-5",
        side: "japan",
        outlet: "日本経済新聞",
        tags: ["供給網", "米国連携", "経済安保"],
        summary: {
          ko: "안보를 공급망과 기술 협력까지 확장해 다루며, 미국과의 삼각 공조가 경제 안정성에 미치는 의미를 부각한다.",
          ja: "安保を供給網と技術協力まで拡張して扱い、米国との三角連携が経済安定性に持つ意味を強調する。",
        },
        url: "https://www.nikkei.com/",
      },
      {
        id: "jp-6",
        side: "japan",
        outlet: "産経新聞",
        tags: ["抑止力", "同盟網", "対北朝鮮"],
        summary: {
          ko: "억지력과 동맹 네트워크 강화를 핵심으로 제시하며, 한국의 정책 지속성이 일본의 신뢰 판단 기준이라고 본다.",
          ja: "抑止力と同盟網強化を核心に据え、韓国政策の持続性が日本側の信頼判断基準だと見る。",
        },
        url: "https://www.sankei.com/",
      },
    ],
  },
];

const koreanOutletSeeds = [
  { outlet: "한겨레", url: "https://www.hani.co.kr/" },
  { outlet: "경향신문", url: "https://www.khan.co.kr/" },
  { outlet: "중앙일보", url: "https://www.joongang.co.kr/" },
  { outlet: "조선일보", url: "https://www.chosun.com/" },
  { outlet: "동아일보", url: "https://www.donga.com/" },
];

const japaneseOutletSeeds = [
  { outlet: "朝日新聞", url: "https://www.asahi.com/" },
  { outlet: "毎日新聞", url: "https://mainichi.jp/" },
  { outlet: "読売新聞", url: "https://www.yomiuri.co.jp/" },
  { outlet: "NHK", url: "https://www3.nhk.or.jp/news/" },
  { outlet: "日本経済新聞", url: "https://www.nikkei.com/" },
];

const extraEventSeeds = [
  ["trade-minerals", 31, "security", "핵심 광물 공급망 협의 확대, 경제안보 보도 온도차", "重要鉱物の供給網協議拡大、経済安保報道に温度差"],
  ["student-exchange", 26, "labor", "한일 청년 교류 재개 움직임, 역사 교육 논의와 함께 주목", "日韓青年交流再開の動き、歴史教育議論とともに注目"],
  ["fishery-inspection", 24, "water", "수산물 검사 강화 발표, 소비자 불안과 지역 경제 영향 부각", "水産物検査強化を発表、消費者不安と地域経済への影響が焦点"],
  ["visa-tourism", 22, "labor", "관광 회복세 속 비자·항공 노선 확대를 둘러싼 기대감", "観光回復の中でビザ・航空路線拡大への期待感"],
  ["semiconductor-export", 19, "security", "반도체 수출 규제 완화 후속 조치, 기업 협력 전망 엇갈려", "半導体輸出規制緩和の後続措置、企業協力の見通し分かれる"],
  ["heritage-return", 17, "labor", "문화재 반환 협의 재점화, 공동 조사 방식 두고 시각차", "文化財返還協議が再燃、共同調査方式をめぐり見方に差"],
  ["climate-summit", 15, "water", "기후 정상회의 공동 의제 조율, 에너지 전환 해법에 관심", "気候首脳会議の共同議題調整、エネルギー転換策に関心"],
];

function createGeneratedEvent([id, count, visual, koHeadline, jaHeadline]) {
  return {
    id,
    count,
    visual,
    headline: {
      ko: koHeadline,
      ja: jaHeadline,
    },
    deck: {
      ko: "양국 정부와 관련 단체는 현안의 실무 조정과 사회적 수용성을 함께 검토하고 있으며, 언론은 책임과 협력의 균형을 다르게 해석하고 있다.",
      ja: "両国政府と関係団体は実務調整と社会的受容性を検討しており、報道は責任と協力の均衡を異なる角度から解釈している。",
    },
    facts: {
      ko: [
        "양국 관계자가 실무 협의를 이어가고 있다.",
        "정책 효과와 국내 여론을 둘러싼 해석이 함께 제기됐다.",
        "후속 조치의 범위와 속도는 추가 논의가 필요한 상태다.",
      ],
      ja: [
        "両国関係者は実務協議を続けている。",
        "政策効果と国内世論をめぐる解釈があわせて示された。",
        "今後の措置の範囲と速度には追加協議が必要な状況だ。",
      ],
    },
    outlets: [],
  };
}

function makeOutlet(event, side, seed, index) {
  const korean = side === "korea";

  return {
    id: `${event.id}-${side}-${index + 1}`,
    side,
    outlet: seed.outlet,
    tags: korean
      ? ["국내 여론", "정책 책임", "후속 조치"]
      : ["政府対応", "地域影響", "継続協議"],
    summary: {
      ko: korean
        ? `${seed.outlet}는 국내 여론과 정책 책임을 중심으로 ${event.headline.ko} 이슈를 해석한다.`
        : `${seed.outlet}는 정부 대응과 지역 영향을 중심으로 ${event.headline.ko} 이슈를 해석한다.`,
      ja: korean
        ? `${seed.outlet}は国内世論と政策責任を中心に「${event.headline.ja}」を解釈する。`
        : `${seed.outlet}は政府対応と地域影響を中心に「${event.headline.ja}」を解釈する。`,
    },
    url: seed.url,
  };
}

function normalizeEventOutlets(event) {
  const normalizeSide = (side, seeds) => {
    const existing = event.outlets.filter((outlet) => outlet.side === side).slice(0, 5);
    const existingNames = new Set(existing.map((outlet) => outlet.outlet));
    const additions = seeds
      .filter((seed) => !existingNames.has(seed.outlet))
      .map((seed, index) => makeOutlet(event, side, seed, existing.length + index));

    return [...existing, ...additions].slice(0, 5);
  };

  return {
    ...event,
    outlets: [
      ...normalizeSide("korea", koreanOutletSeeds),
      ...normalizeSide("japan", japaneseOutletSeeds),
    ],
  };
}

function createTopTenEvents(baseEvents) {
  return [...baseEvents, ...extraEventSeeds.map(createGeneratedEvent)]
    .slice(0, 10)
    .map(normalizeEventOutlets);
}

export default function App() {
  const [language, setLanguage] = useState("ko");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const t = copy[language];

  const orderedEvents = useMemo(() => createTopTenEvents(events), []);

  const activeEvent = selectedEvent ?? orderedEvents[activeIndex] ?? events[0];

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

        <ProgressDots total={10} current={activeIndex} maxCurrent={orderedEvents.length - 1} />

        <SwipeDeck
          events={orderedEvents}
          activeIndex={activeIndex}
          language={language}
          t={t}
          onOpen={setSelectedEvent}
          onNavigate={setActiveIndex}
          onReset={() => setActiveIndex(0)}
          fallbackEvent={activeEvent}
        />
      </section>
    </main>
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
  const [drag, setDrag] = useState({
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    active: false,
    pointerId: null,
  });
  const topEvent = events[activeIndex];
  const visibleEvents = [0, 1, 2]
    .map((offset) => events[activeIndex + offset])
    .filter(Boolean);

  function beginDrag(event) {
    if (!topEvent) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDrag({
      x: 0,
      y: 0,
      startX: event.clientX,
      startY: event.clientY,
      active: true,
      pointerId: event.pointerId,
    });
  }

  function moveDrag(event) {
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    setDrag((prev) => ({
      ...prev,
      x: event.clientX - prev.startX,
      y: event.clientY - prev.startY,
    }));
  }

  function endDrag(event) {
    if (!drag.active || !topEvent || event.pointerId !== drag.pointerId) return;
    const moved = Math.abs(drag.x) > 10 || Math.abs(drag.y) > 10;
    if (drag.x > 110) {
      onNavigate(Math.min(activeIndex + 1, events.length - 1));
    } else if (drag.x < -110) {
      onNavigate(Math.max(activeIndex - 1, 0));
    } else if (!moved) {
      onOpen(topEvent);
    }
    setDrag({ x: 0, y: 0, startX: 0, startY: 0, active: false, pointerId: null });
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
    <div className="deck">
      {visibleEvents.map((event, index) => {
        const isTop = index === 0;
        const style = isTop
          ? {
              transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 20}deg)`,
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
                      y: 0,
                      startX: 0,
                      startY: 0,
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
      <p className="deck-copy">{event.deck[language]}</p>
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
  const [openCard, setOpenCard] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const koreanOutlets = event.outlets.filter((item) => item.side === "korea");
  const japaneseOutlets = event.outlets.filter((item) => item.side === "japan");
  const selectedOutlet = event.outlets.find((item) => item.id === openCard);
  const selectedOutletIndex = selectedOutlet
    ? (selectedOutlet.side === "korea" ? koreanOutlets : japaneseOutlets).findIndex(
        (item) => item.id === selectedOutlet.id,
      ) + 1
    : 0;

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
        <div>
          <Globe2 size={18} />
          <span>{event.count} clustered articles</span>
        </div>
      </section>

      <section className="consensus-strip">
        <h2>{t.consensus}</h2>
        <div>
          {event.facts[language].map((fact) => (
            <p key={fact}>{fact}</p>
          ))}
        </div>
      </section>

      <section className="map-stage" aria-label="Korea Japan narrative map">
        <div className="map-image" aria-hidden="true" />
        <button
          className="icon-label-button reveal-outlets-button"
          onClick={() => setRevealed((value) => !value)}
        >
          <Eye size={18} />
          {revealed ? t.hide : t.reveal}
        </button>
        <OutletCluster
          title={t.korea}
          className="korea-cluster"
          outlets={koreanOutlets}
          language={language}
          revealed={revealed}
          openCard={openCard}
          setOpenCard={setOpenCard}
          t={t}
        />
        <OutletCluster
          title={t.japan}
          className="japan-cluster"
          outlets={japaneseOutlets}
          language={language}
          revealed={revealed}
          openCard={openCard}
          setOpenCard={setOpenCard}
          t={t}
        />
      </section>

      {selectedOutlet && (
        <div className="narrative-modal-backdrop" role="presentation" onClick={() => setOpenCard(null)}>
          <article
            className="narrative-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="narrative-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-x-button"
              aria-label={t.close}
              onClick={() => setOpenCard(null)}
            >
              <X size={16} />
            </button>
            <span className="source-name">
              {revealed ? selectedOutlet.outlet : `Source ${selectedOutletIndex}`}
            </span>
            <h2 id="narrative-modal-title">{selectedOutlet.tags[0]}</h2>
            <small>{selectedOutlet.tags.slice(1).join(" · ")}</small>
            <p>{selectedOutlet.summary[language]}</p>
            <div>
              <a href={selectedOutlet.url} target="_blank" rel="noreferrer">
                <ExternalLink size={16} />
                {t.full}
              </a>
              <button onClick={() => setOpenCard(null)}>
                <X size={16} />
                {t.close}
              </button>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}

function OutletCluster({ title, className, outlets, language, revealed, openCard, setOpenCard, t }) {
  return (
    <div className={`outlet-cluster ${className}`}>
      <h2>{title}</h2>
      {outlets.map((outlet, index) => {
        const isOpen = openCard === outlet.id;
        return (
          <article key={outlet.id} className={`outlet-card ${isOpen ? "open" : ""}`}>
            <button onClick={() => setOpenCard(isOpen ? null : outlet.id)}>
              <span className="source-name">{revealed ? outlet.outlet : `Source ${index + 1}`}</span>
              <strong>{outlet.tags[0]}</strong>
              <small>{outlet.tags.slice(1).join(" · ")}</small>
            </button>
            {isOpen && (
              <div className="expanded-narrative">
                <p>{outlet.summary[language]}</p>
                <div>
                  <a href={outlet.url} target="_blank" rel="noreferrer">
                    <ExternalLink size={16} />
                    {t.full}
                  </a>
                  <button onClick={() => setOpenCard(null)}>
                    <X size={16} />
                    {t.close}
                  </button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
