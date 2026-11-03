import { neon } from "@neondatabase/serverless";
import { promises as fs } from "fs";
import path from "path";

export type Student = {
  nom: string;
  prenom: string;
  naissance: string; // YYYY-MM-DD
  programme: string;
  domaine: string;
};

export type Recipient = {
  id: string;
  nom: string;
  email: string;
  domaines: string[];
};

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

const file = (key: string) => path.join(process.cwd(), ".data", `${key}.json`);

async function init() {
  await sql!`CREATE TABLE IF NOT EXISTS students (nom text, prenom text, naissance date, programme text, domaine text)`;
  await sql!`CREATE TABLE IF NOT EXISTS recipients (id text PRIMARY KEY, nom text, email text, domaines text[])`;
}

async function readFile<T>(key: string): Promise<T[]> {
  try {
    return JSON.parse(await fs.readFile(file(key), "utf8"));
  } catch {
    return [];
  }
}

async function writeFile<T>(key: string, value: T[]) {
  await fs.mkdir(path.dirname(file(key)), { recursive: true });
  await fs.writeFile(file(key), JSON.stringify(value));
}

export async function getStudents(): Promise<Student[]> {
  if (!sql) return readFile("students");
  await init();
  return (await sql`SELECT nom, prenom, to_char(naissance, 'YYYY-MM-DD') AS naissance, programme, domaine FROM students`) as Student[];
}

export async function setStudents(v: Student[]) {
  if (!sql) return writeFile("students", v);
  await init();
  await sql.transaction([
    sql`DELETE FROM students`,
    sql`INSERT INTO students (nom, prenom, naissance, programme, domaine)
        SELECT * FROM jsonb_to_recordset(${JSON.stringify(v)}::jsonb)
        AS x(nom text, prenom text, naissance date, programme text, domaine text)`,
  ]);
}

export async function getRecipients(): Promise<Recipient[]> {
  if (!sql) return readFile("recipients");
  await init();
  return (await sql`SELECT id, nom, email, domaines FROM recipients`) as Recipient[];
}

export async function setRecipients(v: Recipient[]) {
  if (!sql) return writeFile("recipients", v);
  await init();
  await sql.transaction([
    sql`DELETE FROM recipients`,
    sql`INSERT INTO recipients (id, nom, email, domaines)
        SELECT * FROM jsonb_to_recordset(${JSON.stringify(v)}::jsonb)
        AS x(id text, nom text, email text, domaines text[])`,
  ]);
}
