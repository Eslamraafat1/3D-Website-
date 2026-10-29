import type { L } from "@/lib/i18n/config";

export type ArtVariant =
  | "monolith" | "stack" | "fins" | "observatory" | "court" | "pavilion" | "earth" | "terrace"
  | "tower" | "interior" | "detail" | "threshold" | "portrait"
  | "limestone" | "concrete" | "steel" | "oak" | "travertine" | "stone";
export type ArtTone = "warm" | "dusk" | "cool" | "night";
export type ArtSpec = { variant: ArtVariant; seed: number; tone: ArtTone };

export type CategoryId = "residential" | "cultural" | "hospitality" | "commercial" | "installation" | "research";
export type StatusId = "completed" | "construction" | "design" | "temporary";
export type ServiceId = "architecture" | "interiors" | "landscape" | "research" | "masterplan" | "installation";
export type MaterialId = "limestone" | "concrete" | "steel" | "oak" | "travertine" | "stone";
export type ViewId = "elevation" | "detail" | "interior" | "aerial" | "threshold" | "context";

export type ProjectRaw = {
  id: string;
  slug: string;
  number: string;
  title: L;
  category: CategoryId;
  location: L;
  country: L;
  year: number;
  area: number;
  duration: number;
  status: StatusId;
  typology: L;
  summary: L;
  concept: L;
  brief: L;
  challenges: [L, L];
  solutions: [L, L];
  coords: { lat: number; lon: number };
  art: ArtSpec;
  gallery: { art: ArtSpec; view: ViewId }[];
  materials: MaterialId[];
  services: ServiceId[];
  metrics: { label: L; value: number; unit?: string | L }[];
  team: string[];
  accent: string;
  featured?: boolean;
};

/** Fully localised projection used by every UI component. */
export type ProjectView = {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: CategoryId;
  categoryLabel: string;
  location: string;
  country: string;
  year: number;
  area: number;
  duration: number;
  status: StatusId;
  statusLabel: string;
  typology: string;
  summary: string;
  concept: string;
  brief: string;
  challenges: string[];
  solutions: string[];
  coordsLabel: string;
  art: ArtSpec;
  gallery: { art: ArtSpec; view: ViewId; viewLabel: string; alt: string }[];
  materials: MaterialId[];
  services: string[];
  metrics: { label: string; value: number; unit?: string }[];
  team: string[];
  accent: string;
  featured: boolean;
};

export type RoomKind = "living" | "private" | "service" | "circulation" | "outdoor";
export type RoomRaw = { id: string; name: L; kind: RoomKind; x: number; y: number; w: number; h: number; note: L };
export type PlanLevelRaw = { id: string; name: L; rooms: RoomRaw[] };
export type PlanRaw = { slug: string; scale: number; width: number; height: number; levels: PlanLevelRaw[] };

export type PlanView = {
  slug: string;
  width: number;
  height: number;
  levels: { id: string; name: string; rooms: { id: string; name: string; kind: RoomKind; x: number; y: number; w: number; h: number; area: number; note: string }[] }[];
};

export type ArticleBlock =
  | { type: "p"; text: L }
  | { type: "h2"; text: L }
  | { type: "quote"; text: L }
  | { type: "image"; art: ArtSpec; caption: L };

export type ArticleRaw = {
  id: string;
  slug: string;
  title: L;
  category: "light" | "materials" | "sustainability" | "space";
  excerpt: L;
  art: ArtSpec;
  publishedAt: string; // ISO date
  readingTime: number;
  author: string; // team id
  content: ArticleBlock[];
};

export type ArticleView = {
  id: string;
  slug: string;
  title: string;
  category: ArticleRaw["category"];
  categoryLabel: string;
  excerpt: string;
  art: ArtSpec;
  publishedAt: string;
  dateLabel: string;
  readingTime: number;
  authorName: string;
  content: (
    | { type: "p" | "h2" | "quote"; text: string }
    | { type: "image"; art: ArtSpec; caption: string }
  )[];
};

export type TeamMemberRaw = { id: string; name: string; role: L; bio: L; art: ArtSpec };
export type TeamMemberView = { id: string; name: string; role: string; bio: string; art: ArtSpec };
