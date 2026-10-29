import { l } from "@/lib/i18n/config";
import type { TeamMemberRaw } from "./types";

/** Fictional people. */
export const teamRaw: TeamMemberRaw[] = [
  { id: "elias-varga", name: "Elias Varga", role: l("Founding Principal", "الشريك المؤسس"),
    bio: l("Trained as a stone mason before architecture. Leads the studio's largest commissions and insists on drawing every first section by hand.", "تدرّب نحّاتَ حجر قبل العمارة. يقود أكبر مشاريع الاستوديو ويصرّ على رسم كل مقطع أول باليد."),
    art: { variant: "portrait", seed: 101, tone: "warm" } },
  { id: "noor-haddad", name: "Noor Haddad", role: l("Design Director", "مديرة التصميم"),
    bio: l("Specialises in courtyard typologies and passive cooling. Spends part of every year documenting vernacular houses.", "متخصصة في نماذج الأفنية والتبريد السلبي. تقضي جزءًا من كل عام في توثيق البيوت التقليدية."),
    art: { variant: "portrait", seed: 102, tone: "dusk" } },
  { id: "mateo-ruiz", name: "Mateo Ruiz", role: l("Head of Material Research", "رئيس أبحاث المواد"),
    bio: l("Runs the laboratory and its weathering racks. Believes every material is honest if it is allowed to fail slowly.", "يدير المختبر وأرفف التعريض الجوي. يؤمن بأن كل مادة صادقة إن تُركت تفشل ببطء."),
    art: { variant: "portrait", seed: 103, tone: "cool" } },
  { id: "sana-okafor", name: "Sana Okafor", role: l("Associate Architect", "مهندسة معمارية مشاركة"),
    bio: l("Leads cultural and temporary works, with a focus on demountable construction and reuse.", "تقود الأعمال الثقافية والمؤقتة، مع تركيز على البناء القابل للفك وإعادة الاستخدام."),
    art: { variant: "portrait", seed: 104, tone: "warm" } },
  { id: "jonas-lindqvist", name: "Jonas Lindqvist", role: l("Technical Director", "المدير التقني"),
    bio: l("Coordinates structure, envelope and site. Known for details so simple they look inevitable.", "ينسّق الإنشاء والغلاف والموقع. معروف بتفاصيل بسيطة حتى تبدو حتمية."),
    art: { variant: "portrait", seed: 105, tone: "night" } },
];
