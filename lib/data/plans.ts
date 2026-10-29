import { l, type L } from "@/lib/i18n/config";
import type { PlanRaw, RoomKind, RoomRaw } from "./types";

const r = (id: string, name: L, kind: RoomKind, x: number, y: number, w: number, h: number, note: L): RoomRaw => ({ id, name, kind, x, y, w, h, note });

/**
 * Conceptual plans on a unit grid. Areas are derived from rectangle size × scale²,
 * so the drawings and the stated areas can never disagree.
 */
export const plansRaw: PlanRaw[] = [
  {
    slug: "house-of-silence", scale: 0.3, width: 120, height: 70,
    levels: [
      { id: "l0", name: l("Ground level", "الطابق الأرضي"), rooms: [
        r("hall", l("Living hall", "قاعة المعيشة"), "living", 10, 10, 50, 30, l("The double-height heart of the house, lit by a single slot of sky.", "قلب البيت بارتفاع مزدوج، يضيئه شقّ واحد من السماء.")),
        r("kitchen", l("Kitchen", "المطبخ"), "service", 60, 10, 25, 20, l("A long limestone bench facing the garden wall.", "طاولة حجر جيري طويلة تواجه جدار الحديقة.")),
        r("pantry", l("Pantry", "المخزن"), "service", 60, 30, 25, 10, l("Cool storage on the shaded north side.", "تخزين بارد على الجهة الشمالية المظللة.")),
        r("study", l("Composer's study", "مكتب الملحّن"), "private", 85, 10, 25, 30, l("Acoustically isolated; walls and ceiling are lime-plastered.", "معزول صوتيًا؛ الجدران والسقف مطليّة بالجص الجيري.")),
        r("silence", l("Room of silence", "غرفة الصمت"), "private", 10, 40, 30, 20, l("Windowless. The quietest room we have built.", "بلا نوافذ. أهدأ غرفة بنيناها.")),
        r("entry", l("Entry passage", "ممر المدخل"), "circulation", 40, 40, 30, 20, l("A compressed, dark threshold before the hall opens.", "عتبة مضغوطة معتمة قبل أن تنفتح القاعة.")),
        r("terrace", l("South terrace", "الشرفة الجنوبية"), "outdoor", 70, 40, 40, 20, l("Shaded by the cantilevered volume above.", "مظلّلة بالكتلة البارزة فوقها.")),
      ] },
      { id: "l1", name: l("Upper level", "الطابق العلوي"), rooms: [
        r("suite1", l("Primary suite", "الجناح الرئيسي"), "private", 10, 10, 45, 30, l("Opens to a continuous strip window facing the plain.", "ينفتح على نافذة شريطية متصلة تواجه السهل.")),
        r("bath", l("Bathroom", "الحمام"), "service", 55, 10, 20, 15, l("Travertine walls and a single skylight.", "جدران ترافرتين وكوة سماوية واحدة.")),
        r("dress", l("Dressing room", "غرفة الملابس"), "private", 55, 25, 20, 15, l("Smoked-oak joinery floor to ceiling.", "نجارة بلوط مدخّن من الأرض إلى السقف.")),
        r("suite2", l("Guest suite", "جناح الضيوف"), "private", 75, 10, 35, 30, l("Mirrors the primary suite in smaller scale.", "يكرّر الجناح الرئيسي بمقياس أصغر.")),
        r("library", l("Library loft", "علّية المكتبة"), "living", 10, 40, 60, 20, l("Overlooks the hall through a deep concrete frame.", "تطل على القاعة عبر إطار خرساني عميق.")),
        r("roof", l("Roof terrace", "شرفة السطح"), "outdoor", 70, 40, 40, 20, l("The cantilever: sheltered, open on three sides.", "الجزء البارز: محمي ومفتوح من ثلاث جهات.")),
      ] },
    ],
  },
  {
    slug: "courtyard-no-07", scale: 0.25, width: 120, height: 80,
    levels: [
      { id: "l0", name: l("Courtyard level", "مستوى الفناء"), rooms: [
        r("salon", l("Salon", "الصالون"), "living", 10, 5, 100, 20, l("A long room opening to the court through a row of timber doors.", "غرفة طويلة تنفتح على الفناء عبر صف من الأبواب الخشبية.")),
        r("library", l("Library", "المكتبة"), "living", 10, 25, 30, 30, l("Books to the ceiling; one window onto the tree.", "كتب حتى السقف ونافذة واحدة على الشجرة.")),
        r("court", l("Court & pool", "الفناء والبركة"), "outdoor", 40, 25, 40, 30, l("The climate engine of the house: shade, water and one orange tree.", "محرّك مناخ البيت: ظلّ وماء وشجرة برتقال واحدة.")),
        r("kitchen", l("Kitchen", "المطبخ"), "service", 80, 25, 30, 30, l("Opens to a service lane on the east edge.", "ينفتح على ممر خدمة في الطرف الشرقي.")),
        r("bed1", l("Bedroom one", "غرفة النوم الأولى"), "private", 10, 55, 40, 20, l("Cross-ventilated through the court.", "تهوية متقاطعة عبر الفناء.")),
        r("bed2", l("Bedroom two", "غرفة النوم الثانية"), "private", 50, 55, 30, 20, l("Smaller, darker, cooler.", "أصغر وأكثر عتمة وبرودة.")),
        r("bath", l("Hammam", "الحمّام"), "service", 80, 55, 30, 20, l("Travertine and lime plaster, lit from above.", "ترافرتين وجصّ جيري يُضاء من الأعلى.")),
      ] },
    ],
  },
  {
    slug: "earth-form", scale: 0.25, width: 120, height: 70,
    levels: [
      { id: "l0", name: l("Ground level", "الطابق الأرضي"), rooms: [
        r("living", l("Living & dining", "المعيشة والطعام"), "living", 10, 10, 55, 30, l("One open room beneath the deepest rammed-earth walls.", "غرفة مفتوحة واحدة تحت أعمق جدران الطين المدكوك.")),
        r("kitchen", l("Kitchen", "المطبخ"), "service", 65, 10, 25, 20, l("Clay-tile counters made from site soil.", "أسطح من بلاط الطين صُنعت من تربة الموقع.")),
        r("store", l("Store", "المخزن"), "service", 65, 30, 25, 10, l("Thick walls keep it naturally cool.", "تبقيه الجدران السميكة باردًا بشكل طبيعي.")),
        r("bed1", l("Bedroom one", "غرفة النوم الأولى"), "private", 90, 10, 20, 30, l("East light for early mornings.", "ضوء شرقي للصباحات الباكرة.")),
        r("patio", l("Patio", "الباحة"), "outdoor", 10, 40, 40, 20, l("A walled outdoor room with a seasonal stream.", "غرفة خارجية مسوّرة بمجرى موسمي.")),
        r("bed2", l("Bedroom two", "غرفة النوم الثانية"), "private", 50, 40, 30, 20, l("Opens onto the patio.", "تنفتح على الباحة.")),
        r("bath", l("Bathroom", "الحمام"), "service", 80, 40, 30, 20, l("Lime-plastered, with a rain-fed shower.", "مطلي بالجص الجيري مع دش يعمل بمياه المطر.")),
      ] },
    ],
  },
  {
    slug: "desert-observatory", scale: 0.5, width: 120, height: 70,
    levels: [
      { id: "l0", name: l("Research level", "مستوى الأبحاث"), rooms: [
        r("hall", l("Telescope hall", "قاعة التلسكوب"), "living", 10, 10, 50, 40, l("A retractable roof opens the full hall to the sky.", "سقف منزلق يفتح القاعة كاملة على السماء.")),
        r("lab", l("Laboratory", "المختبر"), "service", 60, 10, 30, 25, l("Thermally isolated from the hall.", "معزول حراريًا عن القاعة.")),
        r("common", l("Common room", "الغرفة المشتركة"), "living", 90, 10, 20, 25, l("Red-lit, so eyes stay dark-adapted.", "إضاءة حمراء كي تبقى العيون متكيّفة مع العتمة.")),
        r("ramp", l("Ramp", "المنحدر"), "circulation", 60, 35, 50, 15, l("A long, gentle ramp from the dunes.", "منحدر طويل لطيف من الكثبان.")),
        r("dark", l("Dark court", "الفناء المعتم"), "outdoor", 10, 50, 100, 10, l("Unlit; the sky begins here.", "غير مضاء؛ تبدأ السماء من هنا.")),
      ] },
      { id: "l1", name: l("Guest level", "مستوى الضيوف"), rooms: [
        r("wingA", l("Guest wing A", "جناح الضيوف أ"), "private", 10, 10, 50, 25, l("Ten rooms, each with a single framed view of the sky.", "عشر غرف لكل منها إطلالة واحدة مؤطّرة على السماء.")),
        r("wingB", l("Guest wing B", "جناح الضيوف ب"), "private", 60, 10, 50, 25, l("Ten rooms facing the dunes.", "عشر غرف تواجه الكثبان.")),
        r("corridor", l("Gallery corridor", "ممر المعرض"), "circulation", 10, 35, 100, 8, l("Long, windowless and quiet.", "طويل وهادئ وبلا نوافذ.")),
        r("deck", l("Stargazing deck", "سطح مراقبة النجوم"), "outdoor", 10, 43, 100, 17, l("Open to the sky; red lighting only.", "مفتوح على السماء؛ إضاءة حمراء فقط.")),
      ] },
    ],
  },
];
