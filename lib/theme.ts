// هوية بصرية مستقلة لكل مرحلة دراسية — مستوحاة من بحث بصري للمنافسين
// لون واحد مسطح لكل مرحلة — بلا تدرجات (انضباط بصري)
export interface StageTheme {
  /** اللون الرئيسي المسطح للمرحلة */
  color: string;
  /** لون التمييز (الحلقات، الشارات) */
  accent: string;
  /** أيقونة المرحلة */
  icon: string;
  /** لقب المرحلة التحفيزي */
  title: string;
  /** وصف قصير */
  tagline: string;
  /** شكل الحواف */
  radius: string;
}

export const STAGE_THEMES: Record<string, StageTheme> = {
  // ابتدائي: سماوي مشرق — مرح
  elem: {
    color: "#0284c7",
    accent: "#f59e0b",
    icon: "rocket",
    title: "عالم المغامرات",
    tagline: "اتعلم باللعب واكسب النجوم",
    radius: "rounded-[2rem]",
  },
  // متوسط: فيوليت — طاقة وتحدي
  mid: {
    color: "#6d28d9",
    accent: "#22d3ee",
    icon: "bolt",
    title: "منطقة الأبطال",
    tagline: "تحدى نفسك واصعد للقمة",
    radius: "rounded-[1.75rem]",
  },
  // ثانوي: كحلي داكن + ذهبي — نخبة ورصانة (أسلوب UULA)
  high: {
    color: "#0b1424",
    accent: "#f59e0b",
    icon: "trophy",
    title: "صفوف النخبة",
    tagline: "المرحلة الحاسمة — مستقبلك يبدأ هنا",
    radius: "rounded-3xl",
  },
};

export function stageTheme(stageId?: string): StageTheme {
  return STAGE_THEMES[stageId ?? "high"] ?? STAGE_THEMES.high;
}
