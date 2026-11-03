import { todays, upcoming } from "@/lib/birthdays";
import { sendDigest } from "@/lib/mail";
import { getRecipients, getStudents } from "@/lib/store";

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const test = new URL(req.url).searchParams.get("test");
  if (test) {
    const sample = upcoming(await getStudents(), 365).slice(0, 3);
    await sendDigest({ id: "test", nom: "Test", email: test, domaines: [] }, sample);
    return Response.json({ test: test, sent: 1 });
  }
  const [students, recipients] = await Promise.all([getStudents(), getRecipients()]);
  const today = todays(students);
  let sent = 0;
  for (const r of recipients) {
    const items = today.filter((u) => r.domaines.includes(u.student.domaine));
    if (!items.length) continue;
    await sendDigest(r, items);
    sent++;
  }
  return Response.json({ birthdays: today.length, sent });
}
