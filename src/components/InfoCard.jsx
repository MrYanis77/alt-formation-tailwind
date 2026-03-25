export  default function InfoCard({ titre, description }) {
  return (
    <div className="bg-white border border-border rounded-[12px] p-10 flex flex-col items-center text-center w-full shadow-sm hover:border-orange/30 transition-colors h-full">
      <h3 className="text-orange font-heading font-extrabold text-2xl mb-6 uppercase">
        {titre}
      </h3>
      <p className="text-dark font-body text-[15px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}