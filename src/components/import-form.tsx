"use client";

import { useActionState } from "react";
import { Upload } from "lucide-react";
import { importStudents } from "@/app/actions";
import { fr } from "@/messages/fr";
import { buttonClass, Card } from "./ui";

export function ImportForm() {
  const [state, action, pending] = useActionState(importStudents, null);
  return (
    <Card>
      <form action={action} className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <p className="text-base font-medium">{fr.import.title}</p>
          <p className="text-sm text-muted-foreground">{fr.import.hint}</p>
        </div>
        <input type="file" name="file" accept=".xlsx" required className="text-sm" />
        <button disabled={pending} className={buttonClass()}>
          <Upload className="size-4" /> {fr.import.button}
        </button>
      </form>
      {state && (
        <p className={`mt-3 text-sm ${state.ok ? "text-success-foreground" : "text-destructive"}`} role="status">
          {state.ok ? fr.import.done(state.count) : fr.import.error}
        </p>
      )}
    </Card>
  );
}
