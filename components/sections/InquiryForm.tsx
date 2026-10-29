"use client";

import { useRef, useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";
import { submitInquiry, type Inquiry } from "@/lib/services/inquiry";

type Values = Inquiry & { consent: boolean };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", email: "", company: "", type: "", budget: "", location: "", timeline: "", description: "", consent: false };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CATEGORY_IDS = ["residential", "cultural", "hospitality", "commercial", "installation", "research"] as const;

export default function InquiryForm({ dict }: { dict: Dict }) {
  const e = dict.form.errors;
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState("");
  const summary = useRef<HTMLDivElement>(null);

  function validate(x: Values): Errors {
    const out: Errors = {};
    if (!x.name.trim()) out.name = e.nameRequired;
    if (!x.email.trim()) out.email = e.emailRequired;
    else if (!EMAIL.test(x.email.trim())) out.email = e.emailInvalid;
    if (!x.type) out.type = e.typeRequired;
    if (!x.location.trim()) out.location = e.locationRequired;
    if (!x.description.trim()) out.description = e.descriptionRequired;
    else if (x.description.trim().length < 30) out.description = e.descriptionShort;
    if (!x.consent) out.consent = e.consentRequired;
    return out;
  }

  function set<K extends keyof Values>(k: K, val: Values[K]) {
    const next = { ...v, [k]: val };
    setV(next);
    if (touched[k]) setErrors(validate(next));
  }
  const blur = (k: keyof Values) => { setTouched((t) => ({ ...t, [k]: true })); setErrors(validate(v)); };

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const found = validate(v);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(v).map((k) => [k, true])));
    if (Object.keys(found).length) {
      setTimeout(() => summary.current?.focus(), 0);
      return;
    }
    setState("sending");
    try {
      const { consent: _consent, ...data } = v;
      void _consent;
      const res = await submitInquiry(data);
      setReference(res.reference);
      setState("done");
    } catch {
      setState("error");
    }
  }

  const err = (k: keyof Values) => (touched[k] || Object.keys(errors).length ? errors[k] : undefined);
  const aria = (k: keyof Values) => ({ "aria-invalid": err(k) ? true : undefined, "aria-describedby": err(k) ? `${k}-err` : undefined });
  const renderErr = (k: keyof Values) => (err(k) ? <p id={`${k}-err`} className="err">{err(k)}</p> : null);

  if (state === "done") {
    return (
      <div role="status" className="border border-line bg-surface p-8 md:p-12">
        <p className="mono text-accent-text">{dict.form.reference}: <span dir="ltr">{reference}</span></p>
        <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.6rem)]">{dict.form.successTitle}</h2>
        <p className="mt-4 max-w-[52ch] text-fg-2">{dict.form.successText} <span dir="ltr" className="mono text-fg">{reference}</span>.</p>
        <button type="button" className="btn mt-8" onClick={() => { setV(EMPTY); setErrors({}); setTouched({}); setState("idle"); }}>{dict.form.another}</button>
      </div>
    );
  }

  const count = Object.keys(errors).length;
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8" aria-describedby="form-demo">
      {count > 0 && (
        <div ref={summary} tabIndex={-1} role="alert" className="border border-[#a5341f] p-4 outline-none">
          <p className="font-medium">{e.summary}</p>
          <ul className="mt-2 list-disc ps-5 text-sm">
            {(Object.keys(errors) as (keyof Values)[]).map((k) => <li key={k}><a className="underline" href={`#f-${k}`}>{errors[k]}</a></li>)}
          </ul>
        </div>
      )}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="field"><label htmlFor="f-name">{dict.form.name} *</label><input id="f-name" className="input" autoComplete="name" value={v.name} onChange={(x) => set("name", x.target.value)} onBlur={() => blur("name")} {...aria("name")} required />{renderErr("name")}</div>
        <div className="field"><label htmlFor="f-email">{dict.form.email} *</label><input id="f-email" type="email" dir="ltr" className="input text-start" autoComplete="email" value={v.email} onChange={(x) => set("email", x.target.value)} onBlur={() => blur("email")} {...aria("email")} required />{renderErr("email")}</div>
        <div className="field"><label htmlFor="f-company">{dict.form.company}</label><input id="f-company" className="input" autoComplete="organization" value={v.company} onChange={(x) => set("company", x.target.value)} /></div>
        <div className="field"><label htmlFor="f-type">{dict.form.type} *</label>
          <select id="f-type" className="input" value={v.type} onChange={(x) => set("type", x.target.value)} onBlur={() => blur("type")} {...aria("type")} required>
            <option value="">{dict.form.choose}</option>
            {CATEGORY_IDS.map((c) => <option key={c} value={c}>{dict.categories[c]}</option>)}
          </select>{renderErr("type")}</div>
        <div className="field"><label htmlFor="f-location">{dict.form.location} *</label><input id="f-location" className="input" value={v.location} onChange={(x) => set("location", x.target.value)} onBlur={() => blur("location")} {...aria("location")} required />{renderErr("location")}</div>
        <div className="field"><label htmlFor="f-budget">{dict.form.budget}</label>
          <select id="f-budget" className="input" value={v.budget} onChange={(x) => set("budget", x.target.value)}><option value="">{dict.form.choose}</option>{dict.form.budgets.map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
        <div className="field md:col-span-2"><label htmlFor="f-timeline">{dict.form.timeline}</label>
          <select id="f-timeline" className="input" value={v.timeline} onChange={(x) => set("timeline", x.target.value)}><option value="">{dict.form.choose}</option>{dict.form.timelines.map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
      </div>
      <div className="field"><label htmlFor="f-description">{dict.form.description} *</label>
        <textarea id="f-description" rows={6} className="input resize-y" value={v.description} onChange={(x) => set("description", x.target.value)} onBlur={() => blur("description")} {...aria("description")} required />{renderErr("description")}</div>
      <div className="grid gap-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input id="f-consent" type="checkbox" className="mt-1 size-5 shrink-0 accent-[var(--accent)]" checked={v.consent} onChange={(x) => set("consent", x.target.checked)} {...aria("consent")} />
          <span className="text-sm leading-relaxed">{dict.form.consent} *</span>
        </label>
        {renderErr("consent")}
      </div>
      <p id="form-demo" className="mono text-accent-text">{dict.contact.backendNote}</p>
      {state === "error" && <p role="alert" className="err">{dict.error.text}</p>}
      <div><button type="submit" disabled={state === "sending"} className="btn btn-solid">{state === "sending" ? dict.form.sending : dict.form.submit}</button></div>
    </form>
  );
}
