"use server";

import { revalidatePath } from "next/cache";
import { parseWorkbook } from "@/lib/import";
import { getRecipients, setRecipients, setStudents } from "@/lib/store";

export async function importStudents(_: unknown, form: FormData) {
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) return { ok: false as const };
  try {
    const students = parseWorkbook(await file.arrayBuffer());
    if (!students.length) return { ok: false as const };
    await setStudents(students);
    revalidatePath("/", "layout");
    return { ok: true as const, count: students.length };
  } catch {
    return { ok: false as const };
  }
}

export async function addRecipient(form: FormData) {
  const nom = String(form.get("nom") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const domaines = form.getAll("domaines").map(String);
  if (!nom || !email || !domaines.length) return;
  const all = await getRecipients();
  await setRecipients([...all, { id: crypto.randomUUID(), nom, email, domaines }]);
  revalidatePath("/destinataires");
}

export async function removeRecipient(form: FormData) {
  const id = String(form.get("id"));
  await setRecipients((await getRecipients()).filter((r) => r.id !== id));
  revalidatePath("/destinataires");
}
