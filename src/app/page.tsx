import { Cake } from "lucide-react";
import { ImportForm } from "@/components/import-form";
import { Badge, Card, EmptyState } from "@/components/ui";
import { formatDay, upcoming } from "@/lib/birthdays";
import { getStudents } from "@/lib/store";
import { fr } from "@/messages/fr";

export const dynamic = "force-dynamic";

export default async function Home() {
  const students = await getStudents();
  const list = upcoming(students, 30);
  const today = list.filter((u) => u.inDays === 0);
  const next = list.filter((u) => u.inDays > 0);

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold">{fr.birthdays.title}</h1>
        <p className="text-sm text-muted-foreground">
          {fr.birthdays.intro} {students.length > 0 && `· ${fr.birthdays.students(students.length)}`}
        </p>
      </div>
      <ImportForm />
      {students.length === 0 ? (
        <EmptyState icon={<Cake />} title={fr.birthdays.emptyTitle} body={fr.birthdays.emptyBody} />
      ) : (
        <>
          <Section title={fr.birthdays.today} items={today} />
          <Section title={fr.birthdays.next} items={next} />
        </>
      )}
    </>
  );
}

function Section({ title, items }: { title: string; items: ReturnType<typeof upcoming> }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{fr.birthdays.none}</p>
      ) : (
        <Card className="divide-y p-0">
          {items.map(({ student: s, inDays, age }) => (
            <div key={s.nom + s.prenom + s.naissance} className="flex flex-wrap items-center gap-3 p-3 hover:bg-muted/50">
              <span className="w-32 text-sm capitalize text-muted-foreground">{formatDay(inDays)}</span>
              <span className="text-sm font-medium">{s.prenom} {s.nom}</span>
              <Badge className="bg-primary/15 text-primary">{fr.birthdays.turns(age)}</Badge>
              <span className="ml-auto text-sm text-muted-foreground">{s.programme}</span>
              <Badge className="bg-attention text-attention-foreground">{s.domaine}</Badge>
            </div>
          ))}
        </Card>
      )}
    </section>
  );
}
