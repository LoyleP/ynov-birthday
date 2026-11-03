import * as XLSX from "xlsx";
import type { Student } from "./store";

const DOMAINES: Record<string, string> = { "Tech & Business": "Product" };

const pad = (n: number) => String(n).padStart(2, "0");

function toIso(v: unknown): string | null {
  if (v instanceof Date) return `${v.getUTCFullYear()}-${pad(v.getUTCMonth() + 1)}-${pad(v.getUTCDate())}`;
  const m = String(v ?? "").trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${pad(+m[2])}-${pad(+m[1])}` : null;
}

export function parseWorkbook(buf: ArrayBuffer): Student[] {
  const wb = XLSX.read(buf, { cellDates: true });
  const ws = wb.Sheets[wb.SheetNames.at(-1)!];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { raw: true });
  const students: Student[] = [];
  for (const r of rows) {
    const naissance = toIso(r["Date de naissance"] ?? r["Date_de_naissance"]);
    const nom = String(r["Nom"] ?? "").trim();
    if (!naissance || !nom) continue;
    students.push({
      nom,
      prenom: String(r["Prénom"] ?? "").trim(),
      naissance,
      programme: String(r["2026 - Programme"] ?? "").trim(),
      domaine: DOMAINES[String(r["2026 - Domaine"] ?? "").trim()] ?? String(r["2026 - Domaine"] ?? "").trim(),
    });
  }
  return students;
}
