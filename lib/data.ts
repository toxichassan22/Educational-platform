// ===================== الأنواع =====================
export type Role = "student" | "parent" | "admin";

export interface Stage { id: string; name: string }
export interface Grade { id: string; name: string; stageId: string; order: number }
export interface Subject { id: string; name: string; gradeId: string; teacher: string; color: string; icon: string }
export interface Unit { id: string; subjectId: string; title: string; order: number }
export interface NoteSection { heading: string; body: string; points?: string[] }
export interface Lesson {
  id: string; unitId: string; title: string; durationMin: number;
  videoUrl: string; note: NoteSection[]; free?: boolean;
}
export interface Question {
  id: string; lessonId: string; text: string;
  type: "mcq" | "tf"; options: string[]; correct: number; // tf: 0=صح 1=خطأ
  explanation?: string; // يظهر في مراجعة الإجابات بعد التصحيح
}
export interface User {
  id: string; name: string; role: Role; phone: string;
  gradeId?: string; childrenIds?: string[]; active: boolean; joinedAt: string;
}
export interface Attempt {
  id: string; userId: string; lessonId: string;
  score: number; total: number; date: string; timeTakenSec: number;
}
export interface Package {
  id: string; name: string; scope: "subject" | "stage" | "all";
  priceKwd: number; period: string; features: string[]; popular?: boolean;
}
export interface Subscription {
  id: string; userId: string; packageId: string;
  /** لباقة المادة فقط: المادة المفتوحة — غير محدد = يفتح الكل (بيانات قديمة) */
  subjectId?: string;
  startDate: string; endDate: string; status: "active" | "expired";
}
export interface Payment {
  id: string; userId: string; packageName: string;
  amountKwd: number; method: "KNET" | "Visa" | "Mastercard";
  date: string; status: "success" | "pending" | "failed";
}

export interface DB {
  stages: Stage[]; grades: Grade[]; subjects: Subject[];
  units: Unit[]; lessons: Lesson[]; questions: Question[];
  users: User[]; attempts: Attempt[]; packages: Package[];
  subscriptions: Subscription[]; payments: Payment[]; discountCodes: { code: string; pct: number }[];
}

// ===================== فيديوهات تجريبية =====================
const VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
];

// ===================== المراحل والصفوف =====================
export const STAGES: Stage[] = [
  { id: "elem", name: "المرحلة الابتدائية" },
  { id: "mid", name: "المرحلة المتوسطة" },
  { id: "high", name: "المرحلة الثانوية" },
];

const AR_NUM = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر", "الحادي عشر", "الثاني عشر"];

export const GRADES: Grade[] = [
  ...[0, 1, 2, 3, 4].map((i) => ({ id: `g${i + 1}`, name: `الصف ${AR_NUM[i]}`, stageId: "elem", order: i + 1 })),
  ...[5, 6, 7, 8].map((i) => ({ id: `g${i + 1}`, name: `الصف ${AR_NUM[i]}`, stageId: "mid", order: i + 1 })),
  ...[9, 10, 11].map((i) => ({ id: `g${i + 1}`, name: `الصف ${AR_NUM[i]}`, stageId: "high", order: i + 1 })),
];

// ===================== المواد لكل مرحلة =====================
const SUBJECTS_BY_STAGE: Record<string, { name: string; icon: string; color: string }[]> = {
  // ابتدائي: ألوان مبهجة مشبعة تناسب الأصغر سنًا
  elem: [
    { name: "لغتي العربية", icon: "book", color: "#0284c7" },
    { name: "الرياضيات", icon: "calc", color: "#8b5cf6" },
    { name: "العلوم", icon: "flask", color: "#10b981" },
    { name: "اللغة الإنجليزية", icon: "globe", color: "#f43f5e" },
    { name: "التربية الإسلامية", icon: "star", color: "#f59e0b" },
  ],
  mid: [
    { name: "اللغة العربية", icon: "book", color: "#16658a" },
    { name: "الرياضيات", icon: "calc", color: "#7c3aed" },
    { name: "العلوم", icon: "flask", color: "#059669" },
    { name: "اللغة الإنجليزية", icon: "globe", color: "#dc2626" },
    { name: "الدراسات الاجتماعية", icon: "map", color: "#0891b2" },
    { name: "التربية الإسلامية", icon: "star", color: "#b45309" },
  ],
  high: [
    { name: "اللغة العربية", icon: "book", color: "#16658a" },
    { name: "الرياضيات", icon: "calc", color: "#7c3aed" },
    { name: "الفيزياء", icon: "atom", color: "#2563eb" },
    { name: "الكيمياء", icon: "flask", color: "#059669" },
    { name: "الأحياء", icon: "leaf", color: "#16a34a" },
    { name: "اللغة الإنجليزية", icon: "globe", color: "#dc2626" },
    { name: "التربية الإسلامية", icon: "star", color: "#b45309" },
  ],
};

// ===================== بنك وحدود ودروس لكل مادة =====================
const CURRICULUM: Record<string, { unit: string; lessons: string[] }[]> = {
  "الرياضيات": [
    { unit: "النسبة والتناسب", lessons: ["مفهوم النسبة", "التناسب وخواصه", "التطبيقات على التناسب", "النسبة المئوية"] },
    { unit: "الجبر", lessons: ["المعادلات الخطية", "حل المعادلات بمجهولين", "الدالة الخطية", "المتراجبات"] },
    { unit: "الهندسة", lessons: ["تشابه المثلثات", "نظرية فيثاغورس", "الدائرة وخواصها", "مساحات الأشكال"] },
    { unit: "الإحصاء", lessons: ["جمع البيانات وتنظيمها", "مقاييس النزعة المركزية", "التمثيل بالأعمدة والقطاعات"] },
  ],
  "الفيزياء": [
    { unit: "الحركة الخطية", lessons: ["المسافة والإزاحة", "السرعة المتوسطة واللحظية", "العجلة", "معادلات الحركة"] },
    { unit: "القوى وقوانين نيوتن", lessons: ["القوة وتأثيرها", "قانون نيوتن الأول", "قانون نيوتن الثاني", "قانون نيوتن الثالث"] },
    { unit: "الشغل والطاقة", lessons: ["مفهوم الشغل", "الطاقة الحركية", "الطاقة الكامنة", "حفظ الطاقة"] },
    { unit: "الكهرباء", lessons: ["الشحنة الكهربائية", "التيار والجهد", "قانون أوم", "الدوائر الكهربائية"] },
  ],
  "الكيمياء": [
    { unit: "تركيب الذرة", lessons: ["مكونات الذرة", "التوزيع الإلكتروني", "الجدول الدوري", "الأيزوتوبات"] },
    { unit: "الروابط الكيميائية", lessons: ["الرابطة الأيونية", "الرابطة التساهمية", "الرابطة الفلزية"] },
    { unit: "التفاعلات الكيميائية", lessons: ["المعادلات الكيميائية", "أنواع التفاعلات", "موازنة المعادلات"] },
    { unit: "الأحماض والقواعد", lessons: ["مفهوم الأحماض والقواعد", "الرقم الهيدروجيني pH", "التعادل"] },
  ],
  "الأحياء": [
    { unit: "الخلية", lessons: ["تركيب الخلية", "الانقسام المتساوي", "الانقسام المنصف"] },
    { unit: "الوراثة", lessons: ["قوانين مندل", "الكروموسومات والجينات", "الصفات الوراثية"] },
    { unit: "التكاثر", lessons: ["التكاثر اللاجنسي", "التكاثر الجنسي", "التكاثر في النباتات"] },
  ],
  "اللغة العربية": [
    { unit: "النحو", lessons: ["الجملة الاسمية والفعلية", "المبتدأ والخبر", "الفاعل والمفعول به", "كان وأخواتها", "إن وأخواتها"] },
    { unit: "البلاغة", lessons: ["التشبيه", "الاستعارة", "الكناية"] },
    { unit: "النصوص", lessons: ["قراءة النص وتحليله", "الأفكار الرئيسية", "الأساليب اللغوية"] },
    { unit: "الإملاء", lessons: ["الهمزة المتوسطة", "الهمزة المتطرفة", "التاء المربوطة والمفتوحة"] },
  ],
  "العلوم": [
    { unit: "المادة وخواصها", lessons: ["حالات المادة", "التغيرات الفيزيائية والكيميائية", "المخاليط والمحاليل"] },
    { unit: "الطاقة", lessons: ["أشكال الطاقة", "تحولات الطاقة", "الطاقة المتجددة"] },
    { unit: "الكائنات الحية", lessons: ["تصنيف الكائنات", "البيئة والسلاسل الغذائية", "التكيف"] },
  ],
  "اللغة الإنجليزية": [
    { unit: "Grammar", lessons: ["Present Simple & Continuous", "Past Simple", "Future Forms", "Conditionals"] },
    { unit: "Reading", lessons: ["Reading Comprehension 1", "Reading Comprehension 2", "Skimming & Scanning"] },
    { unit: "Vocabulary", lessons: ["Unit 1 Words", "Unit 2 Words", "Phrasal Verbs"] },
  ],
  "الدراسات الاجتماعية": [
    { unit: "جغرافيا الكويت", lessons: ["موقع الكويت", "المناخ والتضاريس", "السكان"] },
    { unit: "تاريخ الكويت", lessons: ["نشأة الكويت", "الكويت قديمًا", "الدستور الكويتي"] },
  ],
  "التربية الإسلامية": [
    { unit: "القرآن والسنة", lessons: ["سورة الملك", "أحاديث في الأخلاق", "آداب طلب العلم"] },
    { unit: "العبادات", lessons: ["الصلاة وأحكامها", "الزكاة", "الصيام"] },
    { unit: "السيرة", lessons: ["السيرة النبوية - المولد والنشأة", "الهجرة النبوية", "غزوات الرسول ﷺ"] },
  ],
  "لغتي العربية": [
    { unit: "القراءة", lessons: ["نصوص قصيرة", "حروف وكلمات", "التعبير"] },
    { unit: "الكتابة", lessons: ["الخط والإملاء", "الجملة البسيطة"] },
  ],
};

const TEACHERS = ["أ. محمد العتيبي", "أ. فاطمة المطيري", "أ. عبدالله الرشيدي", "أ. نورة السبيعي", "أ. خالد العنزي", "أ. مريم القحطاني", "أ. يوسف الدوسري", "أ. هند الشمري"];

// ===================== أسئلة حقيقية (للمواد الرئيسية) =====================
const REAL_QUESTIONS: Record<string, Omit<Question, "id" | "lessonId">[]> = {
  "المعادلات الخطية": [
    { text: "حل المعادلة: 3س + 5 = 20", type: "mcq", options: ["س = 5", "س = 7", "س = 3", "س = 15"], correct: 0,
      explanation: "نطرح 5 من الطرفين: 3س = 15، ثم نقسم على 3 → س = 5" },
    { text: "إذا كان 2س − 4 = 10 فإن قيمة س تساوي:", type: "mcq", options: ["6", "7", "8", "3"], correct: 1,
      explanation: "2س = 10 + 4 = 14 → س = 14 ÷ 2 = 7" },
    { text: "المعادلة س + 9 = 14 حلها س = 23", type: "tf", options: ["صح", "خطأ"], correct: 1,
      explanation: "الصحيح س = 14 − 9 = 5 وليس 23 — الجمع لا يُنقل كما هو بل يُطرح" },
    { text: "حل المعادلة: 5س = 45", type: "mcq", options: ["س = 8", "س = 40", "س = 9", "س = 50"], correct: 2,
      explanation: "نقسم الطرفين على معامل س: س = 45 ÷ 5 = 9" },
    { text: "العدد الذي إذا ضربته في 4 وأضفت 6 كان الناتج 30 هو:", type: "mcq", options: ["5", "6", "7", "9"], correct: 1,
      explanation: "4س + 6 = 30 → 4س = 24 → س = 6" },
    { text: "س/3 = 6 ، إذن س = 18", type: "tf", options: ["صح", "خطأ"], correct: 0,
      explanation: "نضرب الطرفين في 3: س = 6 × 3 = 18 ✓" },
  ],
  "النسبة المئوية": [
    { text: "25% من العدد 80 يساوي:", type: "mcq", options: ["20", "25", "15", "40"], correct: 0,
      explanation: "25% = ربع → 80 ÷ 4 = 20" },
    { text: "النسبة المئوية 50% تكافئ الكسر:", type: "mcq", options: ["1/3", "1/2", "1/4", "3/4"], correct: 1,
      explanation: "50% = 50/100 = 1/2" },
    { text: "0.75 تساوي 75%", type: "tf", options: ["صح", "خطأ"], correct: 0,
      explanation: "نضرب العدد العشري في 100: 0.75 × 100 = 75% ✓" },
    { text: "إذا اشترى أحمد قميصًا بخصم 20% وكان سعره الأصلي 15 د.ك فإن السعر بعد الخصم:", type: "mcq", options: ["12 د.ك", "10 د.ك", "13 د.ك", "3 د.ك"], correct: 0,
      explanation: "الخصم = 15 × 20% = 3 د.ك → السعر الجديد = 15 − 3 = 12 د.ك" },
    { text: "10% من 250 = 25", type: "tf", options: ["صح", "خطأ"], correct: 0,
      explanation: "10% تعني العُشر: 250 ÷ 10 = 25 ✓" },
    { text: "نسبة 3 إلى 5 تُكتب كنسبة مئوية:", type: "mcq", options: ["35%", "60%", "53%", "65%"], correct: 1,
      explanation: "3/5 = 0.6 → 0.6 × 100 = 60%" },
  ],
  "قانون نيوتن الثاني": [
    { text: "الصيغة الرياضية لقانون نيوتن الثاني هي:", type: "mcq", options: ["ق = ك × ت", "ق = ك / ت", "ق = ت / ك", "ق = ك × ع"], correct: 0,
      explanation: "القوة = الكتلة × التسارع (العجلة): F = m·a" },
    { text: "وحدة قياس القوة هي:", type: "mcq", options: ["الجول", "الواط", "النيوتن", "الباسكال"], correct: 2,
      explanation: "النيوتن = كجم·م/ث² — الجول للطاقة، الواط للقدرة، الباسكال للضغط" },
    { text: "كلما زادت كتلة الجسم قلّت عجلته عند ثبات القوة", type: "tf", options: ["صح", "خطأ"], correct: 0,
      explanation: "من ت = ق/ك: العجلة تتناسب عكسيًا مع الكتلة عند ثبات القوة ✓" },
    { text: "جسم كتلته 2 كجم تسارع بعجلة 3 م/ث²، القوة المؤثرة عليه تساوي:", type: "mcq", options: ["5 نيوتن", "6 نيوتن", "1.5 نيوتن", "9 نيوتن"], correct: 1,
      explanation: "ق = ك × ت = 2 × 3 = 6 نيوتن" },
    { text: "العجلة تتناسب عكسيًا مع القوة المؤثرة", type: "tf", options: ["صح", "خطأ"], correct: 1,
      explanation: "خطأ — العجلة تتناسب طرديًا مع القوة وعكسيًا مع الكتلة" },
  ],
  "الجدول الدوري": [
    { text: "عدد الدورات في الجدول الدوري الحديث:", type: "mcq", options: ["6", "7", "8", "18"], correct: 1,
      explanation: "7 دورات أفقية و 18 مجموعة رأسية" },
    { text: "العناصر في المجموعة الواحدة تتشابه في الخواص الكيميائية", type: "tf", options: ["صح", "خطأ"], correct: 0,
      explanation: "لتشابه عدد إلكترونات التكافؤ في المجموعة الواحدة ✓" },
    { text: "عدد المجموعات الرئيسية في الجدول الدوري:", type: "mcq", options: ["7", "8", "18", "32"], correct: 2,
      explanation: "18 عمودًا رأسيًا = 18 مجموعة" },
    { text: "العنصر الذي عدده الذري 11 هو:", type: "mcq", options: ["الصوديوم", "المغنيسيوم", "البوتاسيوم", "الكالسيوم"], correct: 0,
      explanation: "الصوديوم Na عدده الذري 11 — المغنيسيوم 12، البوتاسيوم 19، الكالسيوم 20" },
    { text: "الغازات النبيلة تقع في المجموعة الأولى من الجدول الدوري", type: "tf", options: ["صح", "خطأ"], correct: 1,
      explanation: "الغازات النبيلة في المجموعة الأخيرة (18) — المجموعة الأولى للفلزات القلوية" },
  ],
  "المبتدأ والخبر": [
    { text: "في جملة «العلمُ نورٌ»، كلمة «نور» تُعرب:", type: "mcq", options: ["مبتدأ", "خبر", "فاعل", "نعت"], correct: 1,
      explanation: "«نور» خبر مرفوع أتمّ معنى الجملة الاسمية مع المبتدأ «العلم»" },
    { text: "المبتدأ اسم مرفوع يقع في أول الجملة الاسمية", type: "tf", options: ["صح", "خطأ"], correct: 0,
      explanation: "تعريف المبتدأ: اسم مرفوع تبدأ به الجملة الاسمية ✓" },
    { text: "في جملة «المعلمُ مخلصٌ» المبتدأ هو:", type: "mcq", options: ["مخلص", "المعلم", "لا يوجد مبتدأ", "الجملة فعلية"], correct: 1,
      explanation: "«المعلم» اسم مرفوع في البداية = مبتدأ، و«مخلص» خبره" },
    { text: "الخبر قد يأتي مفردًا أو جملة أو شبه جملة", type: "tf", options: ["صح", "خطأ"], correct: 0,
      explanation: "مثل: العلمُ نافعٌ (مفرد) / العلمُ في المدرسةِ (شبه جملة) ✓" },
    { text: "أي جملة مما يلي جملة اسمية؟", type: "mcq", options: ["كتب الطالب الدرس", "الجوُّ جميلٌ", "اذهب إلى المدرسة", "شربت الماء"], correct: 1,
      explanation: "«الجو جميل» تبدأ باسم = جملة اسمية؛ الباقي جمل فعلية تبدأ بفعل" },
  ],
  "نظرية فيثاغورس": [
    { text: "في المثلث القائم، مربع الوتر يساوي:", type: "mcq", options: ["مجموع الضلعين", "مجموع مربعي الضلعين القائمين", "ضرب الضلعين", "مربع الضلع الأكبر"], correct: 1,
      explanation: "أ² + ب² = جـ² حيث جـ الوتر المقابل للزاوية القائمة" },
    { text: "مثلث قائم ضلعاه 3 و 4 — طول الوتر:", type: "mcq", options: ["5", "6", "7", "12"], correct: 0,
      explanation: "√(9+16) = √25 = 5 — أشهر ثلاثية فيثاغورسية" },
    { text: "نظرية فيثاغورس تنطبق على أي مثلث", type: "tf", options: ["صح", "خطأ"], correct: 1,
      explanation: "تنطبق على المثلث القائم الزاوية فقط" },
    { text: "الوتر هو أطول أضلاع المثلث القائم", type: "tf", options: ["صح", "خطأ"], correct: 0,
      explanation: "الوتر يقابل الزاوية القائمة وهو دائمًا الأطول ✓" },
    { text: "مثلث أضلاعه 6 و 8 و 10 — هل هو قائم؟", type: "mcq", options: ["نعم لأن 36+64=100", "لا", "لا يمكن التحديد", "نعم لأن 6+8=14"], correct: 0,
      explanation: "6²+8² = 100 = 10² → مثلث قائم (مضاعف 3-4-5)" },
  ],
  "قانون أوم": [
    { text: "العلاقة الصحيحة لقانون أوم:", type: "mcq", options: ["جـ = ت × م", "جـ = ت / م", "جـ = م / ت", "جـ = ت² × م"], correct: 0,
      explanation: "الجهد = التيار × المقاومة: V = I·R" },
    { text: "وحدة قياس المقاومة الكهربائية:", type: "mcq", options: ["الفولت", "الأمبير", "الأوم", "الواط"], correct: 2,
      explanation: "المقاومة تُقاس بالأوم (Ω)" },
    { text: "دائرة فيها جهد 12 فولت ومقاومة 4 أوم — التيار يساوي:", type: "mcq", options: ["3 أمبير", "48 أمبير", "8 أمبير", "0.33 أمبير"], correct: 0,
      explanation: "ت = جـ/م = 12 ÷ 4 = 3 أمبير" },
    { text: "عند ثبات الجهد، كلما زادت المقاومة زاد التيار", type: "tf", options: ["صح", "خطأ"], correct: 1,
      explanation: "التيار يتناسب عكسيًا مع المقاومة: زيادة المقاومة تقلّل التيار" },
  ],
  "كان وأخواتها": [
    { text: "«كان الجوُّ جميلًا» — إعراب «جميلًا»:", type: "mcq", options: ["خبر كان منصوب", "خبر مرفوع", "مبتدأ", "حال"], correct: 0,
      explanation: "كان وأخواتها ترفع المبتدأ (اسمها) وتنصب الخبر (خبرها)" },
    { text: "كان وأخواتها تدخل على الجملة الفعلية", type: "tf", options: ["صح", "خطأ"], correct: 1,
      explanation: "تدخل على الجملة الاسمية فقط — ترفع المبتدأ اسمًا وتنصب الخبر" },
    { text: "أي مما يلي من أخوات كان؟", type: "mcq", options: ["ذهب", "أصبح", "كتب", "قرأ"], correct: 1,
      explanation: "أصبح، أمسى، ظل، بات، صار — أفعال ناسخة مثل كان" },
    { text: "في «صار الطالبُ مجتهدًا» اسم كان هو:", type: "mcq", options: ["مجتهدًا", "الطالبُ", "صار", "لا يوجد"], correct: 1,
      explanation: "«الطالب» مرفوع = اسم صار، و«مجتهدًا» منصوب = خبرها" },
  ],
  "سورة الملك": [
    { text: "سورة الملك تسمى أيضًا:", type: "mcq", options: ["الفاتحة", "المنجية والمانعة", "الإخلاص", "يس"], correct: 1,
      explanation: "تُسمى المنجية والمانعة لأنها تنجي صاحبها من عذاب القبر" },
    { text: "عدد آيات سورة الملك:", type: "mcq", options: ["10", "20", "30", "40"], correct: 2,
      explanation: "30 آية — كان النبي ﷺ يقرؤها قبل النوم" },
    { text: "سورة الملك سورة مكية", type: "tf", options: ["صح", "خطأ"], correct: 0,
      explanation: "نعم، من السور المكية وتتناول عظمة الخلق والتدبر ✓" },
  ],
};

// ===================== مولد الأسئلة العام =====================
function genQuestions(lessonId: string, lessonTitle: string, subjectName: string): Question[] {
  const real = REAL_QUESTIONS[lessonTitle];
  if (real) return real.map((q, i) => ({ ...q, id: `${lessonId}-q${i}`, lessonId }));

  const templates: Omit<Question, "id" | "lessonId">[] = [
    { text: `أي مما يلي يُعد من أساسيات درس «${lessonTitle}»؟`, type: "mcq", options: ["الفهم الصحيح للمفاهيم", "الحفظ دون فهم", "تجاهل الأمثلة", "الاكتفاء بالقراءة"], correct: 0 },
    { text: `درس «${lessonTitle}» جزء من مادة ${subjectName}`, type: "tf", options: ["صح", "خطأ"], correct: 0 },
    { text: `عند مراجعة درس «${lessonTitle}» يُنصح بـ:`, type: "mcq", options: ["حل الأمثلة والتدريبات", "المذاكرة ليلة الاختبار فقط", "حفظ التعاريف دون أمثلة", "تجاهل المذكرة"], correct: 0 },
    { text: `الفهم المتدرج لأفكار الدرس يساعد على التثبيت في الذاكرة`, type: "tf", options: ["صح", "خطأ"], correct: 0 },
    { text: `أفضل طريقة للاستعداد لاختبار درس «${lessonTitle}» هي:`, type: "mcq", options: ["مشاهدة الفيديو + قراءة المذكرة + حل تدريبات", "مشاهدة الفيديو فقط", "قراءة العنوان", "السهر قبل الاختبار"], correct: 0 },
    { text: `يُفضَّل تسجيل ملاحظاتك أثناء مشاهدة شرح الدرس`, type: "tf", options: ["صح", "خطأ"], correct: 0 },
  ];
  return templates.map((q, i) => ({ ...q, id: `${lessonId}-q${i}`, lessonId }));
}

// ===================== بناء المنهج =====================
function buildCurriculum() {
  const subjects: Subject[] = [];
  const units: Unit[] = [];
  const lessons: Lesson[] = [];
  const questions: Question[] = [];
  let t = 0;

  for (const grade of GRADES) {
    const list = SUBJECTS_BY_STAGE[grade.stageId] ?? [];
    for (const s of list) {
      const subjectId = `${grade.id}-${s.name.replace(/\s/g, "_")}`;
      subjects.push({ id: subjectId, name: s.name, gradeId: grade.id, teacher: TEACHERS[t++ % TEACHERS.length], color: s.color, icon: s.icon });

      const bank = CURRICULUM[s.name] ?? CURRICULUM["العلوم"];
      bank.forEach((u, ui) => {
        const unitId = `${subjectId}-u${ui}`;
        units.push({ id: unitId, subjectId, title: u.unit, order: ui });
        u.lessons.forEach((lt, li) => {
          const lessonId = `${unitId}-l${li}`;
          lessons.push({
            id: lessonId, unitId, title: lt,
            durationMin: 8 + ((ui * 3 + li * 7) % 18),
            videoUrl: VIDEOS[(ui + li) % VIDEOS.length],
            free: ui === 0 && li === 0,
            note: [
              { heading: `مقدمة عن ${lt}`, body: `في هذا الدرس من مادة ${s.name} نتناول «${lt}» ضمن وحدة ${u.unit}. صُممت هذه المذكرة لتلخص أهم الأفكار بطريقة مبسطة تساعدك على الفهم السريع والمراجعة الفعالة قبل الاختبار.`, points: ["تحديد المفاهيم الأساسية للدرس", "ربط الأفكار الجديدة بالمعلومات السابقة", "تطبيق ما تعلمته على أمثلة محلولة"] },
              { heading: "الأفكار الرئيسية", body: `يغطي درس «${lt}» مجموعة من المفاهيم المتدرجة التي تبني فهمك خطوة بخطوة. ابدأ بالأمثلة المحلولة في الفيديو ثم عُد لهذه المذكرة لتثبيت المعلومة.`, points: ["المفهوم الأول وتعريفه الدقيق", "الخطوات المتبعة في الحل", "الأخطاء الشائعة التي يقع فيها الطلاب", "نصائح المعلم لحل الأسئلة بسرعة"] },
              { heading: "ملخص وتدريبات", body: `راجع النقاط السابقة ثم اختبر نفسك بالاختبار الإلكتروني المرفق. التصحيح التلقائي سيوضح لك نقاط قوتك وضعفك فورًا.`, points: ["أعد مشاهدة الجزء الذي لم تفهمه من الفيديو", "حل الاختبار دون الرجوع للمذكرة", "راجع أخطاءك من تقرير الأداء"] },
            ],
          });
          questions.push(...genQuestions(lessonId, lt, s.name));
        });
      });
    }
  }
  return { subjects, units, lessons, questions };
}

const built = buildCurriculum();

// ===================== المستخدمون =====================
const USERS: User[] = [
  { id: "s1", name: "أحمد الكندري", role: "student", phone: "99112233", gradeId: "g10", active: true, joinedAt: "2025-09-01" },
  { id: "s2", name: "سارة الكندري", role: "student", phone: "99112234", gradeId: "g7", active: true, joinedAt: "2025-09-01" },
  { id: "s3", name: "عبدالله المطيري", role: "student", phone: "99112235", gradeId: "g10", active: true, joinedAt: "2025-09-15" },
  { id: "s4", name: "نورة العنزي", role: "student", phone: "99112236", gradeId: "g11", active: false, joinedAt: "2025-10-02" },
  { id: "p1", name: "خالد الكندري", role: "parent", phone: "99112240", childrenIds: ["s1", "s2"], active: true, joinedAt: "2025-09-01" },
  { id: "a1", name: "مدير المنصة", role: "admin", phone: "99112299", active: true, joinedAt: "2025-08-01" },
];

// ===================== الباقات =====================
const PACKAGES: Package[] = [
  {
    id: "pkg-subject", name: "باقة المادة", scope: "subject", priceKwd: 9.9, period: "شهريًا",
    features: ["مادة واحدة كاملة", "كل الفيديوهات والمذكرات", "اختبارات غير محدودة", "تقرير أداء شهري"],
  },
  {
    id: "pkg-stage", name: "باقة المرحلة", scope: "stage", priceKwd: 19.9, period: "شهريًا", popular: true,
    features: ["جميع مواد المرحلة", "فيديوهات + مذكرات PDF", "اختبارات ذكية غير محدودة", "تقارير أداء مفصلة", "متابعة لولي الأمر"],
  },
  {
    id: "pkg-year", name: "الباقة الذهبية", scope: "all", priceKwd: 149, period: "سنويًا",
    features: ["كل مميزات باقة المرحلة", "مراجعة نهائية قبل الاختبارات", "أولوية الرد على الأسئلة", "شهادة إتمام لكل مادة"],
  },
];

// ===================== بناء قاعدة البيانات =====================
export function seedDB(): DB {
  // محاولات سابقة للطالب أحمد — تواريخ نسبية عشان الستريك/الهدف يبانوا حيّين
  const D = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10);
  const mathLessons = built.lessons.filter((l) => l.unitId.startsWith("g10-الرياضيات"));
  const physLessons = built.lessons.filter((l) => l.unitId.startsWith("g10-الفيزياء"));
  const s2Math = built.lessons.filter((l) => l.unitId.startsWith("g7-الرياضيات"));
  const s2Free = built.lessons.filter((l) => l.free && l.unitId.startsWith("g7-"));

  const attempts: Attempt[] = [
    { id: "at1", userId: "s1", lessonId: mathLessons[0]?.id ?? "", score: 4, total: 6, date: D(0), timeTakenSec: 240 },
    { id: "at2", userId: "s1", lessonId: mathLessons[3]?.id ?? "", score: 5, total: 6, date: D(1), timeTakenSec: 300 },
    { id: "at3", userId: "s1", lessonId: physLessons[0]?.id ?? "", score: 3, total: 6, date: D(1), timeTakenSec: 280 },
    { id: "at4", userId: "s1", lessonId: physLessons[4]?.id ?? "", score: 4, total: 5, date: D(2), timeTakenSec: 200 },
    { id: "at5", userId: "s1", lessonId: mathLessons[8]?.id ?? "", score: 2, total: 6, date: D(3), timeTakenSec: 320 },
    { id: "at6", userId: "s2", lessonId: s2Math[0]?.id ?? "", score: 5, total: 6, date: D(1), timeTakenSec: 260 },
    { id: "at7", userId: "s2", lessonId: s2Free[2]?.id ?? s2Math[1]?.id ?? "", score: 3, total: 6, date: D(3), timeTakenSec: 290 },
    { id: "at8", userId: "s3", lessonId: mathLessons[0]?.id ?? "", score: 6, total: 6, date: D(2), timeTakenSec: 180 },
  ];

  const now = new Date();
  const end = new Date(now.getTime() + 21 * 86400000);

  return {
    stages: STAGES,
    grades: GRADES,
    subjects: built.subjects,
    units: built.units,
    lessons: built.lessons,
    questions: built.questions,
    users: USERS,
    attempts,
    packages: PACKAGES,
    subscriptions: [
      { id: "sub1", userId: "s1", packageId: "pkg-stage", startDate: now.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10), status: "active" },
      { id: "sub2", userId: "s3", packageId: "pkg-subject", startDate: D(50), endDate: D(20), status: "expired" },
      { id: "sub3", userId: "s2", packageId: "pkg-subject", startDate: D(34), endDate: D(4), status: "expired" },
    ],
    payments: [
      { id: "pay1", userId: "s1", packageName: "باقة المرحلة", amountKwd: 19.9, method: "KNET", date: D(9), status: "success" },
      { id: "pay2", userId: "s3", packageName: "باقة المادة", amountKwd: 9.9, method: "Visa", date: D(40), status: "success" },
      { id: "pay3", userId: "s4", packageName: "باقة المرحلة", amountKwd: 19.9, method: "KNET", date: D(6), status: "failed" },
      { id: "pay4", userId: "s2", packageName: "باقة المادة", amountKwd: 9.9, method: "Mastercard", date: D(4), status: "success" },
    ],
    discountCodes: [{ code: "KUWAIT20", pct: 20 }, { code: "AHLAN10", pct: 10 }],
  };
}

// ===================== مساعدات =====================
export function gradeOf(db: DB, gradeId?: string) {
  return db.grades.find((g) => g.id === gradeId);
}
export function stageOfGrade(db: DB, gradeId?: string) {
  const g = gradeOf(db, gradeId);
  return db.stages.find((s) => s.id === g?.stageId);
}
export function subjectsOfGrade(db: DB, gradeId?: string) {
  return db.subjects.filter((s) => s.gradeId === gradeId);
}
export function unitsOfSubject(db: DB, subjectId: string) {
  return db.units.filter((u) => u.subjectId === subjectId).sort((a, b) => a.order - b.order);
}
export function lessonsOfUnit(db: DB, unitId: string) {
  return db.lessons.filter((l) => l.unitId === unitId);
}
export function questionsOfLesson(db: DB, lessonId: string) {
  return db.questions.filter((q) => q.lessonId === lessonId);
}
export function lessonById(db: DB, lessonId: string) {
  return db.lessons.find((l) => l.id === lessonId);
}
export function unitById(db: DB, unitId: string) {
  return db.units.find((u) => u.id === unitId);
}
export function subjectById(db: DB, subjectId: string) {
  return db.subjects.find((s) => s.id === subjectId);
}
export function subjectOfLesson(db: DB, lessonId: string) {
  const l = lessonById(db, lessonId);
  const u = l && unitById(db, l.unitId);
  return u && subjectById(db, u.subjectId);
}
export function attemptsOfUser(db: DB, userId: string) {
  return db.attempts.filter((a) => a.userId === userId);
}
export function activeSub(db: DB, userId: string) {
  return db.subscriptions.find((s) => s.userId === userId && s.status === "active");
}
/** حماية المحتوى: الدرس متاح لو مجاني أو ضمن نطاق اشتراك المستخدم */
export function canAccessLesson(db: DB, userId: string | undefined, lesson: Lesson) {
  if (lesson.free) return true;
  if (!userId) return false;
  const sub = activeSub(db, userId);
  if (!sub) return false;
  const pkg = packageById(db, sub.packageId);
  if (pkg?.scope === "subject" && sub.subjectId) {
    return subjectOfLesson(db, lesson.id)?.id === sub.subjectId;
  }
  return true;
}
export function packageById(db: DB, id: string) {
  return db.packages.find((p) => p.id === id);
}
export function userById(db: DB, id: string) {
  return db.users.find((u) => u.id === id);
}
