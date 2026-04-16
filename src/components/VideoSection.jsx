export default function VideoSection({ title }) {
  return (
    <section className="bg-primary py-16 px-6 text-center">
      <h2 className="font-heading text-2xl text-white mb-10 uppercase tracking-wide">
        {title}
      </h2>
      <div className="relative max-w-container-md mx-auto aspect-video bg-content-dark/50 rounded-xl overflow-hidden border border-white/10 shadow-2xl group flex items-center justify-center">
        <button 
          onClick={() => console.log('Play Video')}
          className="w-20 h-20 bg-accent hover:bg-accent-dark text-white rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-xl z-20 cursor-pointer"
        >
          <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
      </div>
    </section>
  );
}