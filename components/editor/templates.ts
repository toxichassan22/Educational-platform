import { ENode, PageDoc, uid } from "./model";

const n = (
  type: ENode["type"],
  props: Record<string, string | number | boolean> = {},
  children?: ENode[],
): ENode => ({
  id: uid(),
  type,
  props,
  children:
    children ??
    (["page", "section", "container", "card", "nav", "footer", "ctaBanner"].includes(type)
      ? []
      : undefined),
});

const IMG = {
  notes: "https://placehold.co/640x400/111827/60a5fa?text=Notes",
  tests: "https://placehold.co/640x400/1e1b4b/a78bfa?text=Tests",
  chat: "https://placehold.co/640x400/0f172a/34d399?text=Chat",
  packages: "https://placehold.co/640x400/172554/60a5fa?text=Packages",
  yousef: "https://placehold.co/400x480/1e1b4b/c4b5fd?text=100",
  saleem: "https://placehold.co/400x480/172554/93c5fd?text=100",
  jumana: "https://placehold.co/400x480/3b0764/d8b4fe?text=99.99",
  leen: "https://placehold.co/400x320/0f172a/93c5fd?text=100%25",
  top10: "https://placehold.co/480x320/0f172a/60a5fa?text=Top",
  watermelon: "https://placehold.co/240x200/1a6ef5/ffffff?text=UULA",
  graduation: "https://placehold.co/160x160/12182b/60a5fa?text=Uni",
  aptitude: "https://placehold.co/160x160/12182b/60a5fa?text=Qiyas",
  teacher1: "https://placehold.co/480x360/1e293b/94a3b8?text=T1",
  teacher2: "https://placehold.co/480x360/1e293b/94a3b8?text=T2",
  teacher3: "https://placehold.co/480x360/1e293b/94a3b8?text=T3",
};

const NAV = () =>
  n("nav", {
    brand: "UULA",
    links: "الرئيسية,العروض,الطلبة الأوائل,أولياء الأمور",
    cta: "ادخل",
    bg: "rgba(7,11,22,.95)",
    px: 40,
    pt: 16,
    pb: 16,
    display: "flex",
    items: "center",
    justify: "space-between",
    color: "#fff",
  });

const FOOTER = () =>
  n("footer", {
    bg: "#05080f",
    pt: 48,
    pb: 28,
    px: 40,
    text: "علا شركة كويتية مقرها في مدينة الكويت · © 2026 علا جميع الحقوق محفوظة",
    links: "الشروط,الخصوصية,العروض,أولياء الأمور,الطلبة الأوائل",
    color: "#5f6370",
    align: "center",
    fontSize: 13,
  });

const CTA = (text = "استكشف المواد") =>
  n("button", {
    text,
    href: "#",
    bg: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    radius: 999,
    p: 14,
    pxBtn: 32,
    fontSize: 15,
    fontWeight: 800,
    boxShadow: "0 8px 28px rgba(37,99,235,.4)",
  });

const AWARD_STRIP = () =>
  n(
    "section",
    {
      bg: "linear-gradient(180deg,#0a1020,#0c1428)",
      pt: 36,
      pb: 36,
      px: 24,
      display: "flex",
      flexDir: "column",
      items: "center",
      gap: 20,
      border: "0",
    },
    [
      n("heading", {
        text: "10 سنين من الإنجازات والتفوق",
        tag: "h3",
        fontSize: 18,
        fontWeight: 800,
        color: "#e2e8f0",
        align: "center",
      }),
      n(
        "container",
        {
          maxW: "960px",
          w: "100%",
          display: "flex",
          flexDir: "row",
          items: "center",
          justify: "space-around",
          gap: 16,
          wrap: true,
        },
        [
          n("award", { title: "الطلبة الأوائل", desc: "أوائل الخريجين", icon: "🥇", color: "#e2e8f0" }),
          n("award", { title: "جائزة Red Dot", desc: "للابتكار", icon: "🔴", color: "#e2e8f0" }),
          n("award", { title: "Avg. Rating 4.8", desc: "من 5 نجوم", icon: "⭐", color: "#e2e8f0" }),
          n("award", { title: "أفضل منصة تعليم", desc: "EdTech Digest", icon: "🏆", color: "#e2e8f0" }),
        ],
      ),
    ],
  );

const featureRow = (opts: {
  title: string;
  desc: string;
  bg: string;
  side: "right" | "left";
  art: string;
  chips?: string[];
  cta?: string;
}): ENode => {
  const textCol = n(
    "container",
    {
      w: "48%",
      display: "flex",
      flexDir: "column",
      items: opts.side === "right" ? "flex-start" : "flex-end",
      gap: 18,
      align: opts.side === "right" ? "right" : "left",
    },
    [
      n("heading", {
        text: opts.title,
        tag: "h2",
        fontSize: 36,
        fontWeight: 900,
        color: "#fff",
        align: opts.side === "right" ? "right" : "left",
        lineHeight: 1.35,
      }),
      n("text", {
        text: opts.desc,
        fontSize: 17,
        color: "#8b95a9",
        lineHeight: 1.85,
        align: opts.side === "right" ? "right" : "left",
      }),
      CTA(opts.cta ?? "استكشف المواد"),
    ],
  );

  const chips = (opts.chips ?? []).map((c, i) =>
    n("badge", {
      text: c,
      bg: i % 2 === 0 ? "rgba(34,197,94,.18)" : "rgba(59,130,246,.18)",
      color: i % 2 === 0 ? "#4ade80" : "#60a5fa",
      radius: 999,
      p: 8,
      px: 14,
      fontSize: 13,
      fontWeight: 700,
      position: "absolute",
      top: 20 + i * 48,
      right: opts.side === "right" ? "auto" : 16,
      left: opts.side === "right" ? 16 : "auto",
      z: 2,
      boxShadow: "0 6px 20px rgba(0,0,0,.35)",
    }),
  );

  const artCol = n(
    "container",
    {
      w: "48%",
      display: "flex",
      items: "center",
      justify: "center",
      position: "relative",
      minH: "300px",
    },
    [
      n("image", {
        src: opts.art,
        alt: opts.title,
        w: "100%",
        radius: 24,
        objectFit: "cover",
        boxShadow: "0 30px 60px rgba(0,0,0,.4)",
      }),
      ...chips,
    ],
  );

  return n(
    "section",
    {
      bg: opts.bg,
      pt: 72,
      pb: 72,
      px: 32,
      display: "flex",
      flexDir: "column",
      items: "center",
      position: "relative",
      overflow: "hidden",
    },
    [
      n(
        "container",
        {
          maxW: "1160px",
          w: "100%",
          display: "flex",
          flexDir: "row",
          items: "center",
          justify: "space-between",
          gap: 56,
          wrap: true,
        },
        opts.side === "right" ? [textCol, artCol] : [artCol, textCol],
      ),
    ],
  );
};

function homePage(): PageDoc {
  const root = n(
    "page",
    { bg: "#070b16", minH: "100vh", display: "flex", flexDir: "column" },
    [
      NAV(),

      // ===== HERO =====
      n(
        "section",
        {
          bg: "radial-gradient(ellipse 80% 70% at 70% 20%, rgba(37,99,235,.28), transparent 60%), linear-gradient(180deg,#070b16 0%,#0a1230 55%,#070b16 100%)",
          pt: 80,
          pb: 80,
          px: 40,
          display: "flex",
          flexDir: "column",
          items: "center",
          position: "relative",
          overflow: "hidden",
        },
        [
          n("decor", { content: "✦", fontSize: 28, color: "rgba(96,165,250,.45)", position: "absolute", top: 60, left: "12%", z: 0 }),
          n("decor", { content: "✧", fontSize: 20, color: "rgba(251,191,36,.4)", position: "absolute", top: 120, right: "18%", z: 0 }),
          n("decor", { content: "●", fontSize: 10, color: "rgba(96,165,250,.5)", position: "absolute", bottom: 80, left: "30%", z: 0 }),

          n(
            "container",
            {
              maxW: "1160px",
              w: "100%",
              display: "flex",
              flexDir: "row",
              items: "center",
              justify: "space-between",
              gap: 48,
              wrap: true,
              position: "relative",
              z: 1,
            },
            [
              // left visual — score medallion (uula hero)
              n(
                "container",
                {
                  w: "46%",
                  display: "flex",
                  flexDir: "column",
                  items: "center",
                  gap: 16,
                  position: "relative",
                  minH: "400px",
                  justify: "center",
                },
                [
                  n(
                    "card",
                    {
                      bg: "radial-gradient(circle at 35% 30%, #1e40af 0%, #0f172a 78%)",
                      radius: 999,
                      p: 36,
                      w: "340px",
                      h: "340px",
                      items: "center",
                      display: "flex",
                      flexDir: "column",
                      justify: "center",
                      gap: 10,
                      boxShadow: "0 0 100px rgba(37,99,235,.45)",
                      border: "1px solid rgba(96,165,250,.3)",
                      position: "relative",
                      overflow: "hidden",
                    },
                    [
                      n("image", {
                        src: IMG.leen,
                        alt: "ال الأول على الكويت",
                        w: "200px",
                        h: "140px",
                        radius: 16,
                        objectFit: "cover",
                      }),
                      n("heading", {
                        text: "100%",
                        tag: "div",
                        fontSize: 72,
                        fontWeight: 900,
                        color: "#fff",
                        align: "center",
                        textShadow: "0 10px 40px rgba(0,0,0,.55)",
                        mt: 4,
                      }),
                      n("text", {
                        text: "هيا عبدالله — الأول على الكويت علمي",
                        fontSize: 13,
                        color: "#93c5fd",
                        align: "center",
                      }),
                    ],
                  ),
                ],
              ),

              // right copy
              n(
                "container",
                {
                  w: "50%",
                  display: "flex",
                  flexDir: "column",
                  items: "flex-start",
                  gap: 22,
                  align: "right",
                },
                [
                  n("heading", {
                    text: "كل اللي تحتاجه للتفوق بمكان واحد",
                    tag: "h1",
                    fontSize: 52,
                    fontWeight: 900,
                    color: "#fff",
                    align: "right",
                    lineHeight: 1.25,
                    textShadow: "0 4px 30px rgba(0,0,0,.4)",
                  }),
                  n("text", {
                    text: "ارفع درجاتك مع مذكرات علا الشاملة وفيديوهاتها المميزة واختباراتها الذكية",
                    fontSize: 18,
                    color: "#94a3b8",
                    lineHeight: 1.85,
                    align: "right",
                  }),
                  CTA("استكشف المواد"),
                  n("badge", {
                    text: "🏆 جائزة أفضل منصة تعليمية في الكويت",
                    bg: "rgba(245,158,11,.12)",
                    color: "#fbbf24",
                    radius: 14,
                    p: 12,
                    px: 18,
                    fontSize: 14,
                    fontWeight: 700,
                    border: "1px solid rgba(245,158,11,.25)",
                  }),
                ],
              ),
            ],
          ),
        ],
      ),

      AWARD_STRIP(),

      // ===== BLUE BAND =====
      n(
        "section",
        {
          bg: "linear-gradient(180deg,#1a6ef5 0%,#1560e0 100%)",
          pt: 88,
          pb: 88,
          px: 24,
          display: "flex",
          flexDir: "column",
          items: "center",
          gap: 22,
        },
        [
                  n("image", {
                    src: IMG.watermelon,
                    alt: "watermelon",
                    w: "240px",
                    radius: 0,
                    objectFit: "contain",
                  }),
          n("heading", {
            text: "ادرس وأنت مرتاح",
            tag: "h2",
            fontSize: 40,
            fontWeight: 900,
            color: "#fff",
            align: "center",
          }),
          n("text", {
            text: "مرتبين لك منهجك بطريقة سهلة عشان تدرس المادة على دفعات وأنت مرتاح!",
            fontSize: 18,
            color: "#dbeafe",
            align: "center",
          }),
        ],
      ),

      featureRow({
        title: "مذكرات شاملة",
        desc: "أقوى مذكرات بالكويت تغطي منهجك بالكامل وتغنيك عن كل المصادر الأخرى",
        bg: "#070b16",
        side: "right",
        art: IMG.notes,
      }),
      featureRow({
        title: "فيديوهات شرح مميزة",
        desc: "فيديوهات مسجلة تشرح لك المذكرة بالكامل، تقدر تعيدها في أي وقت — كثر ما تبي",
        bg: "#0a0f1e",
        side: "left",
        art: IMG.chat,
        chips: ["مع إعادة بطيء/سريع"],
      }),
      featureRow({
        title: "اختبارات ذكية",
        desc: "ثبت معلوماتك واستعد لاختباراتك مع اختبارات علا الذكية المبنية على اختبارات سابقة وتعالج نقاط ضعفك",
        bg: "#070b16",
        side: "right",
        art: IMG.tests,
        chips: ["تُصحَّح فورًا", "يعين طلابك للنقاط الضعيفة"],
      }),
      featureRow({
        title: "نخبة المعلمين معاك",
        desc: "تابع أقوى المعلمين اللي يشرحون لك كل المواد ويجاوبون أسئلتك ويفهمونك",
        bg: "#0a0f1e",
        side: "left",
        art: IMG.chat,
        chips: ["تواصل مع معلمك"],
      }),
      featureRow({
        title: "وفّر أكثر مع باقات علا",
        desc: "اشتراك واحد يفتح جميع مواد مرحلتك بسعر خيالي! وفر لغاية 80%",
        bg: "#070b16",
        side: "right",
        art: IMG.packages,
      }),

      // ===== SUCCESS =====
      n(
        "section",
        {
          bg: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(88,28,135,.35), transparent 60%), #0c0618",
          pt: 80,
          pb: 80,
          px: 32,
          display: "flex",
          flexDir: "column",
          items: "center",
          gap: 32,
        },
        [
          n("heading", {
            text: "نجاحكم نجاحنا",
            tag: "h2",
            fontSize: 36,
            fontWeight: 900,
            color: "#fff",
            align: "center",
          }),
          n(
            "container",
            {
              maxW: "1160px",
              w: "100%",
              display: "flex",
              flexDir: "row",
              gap: 24,
              wrap: true,
              justify: "center",
            },
            [
              n("studentCard", {
                name: "يوسف عبدالعزيز",
                meta: "الأول على الكويت — علمي",
                score: "100",
                bg: "linear-gradient(165deg,#1e1b4b 0%,#151335 100%)",
                accent: "#a78bfa",
                img: IMG.yousef,
                border: "1px solid rgba(167,139,250,.2)",
                radius: 22,
                p: 16,
              }),
              n("studentCard", {
                name: "سليم مسيكة",
                meta: "الأول على الكويت — علمي",
                score: "100",
                bg: "linear-gradient(165deg,#172554 0%,#0f1e44 100%)",
                accent: "#60a5fa",
                img: IMG.saleem,
                border: "1px solid rgba(96,165,250,.2)",
                radius: 22,
                p: 16,
              }),
              n("studentCard", {
                name: "جمانة النجدي",
                meta: "الثاني على الكويتيين — علمي",
                score: "99.99",
                bg: "linear-gradient(165deg,#3b0764 0%,#24053e 100%)",
                accent: "#e879f9",
                img: IMG.jumana,
                border: "1px solid rgba(232,121,249,.2)",
                radius: 22,
                p: 16,
              }),
            ],
          ),
          n("button", {
            text: "أعرض المزيد",
            href: "#",
            bg: "transparent",
            color: "#93c5fd",
            radius: 999,
            p: 12,
            pxBtn: 28,
            fontSize: 15,
            fontWeight: 700,
            border: "1px solid #334155",
            boxShadow: "none",
          }),
        ],
      ),

      FOOTER(),
    ],
  );
  return { id: uid(), name: "الرئيسية", root };
}

function shopPage(): PageDoc {
  const gradesUpper = ["9", "8", "7", "6", "5", "4"];
  const gradesHigh = ["12", "11", "10"];

  const tile = (g: string) =>
    n("gradeCard", {
      num: g,
      bg: "linear-gradient(160deg,#141c33 0%,#0e1528 100%)",
      color: "#1d4ed8",
      color2: "#93c5fd",
      radius: 28,
      w: "100%",
      h: "200px",
      fontSize: 96,
      fontWeight: 900,
      border: "1px solid rgba(255,255,255,.05)",
      textShadow: "0 24px 50px rgba(59,130,246,.55)",
    });

  const root = n(
    "page",
    { bg: "#0a0f1c", minH: "100vh", display: "flex", flexDir: "column" },
    [
      NAV(),
      n(
        "section",
        {
          bg: "#0a0f1c",
          pt: 64,
          pb: 96,
          px: 48,
          display: "flex",
          flexDir: "column",
          items: "flex-end",
          gap: 36,
        },
        [
          n("heading", {
            text: "المراحل الدراسية",
            tag: "h1",
            fontSize: 56,
            fontWeight: 900,
            color: "#fff",
            align: "right",
          }),
          n(
            "container",
            {
              maxW: "1280px",
              w: "100%",
              display: "grid",
              gridCols: 6,
              gap: 22,
            },
            gradesUpper.map(tile),
          ),
          n(
            "container",
            {
              maxW: "1280px",
              w: "100%",
              display: "grid",
              gridCols: 6,
              gap: 22,
            },
            gradesHigh.map(tile),
          ),

          n("heading", {
            text: "مرحلة أخرى",
            tag: "h2",
            fontSize: 34,
            fontWeight: 900,
            color: "#fff",
            align: "right",
            mt: 40,
          }),
          n(
            "container",
            {
              maxW: "1280px",
              w: "100%",
              display: "grid",
              gridCols: 6,
              gap: 22,
            },
            [
              n(
                "card",
                {
                  bg: "linear-gradient(160deg,#121a30,#0d1428)",
                  radius: 24,
                  p: 28,
                  items: "center",
                  display: "flex",
                  flexDir: "column",
                  gap: 14,
                  border: "1px solid rgba(255,255,255,.05)",
                  w: "100%",
                },
                [
                  n("heading", {
                    text: "اختبار القدرات",
                    tag: "h3",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#fff",
                    align: "center",
                  }),
                  n("image", {
                    src: IMG.packages,
                    alt: "قدرات",
                    w: "110px",
                    radius: 0,
                    objectFit: "contain",
                  }),
                ],
              ),
              n(
                "card",
                {
                  bg: "linear-gradient(160deg,#121a30,#0d1428)",
                  radius: 24,
                  p: 28,
                  items: "center",
                  display: "flex",
                  flexDir: "column",
                  gap: 14,
                  border: "1px solid rgba(255,255,255,.05)",
                  w: "100%",
                },
                [
                  n("heading", {
                    text: "الجامعة",
                    tag: "h3",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#fff",
                    align: "center",
                  }),
                  n("image", {
                    src: IMG.graduation,
                    alt: "جامعة",
                    w: "110px",
                    radius: 0,
                    objectFit: "contain",
                  }),
                ],
              ),
              n("spacer", { h: 1, w: "100%" }),
              n("spacer", { h: 1, w: "100%" }),
              n("spacer", { h: 1, w: "100%" }),
              n("spacer", { h: 1, w: "100%" }),
            ],
          ),
        ],
      ),
      FOOTER(),
    ],
  );
  return { id: uid(), name: "المراحل / التسوق", root };
}

function topStudentsPage(): PageDoc {
  const students: [string, string, string, string?][] = [
    ["هيا خالد عبدالله الشمري", "العاشرة — علمي", "100"],
    ["وضاح سيف عبدالحفيظ الظفيري", "العاشرة — علمي", "100"],
    ["يوسف عبدالعزيز أحمد الغريب", "العاشرة — علمي", "100"],
    ["ريم أحمد يوسف الصالح", "التاسعة — علمي", "99.99"],
    ["جود خالد محمد مسعود", "التاسعة — علمي", "99.99"],
    ["جنى أحمد وليد المطيري", "التاسعة — علمي", "99.99"],
    ["فريدة علي محمد القحطاني", "الثامنة — علمي", "99.97"],
    ["مريم بدر سلمان العجمي", "الثامنة — علمي", "99.97"],
    ["نور الهدى إبراهيم بابصلي", "الثامنة — علمي", "99.98"],
    ["جود محمد هلال الباكي", "السابعة — علمي", "99.94"],
    ["ملاكة أحمد سعود الصباح", "السابعة — علمي", "99.96"],
    ["مظاهر جاسم فهد العنزي", "السابعة — علمي", "99.96"],
    ["فاطمة أحمد وليد الهاجري", "السادسة — علمي", "98.58"],
    ["جود محمد سعود الفهد", "الخامسة — علمي", "99.32"],
    ["أصايل سليمان ناصر الهاجري", "الرابعة — علمي", "99.93"],
    ["ميادة عبدالله ناصر الغربللي", "الثالثة — علمي", "98.50"],
    ["عبدالله خالد ناصر المطيري", "الثانية — علمي", "97.60"],
    ["ريم محمد جاسم الدوسري", "الأولى — علمي", "97.00"],
    ["منيرة جاسم محمد الكندري", "الثانية — أدبي", "95.36"],
    ["متعب عبدالرحمن ماجد الهذيل", "الثانية — علمي", "95.92"],
    ["محمد فيصل ناصر المؤمن", "الثالثة — علمي", "96.38"],
    ["عبدالعزيز أحمد صالح الصباح", "الثالثة — علمي", "95.12"],
  ];

  const cards = students.map(([name, meta, score]) =>
    n("studentCard", {
      name,
      meta,
      score,
      bg: "linear-gradient(165deg,#0f3d28 0%,#0a2a1c 55%,#071f15 100%)",
      accent: "#34d399",
      img: `https://placehold.co/400x480/064e3b/6ee7b7?text=${encodeURIComponent(score)}`,
      border: "1px solid rgba(52,211,153,.15)",
      radius: 18,
      p: 14,
    }),
  );

  const testimonials = [
    ["محمد المطيري", "«طلبت من الطلاب أكتبوا واجباتهم والرؤية بعد الفيديو، ولاحظت فرق كبير. الطلاب صاروا أكثر انتباهًا وتركيزًا.»"],
    ["سارة الأنصاري", "«أفضل شي هو تنظيم المنهج على دفعات — الطالب ياخذ وقته وما ينضغط، والنتيجة تبين في الاختبارات.»"],
    ["د. هيا العجمي", "«المذكرات الشاملة ممتازة وتغطي المنهج كله، ما يحتاج الطالب يشتري أي مصدر ثاني.»"],
    ["أ. خالد الديباني", "«الاختبارات الذكية تبيّن نقاط الضعف بوضوح وتساعد الطالب يركز عليها قبل الاختبار الرسمي.»"],
    ["أم عبدالعزيز", "«ابني درس من البيت بدون ما أطلع — التقارير تعطيني صورة كاملة عن تقدمه أسبوعيًا.»"],
    ["أ. نورة السالم", "«الفيديوهات قابلة لإعادة بأي سرعة، وهذا يناسب كل أنواع الطلبة — السريع والبطيء.»"],
    ["حمد الرشيد", "«تواصل مع المعلم مباشرة وفّر عليّ وقت طويل — أي سؤال أطرحه ألقى إجابة خلال دقائق.»"],
    ["منى الجابر", "«الباقات وفرت علينا كثير — اشتراك واحد يغطي كل مواد مرحلة ابني.»"],
    ["علي الفهد", "«كنت أكره الرياضيات، لكن الشرح هنا خطوة بخطوة خلاني أفهم وأحب المادة.»"],
  ];

  const root = n(
    "page",
    { bg: "#070b16", minH: "100vh", display: "flex", flexDir: "column" },
    [
      NAV(),

      // Hero with trophy
      n(
        "section",
        {
          bg: "radial-gradient(ellipse 60% 55% at 50% 0%, rgba(16,185,129,.18), transparent 55%), linear-gradient(180deg,#070b16,#0a1528)",
          pt: 64,
          pb: 48,
          px: 32,
          display: "flex",
          flexDir: "column",
          items: "center",
          gap: 16,
          position: "relative",
          overflow: "hidden",
        },
        [
          n("decor", { content: "🏆", fontSize: 120, color: "#fff", position: "absolute", top: 30, z: 0, opacity: 1, transform: "rotate(-8deg)" }),
          n("spacer", { h: 90 }),
          n("heading", {
            text: "نجاحكم نجاحنا",
            tag: "h1",
            fontSize: 48,
            fontWeight: 900,
            color: "#fff",
            align: "center",
            position: "relative",
            z: 1,
          }),
          n("text", {
            text: "نفخر بأبنائنا الطلبة الذين حققوا أعلى النتائج على الكويت\nفخورين بكم على المستوى الدراسي والعلمي",
            fontSize: 17,
            color: "#a7f3d0",
            align: "center",
            lineHeight: 1.9,
            position: "relative",
            z: 1,
          }),
          n("yearTabs", {
            years: "2026,2025,2024,2023,2022,2021",
            active: "2026",
            bg: "transparent",
            gap: 10,
            display: "flex",
            wrap: true,
            justify: "center",
            mt: 12,
            position: "relative",
            z: 1,
          }),
        ],
      ),

      // Grid
      n(
        "section",
        { bg: "#070b16", pt: 24, pb: 72, px: 32, display: "flex", flexDir: "column", items: "center" },
        [
          n(
            "container",
            { maxW: "1200px", w: "100%", display: "grid", gridCols: 3, gap: 22 },
            cards,
          ),
        ],
      ),

      // CTA banner
      n(
        "section",
        { bg: "#0a1020", pt: 48, pb: 48, px: 32, display: "flex", flexDir: "column", items: "center" },
        [
          n(
            "ctaBanner",
            {
              bg: "linear-gradient(120deg,#0f1c3f 0%,#153065 50%,#0f1c3f 100%)",
              radius: 28,
              p: 40,
              gap: 32,
              display: "flex",
              items: "center",
              justify: "space-between",
              wrap: true,
              maxW: "1100px",
              w: "100%",
              border: "1px solid rgba(59,130,246,.2)",
              boxShadow: "0 24px 60px rgba(0,0,0,.35)",
            },
            [
              n(
                "container",
                { w: "55%", display: "flex", flexDir: "column", items: "flex-start", gap: 14, align: "right" },
                [
                  n("heading", {
                    text: "رحلة التفوق تبدأ هنا",
                    tag: "h2",
                    fontSize: 30,
                    fontWeight: 900,
                    color: "#fff",
                    align: "right",
                  }),
                  n("text", {
                    text: "انضم لآلاف الطلبة الذين حققوا نتائج استثنائية مع علا",
                    fontSize: 16,
                    color: "#94a3b8",
                    align: "right",
                  }),
                  CTA("ابدأ معنا"),
                ],
              ),
              n("image", {
                src: IMG.packages,
                alt: "رحلة التفوق",
                w: "280px",
                radius: 16,
                objectFit: "contain",
              }),
            ],
          ),
        ],
      ),

      // Alumni tips
      n(
        "section",
        { bg: "#070b16", pt: 64, pb: 72, px: 32, display: "flex", flexDir: "column", items: "center", gap: 28 },
        [
          n("heading", {
            text: "نصائح الخريجين",
            tag: "h2",
            fontSize: 34,
            fontWeight: 900,
            color: "#fff",
            align: "center",
          }),
          n(
            "container",
            { maxW: "1200px", w: "100%", display: "grid", gridCols: 3, gap: 20 },
            testimonials.map(([name, quote]) =>
              n("testimonial", {
                quote,
                name,
                meta: "خريج علا",
                bg: "linear-gradient(160deg,#101b36 0%,#0b1224 100%)",
                color: "#cbd5e1",
                radius: 20,
                p: 24,
                border: "1px solid rgba(255,255,255,.06)",
              }),
            ),
          ),
        ],
      ),

      FOOTER(),
    ],
  );
  return { id: uid(), name: "الطلبة الأوائل", root };
}

function parentsPage(): PageDoc {
  const teachers = [
    ["معلم فادي", "الاجتماعيات", "+15 سنة خبرة", "+99% نسبة الرضا", IMG.teacher1],
    ["إياد الديباني", "الكيمياء", "خبرة 10+ سنوات", "+98% رضا الطلاب", IMG.teacher2],
    ["معلم عبدالله", "الأحياء", "خبرة 12+ سنوات", "+97% نسبة الرضا", IMG.teacher3],
  ];

  const kids: [string, string, string][] = [
    ["تميم البلوشي", "الثالثة المتوسطة", "100"],
    ["يبارك الديباني", "السابعة الإعدادية", "99.91"],
    ["روان السالم", "الثانية المتوسطة", "100"],
  ];

  const root = n(
    "page",
    { bg: "#070b16", minH: "100vh", display: "flex", flexDir: "column" },
    [
      NAV(),

      // Hero with overlapping kids
      n(
        "section",
        {
          bg: "radial-gradient(ellipse 75% 60% at 50% 0%, rgba(37,99,235,.22), transparent 55%), linear-gradient(180deg,#070b16,#0a1230)",
          pt: 72,
          pb: 72,
          px: 32,
          display: "flex",
          flexDir: "column",
          items: "center",
          gap: 28,
          position: "relative",
          overflow: "hidden",
        },
        [
          n(
            "container",
            {
              maxW: "1100px",
              w: "100%",
              display: "flex",
              flexDir: "row",
              items: "flex-end",
              justify: "center",
              gap: 0,
              position: "relative",
              z: 1,
            },
            kids.map(([name, meta, score], i) =>
              n("studentCard", {
                name,
                meta,
                score,
                bg: `linear-gradient(165deg,${i === 1 ? "#1e3a5f" : "#152040"} 0%,#0d1530 100%)`,
                accent: i === 1 ? "#60a5fa" : "#94a3b8",
                img: `https://placehold.co/320x400/${i === 1 ? "1e3a5f" : "0f172a"}/94a3b8?text=0${i + 1}`,
                border: i === 1 ? "2px solid rgba(96,165,250,.35)" : "1px solid rgba(255,255,255,.08)",
                radius: 20,
                p: 14,
                w: i === 1 ? "280px" : "240px",
                transform: i === 1 ? "scale(1.08)" : "none",
                zIndex: i === 1 ? 2 : 1,
                boxShadow: i === 1 ? "0 30px 60px rgba(0,0,0,.45)" : "0 16px 40px rgba(0,0,0,.3)",
                mt: i === 1 ? 0 : 28,
              }),
            ),
          ),
          n("heading", {
            text: "كل اللي يحتاجه طلابنا للتفوق",
            tag: "h1",
            fontSize: 44,
            fontWeight: 900,
            color: "#fff",
            align: "center",
            position: "relative",
            z: 1,
          }),
          n("text", {
            text: "ارقب تقدم أبنائك مع تقارير مفصلة وتواصل مباشر مع المعلمين",
            fontSize: 17,
            color: "#94a3b8",
            align: "center",
            position: "relative",
            z: 1,
          }),
          CTA("تواصل معنا"),
        ],
      ),

      AWARD_STRIP(),

      // Teachers
      n(
        "section",
        {
          bg: "#070b16",
          pt: 72,
          pb: 72,
          px: 32,
          display: "flex",
          flexDir: "column",
          items: "center",
          gap: 28,
        },
        [
          n("heading", {
            text: "مواد معدة من نخبة المعلمين",
            tag: "h2",
            fontSize: 36,
            fontWeight: 900,
            color: "#fff",
            align: "center",
          }),
          n("text", {
            text: "+15 مادة مختلفة في كل درس نظامي — شرح واضح يناسب منهج الكويت",
            fontSize: 17,
            color: "#8b95a9",
            align: "center",
          }),
          n("badge", {
            text: "+15 مادة في كل درس نظامي",
            bg: "rgba(139,92,246,.15)",
            color: "#a78bfa",
            radius: 999,
            p: 8,
            px: 16,
            fontSize: 13,
            fontWeight: 700,
          }),
          n(
            "container",
            { maxW: "1160px", w: "100%", display: "flex", flexDir: "row", gap: 24, wrap: true, justify: "center" },
            teachers.map(([name, subject, years, students, img]) =>
              n("teacherCard", {
                name,
                subject,
                years,
                students,
                img,
                bg: "linear-gradient(160deg,#152038 0%,#0e162c 100%)",
                color: "#fff",
                radius: 22,
                p: 0,
                border: "1px solid rgba(255,255,255,.06)",
                w: "340px",
              }),
            ),
          ),
          CTA("تواصل معنا"),
        ],
      ),

      featureRow({
        title: "استفيد من أقوى شرح لمناهجك",
        desc: "مذكرات شاملة وفيديوهات تشرحها تغنيك عن أي مصدر آخر — الطالب يدرس على راحته",
        bg: "#0a0f1e",
        side: "right",
        art: IMG.notes,
        chips: ["مذكرات شاملة", "شرح مرئي كامل"],
      }),
      featureRow({
        title: "نخبة المعلمين بين يديك",
        desc: "مدرسك معك في أي لحظة تحتاج فيها مساعدة — اسأل واحصل على إجابة فورية",
        bg: "#070b16",
        side: "left",
        art: IMG.chat,
        chips: ["تواصل مع معلمك"],
      }),
      featureRow({
        title: "اختبارات ذكية",
        desc: "اختبارات مبنية على اختبارات سابقة ترسّخ المعلومة وتوريك نقاط الضعف قبل الاختبار",
        bg: "#0a0f1e",
        side: "right",
        art: IMG.tests,
        chips: ["تُصحَّح فورًا", "يعين طلابك للنقاط الضعيفة"],
      }),
      featureRow({
        title: "تفوق وأنت مرتاح",
        desc: "مع علا أنت وأهلك مرتاحين — دروس ميسّرة على دفعات تناسب يوم الطالب",
        bg: "#070b16",
        side: "left",
        art: IMG.packages,
        chips: ["مع التوفير والمتابعة المنزلية"],
      }),

      // Success purple
      n(
        "section",
        {
          bg: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(88,28,135,.4), transparent 60%), #0c0618",
          pt: 80,
          pb: 80,
          px: 32,
          display: "flex",
          flexDir: "column",
          items: "center",
          gap: 24,
        },
        [
          n("heading", {
            text: "على المكان اللي يابني يبنونه للتفوق والاختبار الأول لأفضل المئات",
            tag: "h2",
            fontSize: 32,
            fontWeight: 900,
            color: "#fff",
            align: "center",
            maxW: "800px",
          }),
          n(
            "container",
            { maxW: "1160px", w: "100%", display: "flex", flexDir: "row", gap: 24, wrap: true, justify: "center" },
            [
              n("studentCard", {
                name: "هيا عادل",
                meta: "الأولى على الكويت — علمي",
                score: "100",
                bg: "linear-gradient(165deg,#1e1b4b,#151335)",
                accent: "#a78bfa",
                img: IMG.leen,
                border: "1px solid rgba(167,139,250,.2)",
                radius: 22,
                p: 16,
                w: "320px",
              }),
              n("studentCard", {
                name: "جود محمد",
                meta: "الثانية على الكويت — علمي",
                score: "99.91",
                bg: "linear-gradient(165deg,#172554,#0f1e44)",
                accent: "#60a5fa",
                img: IMG.yousef,
                border: "1px solid rgba(96,165,250,.2)",
                radius: 22,
                p: 16,
                w: "320px",
              }),
              n("studentCard", {
                name: "سارة الهاجري",
                meta: "الثانية على الكويت — علمي",
                score: "100",
                bg: "linear-gradient(165deg,#3b0764,#24053e)",
                accent: "#e879f9",
                img: IMG.jumana,
                border: "1px solid rgba(232,121,249,.2)",
                radius: 22,
                p: 16,
                w: "320px",
              }),
            ],
          ),
        ],
      ),

      // Final CTA
      n(
        "section",
        { bg: "#070b16", pt: 72, pb: 72, px: 32, display: "flex", flexDir: "column", items: "center", gap: 18 },
        [
          n("heading", {
            text: "النجاح رحلة، لا نقطة وصول",
            tag: "h2",
            fontSize: 40,
            fontWeight: 900,
            color: "#fff",
            align: "center",
          }),
          n("text", {
            text: "انضم إلينا اليوم وابدأ رحلة طفلك نحو التفوق",
            fontSize: 17,
            color: "#8b95a9",
            align: "center",
          }),
          n(
            "container",
            { display: "flex", flexDir: "row", gap: 14, wrap: true, justify: "center", items: "center" },
            [
              CTA("تواصل معنا"),
              n("button", {
                text: "أعرض المزيد",
                href: "#",
                bg: "transparent",
                color: "#93c5fd",
                radius: 999,
                p: 14,
                pxBtn: 28,
                fontSize: 15,
                fontWeight: 700,
                border: "1px solid #334155",
                boxShadow: "none",
              }),
            ],
          ),
        ],
      ),

      n(
        "section",
        { bg: "#05080f", pt: 32, pb: 24, px: 40, display: "flex", flexDir: "column", items: "center", gap: 16 },
        [
          n("logoStrip", {
            items: "App Store,Google Play,Apple Pay,KNET",
            bg: "transparent",
            gap: 24,
            display: "flex",
            wrap: true,
            justify: "center",
            color: "#5f6370",
          }),
        ],
      ),

      FOOTER(),
    ],
  );
  return { id: uid(), name: "أولياء الأمور", root };
}

export function defaultPages(): PageDoc[] {
  return [homePage(), shopPage(), topStudentsPage(), parentsPage()];
}
