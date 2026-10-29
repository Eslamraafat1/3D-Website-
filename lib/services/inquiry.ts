export type Inquiry = {
  name: string; email: string; company: string; type: string; budget: string;
  location: string; timeline: string; description: string;
};

const KEY = "monolith-demo-inquiries";
let counter = 0;

/**
 * Mock inquiry service. DEMO ONLY — nothing is transmitted. The inquiry is
 * kept in sessionStorage so the behaviour is observable, and a reference id
 * is returned. Replace the body with a real `fetch` to wire up a backend.
 */
export async function submitInquiry(data: Inquiry): Promise<{ reference: string }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  counter += 1;
  const reference = `MN-${String(Date.now()).slice(-5)}-${String(counter).padStart(2, "0")}`;
  try {
    const existing = JSON.parse(sessionStorage.getItem(KEY) ?? "[]") as unknown[];
    existing.push({ reference, ...data });
    sessionStorage.setItem(KEY, JSON.stringify(existing));
  } catch {
    /* storage unavailable — the demo still succeeds */
  }
  return { reference };
}
