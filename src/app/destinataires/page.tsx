import { Trash2, UserPlus, Users } from "lucide-react";
import { addRecipient, removeRecipient } from "@/app/actions";
import { Badge, buttonClass, Card, EmptyState, inputClass } from "@/components/ui";
import { getRecipients, getStudents } from "@/lib/store";
import { fr } from "@/messages/fr";

export const dynamic = "force-dynamic";

export default async function Recipients() {
  const [recipients, students] = await Promise.all([getRecipients(), getStudents()]);
  const domaines = [...new Set(students.map((s) => s.domaine).filter(Boolean))].sort();

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold">{fr.recipients.title}</h1>
        <p className="text-sm text-muted-foreground">{fr.recipients.intro}</p>
      </div>

      <Card>
        {domaines.length === 0 ? (
          <p className="text-sm text-muted-foreground">{fr.recipients.noDomains}</p>
        ) : (
          <form action={addRecipient} className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <input name="nom" placeholder={fr.recipients.name} required className={inputClass} />
              <input name="email" type="email" placeholder={fr.recipients.email} required className={inputClass} />
            </div>
            <fieldset className="flex flex-wrap gap-x-4 gap-y-2">
              <legend className="sr-only">{fr.recipients.domains}</legend>
              {domaines.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="domaines" value={d} className="size-4 accent-[var(--primary)]" /> {d}
                </label>
              ))}
            </fieldset>
            <button className={buttonClass()}>
              <UserPlus className="size-4" /> {fr.recipients.add}
            </button>
          </form>
        )}
      </Card>

      {recipients.length === 0 ? (
        <EmptyState icon={<Users />} title={fr.recipients.none} body={fr.recipients.noneBody} />
      ) : (
        <Card className="divide-y p-0">
          {recipients.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-3 p-3 hover:bg-muted/50">
              <span className="text-sm font-medium">{r.nom}</span>
              <span className="text-sm text-muted-foreground">{r.email}</span>
              <span className="ml-auto flex flex-wrap gap-1">
                {r.domaines.map((d) => (
                  <Badge key={d} className="bg-attention text-attention-foreground">{d}</Badge>
                ))}
              </span>
              <form action={removeRecipient}>
                <input type="hidden" name="id" value={r.id} />
                <button className={buttonClass("destructive")} aria-label={fr.recipients.remove}>
                  <Trash2 className="size-4" />
                </button>
              </form>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}
