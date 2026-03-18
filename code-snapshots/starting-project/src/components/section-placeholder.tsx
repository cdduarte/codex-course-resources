type SectionPlaceholderProps = {
  title: string;
  description: string;
  note?: string;
};

export function SectionPlaceholder({ title, description, note }: SectionPlaceholderProps) {
  return (
    <section className="rounded-xl border border-(--border) bg-(--surface-muted) p-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-(--text-muted)">{description}</p>
      {note ? <p className="mt-3 text-xs font-medium text-(--accent)">TODO: {note}</p> : null}
    </section>
  );
}
