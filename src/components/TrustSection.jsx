export default function TrustSection({ partenaires, temoignages }) {
  return (
    <div className="bg-slate-50">
      {/* Partenaires */}
      <section className="py-16 px-6 bg-white">
        <h2 className="font-heading text-2xl text-dark text-center mb-12 uppercase tracking-wide">
          Ils nous font confiance
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-[1000px] mx-auto">
          {partenaires.map((nom) => (
            <div key={nom} className="px-6 py-4 border border-border rounded-lg text-muted font-bold text-sm grayscale opacity-70 hover:opacity-100 transition-all cursor-default bg-white">
              {nom}
            </div>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 px-6 max-w-[1100px] mx-auto">
        <h2 className="font-heading text-2xl text-dark text-center mb-16 uppercase tracking-wide">
          Témoignages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {temoignages.map((t) => (
            <article key={t.author} className="bg-white p-8 border-l-4 border-l-orange shadow-sm rounded-r-lg flex flex-col justify-between">
              <blockquote className="text-[14px] italic text-[#555] leading-relaxed mb-8 font-body">
                "{t.quote}"
              </blockquote>
              <div>
                <p className="font-heading font-bold text-navy text-[15px]">{t.author}</p>
                <p className="text-orange text-[12px] font-bold uppercase tracking-wide font-body">{t.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}