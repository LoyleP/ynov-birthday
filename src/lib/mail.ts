import nodemailer from "nodemailer";
import { fr } from "@/messages/fr";
import type { Upcoming } from "./birthdays";
import type { Recipient } from "./store";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function sendDigest(to: Recipient, items: Upcoming[]) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
  const rows = items
    .map(
      ({ student: s, age }) =>
        `<li><strong>${esc(s.prenom)} ${esc(s.nom)}</strong> — ${fr.birthdays.turns(age)}<br><span style="color:#666">${esc(s.programme)}</span></li>`,
    )
    .join("");
  await transport.sendMail({
    from: process.env.GMAIL_USER,
    to: to.email,
    subject: fr.mail.subject(items.length),
    html: `<p>${fr.mail.intro}</p><ul>${rows}</ul>`,
  });
}
