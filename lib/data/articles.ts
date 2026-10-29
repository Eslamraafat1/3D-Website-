import { l } from "@/lib/i18n/config";
import type { ArticleRaw } from "./types";

/** Original fictional essays. */
export const articlesRaw: ArticleRaw[] = [
  {
    id: "a1", slug: "the-weight-of-light", category: "light",
    title: l("The Weight of Light", "ثِقَل الضوء"),
    excerpt: l("Why thick walls make the best light, and what a single slot of sky can teach a house.", "لماذا تصنع الجدران السميكة أفضل ضوء، وماذا يستطيع شقّ واحد من السماء أن يعلّم بيتًا."),
    art: { variant: "interior", seed: 301, tone: "warm" }, publishedAt: "2026-03-12", readingTime: 6, author: "noor-haddad",
    content: [
      { type: "p", text: l("Light has no weight, yet architects spend careers trying to give it some. In a thin-walled building, light arrives everywhere at once and settles nowhere. In a thick wall, it must travel.", "ليس للضوء وزن، ومع ذلك يقضي المعماريون حياتهم محاولين منحه بعضًا منه. في المبنى رقيق الجدران يصل الضوء إلى كل مكان دفعة واحدة ولا يستقر في أي مكان. أما في الجدار السميك فعليه أن يسافر.") },
      { type: "h2", text: l("The depth of an opening", "عمق الفتحة") },
      { type: "p", text: l("A window set deep into sixty centimetres of concrete is not a hole but a small room of its own. The sill catches a bar of sun; the reveal glows; the view is framed twice. We draw these sections before we draw any plan.", "النافذة المغروسة في ستين سنتيمترًا من الخرسانة ليست ثقبًا بل غرفة صغيرة قائمة بذاتها. يلتقط العتب شريطًا من الشمس، ويتوهّج الجانب، ويتأطر المنظر مرتين. نرسم هذه المقاطع قبل أن نرسم أي مخطط.") },
      { type: "image", art: { variant: "detail", seed: 302, tone: "warm" }, caption: l("A reveal in board-formed concrete at 4 p.m.", "جانب فتحة في خرسانة بقوالب خشبية عند الرابعة عصرًا.") },
      { type: "quote", text: l("Good light is not bright. It is specific.", "الضوء الجيد ليس ساطعًا. إنه محدَّد.") },
      { type: "p", text: l("In House of Silence a single slot above the hall moves a blade of light across the floor over the course of a day. The family has stopped wearing watches indoors. That is the highest compliment we have received.", "في بيت الصمت يحرّك شقّ واحد فوق القاعة نصل ضوء عبر الأرض على مدار اليوم. توقّفت العائلة عن ارتداء الساعات داخل البيت. هذا أعلى إطراء تلقيناه.") },
    ],
  },
  {
    id: "a2", slug: "limestone-a-slow-material", category: "materials",
    title: l("Limestone: A Slow Material", "الحجر الجيري: مادة بطيئة"),
    excerpt: l("Notes from the laboratory on how pale stone ages, stains and — eventually — heals.", "ملاحظات من المختبر عن كيف يشيخ الحجر الفاتح ويتبقّع ثم يلتئم في النهاية."),
    art: { variant: "limestone", seed: 311, tone: "warm" }, publishedAt: "2026-01-28", readingTime: 5, author: "mateo-ruiz",
    content: [
      { type: "p", text: l("We keep forty limestone samples on weathering racks on the studio roof. Some are three years old. None of them looks the same as the day it was cut.", "نحتفظ بأربعين عيّنة من الحجر الجيري على أرفف التعريض فوق سطح الاستوديو. بعضها عمره ثلاث سنوات. ولا واحدة منها تبدو كما كانت يوم قُطعت.") },
      { type: "h2", text: l("Stains are a language", "البقع لغة") },
      { type: "p", text: l("Rain-run, lichen, a darker belt at the splash line: these are not failures of detailing but the stone's own handwriting. The task is to design so the marks fall where we want them.", "آثار المطر والأشنة وحزام أغمق عند خط الرشاش: ليست إخفاقًا في التفصيل بل خطّ الحجر نفسه. المهمة أن نصمّم بحيث تقع العلامات حيث نريد.") },
      { type: "image", art: { variant: "travertine", seed: 312, tone: "warm" }, caption: l("Honed limestone beside unfilled travertine after two winters.", "حجر جيري مصقول بجانب ترافرتين غير مملوء بعد شتاءين.") },
      { type: "p", text: l("Limestone also heals. Surface calcite redissolves and redeposits, closing hairline cracks. A material that repairs itself is a good partner for a building meant to last a century.", "الحجر الجيري يلتئم أيضًا. تذوب الكالسيت السطحية وتترسّب من جديد فتغلق الشقوق الشعرية. المادة التي تصلح نفسها شريك جيد لمبنى أُريد له أن يدوم قرنًا.") },
    ],
  },
  {
    id: "a3", slug: "designing-for-the-next-hundred-years", category: "sustainability",
    title: l("Designing for the Next Hundred Years", "التصميم للمئة عام القادمة"),
    excerpt: l("Sustainability is not a label. It is the discipline of making things that are worth repairing.", "الاستدامة ليست علامة. إنها انضباط صناعة أشياء تستحق الإصلاح."),
    art: { variant: "earth", seed: 321, tone: "dusk" }, publishedAt: "2025-11-05", readingTime: 7, author: "elias-varga",
    content: [
      { type: "p", text: l("The greenest building is not the one with the best rating on opening day. It is the one still standing, still loved, and still repairable in 2126.", "المبنى الأكثر خضرة ليس صاحب أفضل تقييم يوم الافتتاح. إنه ذاك الذي ما زال قائمًا ومحبوبًا وقابلًا للإصلاح في عام 2126.") },
      { type: "h2", text: l("Repairability as a design brief", "قابلية الإصلاح كموجز تصميمي") },
      { type: "p", text: l("We ask of every detail: who will mend this, with what, and in which century? A bolted connection can be replaced. A glued one cannot. A lime plaster can be patched invisibly; a polymer coating must be stripped.", "نسأل عن كل تفصيل: من سيصلح هذا، وبماذا، وفي أي قرن؟ يمكن استبدال الوصلة المربوطة بالمسامير، ولا يمكن استبدال الملصوقة. يمكن ترقيع الجص الجيري بلا أثر، أما الطلاء البوليمري فيجب نزعه.") },
      { type: "quote", text: l("Embodied carbon is spent once. Maintenance is spent forever.", "الكربون المتجسد يُنفق مرة واحدة. أما الصيانة فتُنفق إلى الأبد.") },
      { type: "image", art: { variant: "earth", seed: 322, tone: "warm" }, caption: l("Rammed-earth test wall, layered from three excavation depths.", "جدار اختبار من الطين المدكوك مُنضَّد من ثلاثة أعماق حفر.") },
      { type: "p", text: l("Our rammed-earth work in Oaxaca is the clearest expression of this idea: a wall made from the ground it stands on, which can return to that ground when the time comes.", "عملنا بالطين المدكوك في واخاكا هو أوضح تعبير عن هذه الفكرة: جدار مصنوع من الأرض التي يقف عليها، ويمكنه أن يعود إليها حين يحين الوقت.") },
    ],
  },
  {
    id: "a4", slug: "the-grammar-of-thresholds", category: "space",
    title: l("The Grammar of Thresholds", "نحو العتبات"),
    excerpt: l("Compression, pause, release: how the smallest spaces in a building decide how we feel in the largest.", "ضغط وتوقّف وانفراج: كيف تقرّر أصغر الفراغات في المبنى شعورنا في أكبرها."),
    art: { variant: "threshold", seed: 331, tone: "cool" }, publishedAt: "2025-09-19", readingTime: 4, author: "sana-okafor",
    content: [
      { type: "p", text: l("A threshold is the sentence that comes before a paragraph. It sets the tone, the tempo and the expectation. A good one costs almost nothing and changes everything.", "العتبة هي الجملة التي تسبق الفقرة. تحدّد النبرة والإيقاع والتوقّع. الجيدة منها لا تكلّف شيئًا تقريبًا وتغيّر كل شيء.") },
      { type: "h2", text: l("Compress, then release", "اضغط ثم أطلق") },
      { type: "p", text: l("Enter a low, dark passage and the hall beyond feels twice as tall. We use this at Courtyard No. 07, where a bent entry corridor makes the court a surprise even for those who live there.", "ادخل ممرًا منخفضًا معتمًا فتبدو القاعة بعده بضعف ارتفاعها. نستخدم هذا في الفناء رقم 07، حيث يجعل ممر الدخول المنحني من الفناء مفاجأة حتى لمن يسكنون فيه.") },
      { type: "image", art: { variant: "court", seed: 332, tone: "warm" }, caption: l("The court seen from the end of the entry passage.", "الفناء كما يُرى من نهاية ممر الدخول.") },
      { type: "quote", text: l("A building is remembered by its doors.", "يُذكَر المبنى بأبوابه.") },
    ],
  },
];
