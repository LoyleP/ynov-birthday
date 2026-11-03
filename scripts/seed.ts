import { readFileSync } from "fs";
import { parseWorkbook } from "../src/lib/import";
import { setStudents } from "../src/lib/store";

async function main() {
  const b = readFileSync(process.argv[2]);
  const students = parseWorkbook(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer);
  await setStudents(students);
  console.log(`${students.length} students saved`);
}

main();
