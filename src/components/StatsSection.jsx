export default function StatsSection({ stats }) {
  return (
    <section className="py-[50px] px-6 md:px-[60px] bg-white border-b border-border">
      <div className="flex justify-center gap-10 md:gap-20 flex-wrap">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <span className="font-heading text-4xl md:text-[48px] font-extrabold text-orange leading-none">
              {s.value}
            </span>
            <span className="text-[13px] text-muted font-medium uppercase mt-2 tracking-tight font-body">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}