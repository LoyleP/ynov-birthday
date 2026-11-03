import { Redis } from "@upstash/redis";
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

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
    : null;

const file = (key: string) => path.join(process.cwd(), ".data", `${key}.json`);

async function read<T>(key: string): Promise<T[]> {
  if (redis) return (await redis.get<T[]>(key)) ?? [];
  try {
    return JSON.parse(await fs.readFile(file(key), "utf8"));
  } catch {
    return [];
  }
}

async function write<T>(key: string, value: T[]) {
  if (redis) {
    await redis.set(key, value);
    return;
  }
  await fs.mkdir(path.dirname(file(key)), { recursive: true });
  await fs.writeFile(file(key), JSON.stringify(value));
}

export const getStudents = () => read<Student>("students");
export const setStudents = (v: Student[]) => write("students", v);
export const getRecipients = () => read<Recipient>("recipients");
export const setRecipients = (v: Recipient[]) => write("recipients", v);
