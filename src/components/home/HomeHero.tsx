export default function HomeHero() {
  return (
    <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
      {/* Fondo */}
      <img
        src="/ucnferia.png"
        alt="Campus UCN"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay + toques de color (blobs) */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,23,.35)_0%,rgba(6,12,23,.55)_40%,rgba(6,12,23,.7)_100%)]" />
      <div className="absolute -top-20 -left-20 size-[360px] rounded-full blur-3xl opacity-30 bg-[var(--accent)]" />
      <div className="absolute -bottom-24 -right-24 size-[360px] rounded-full blur-3xl opacity-25 bg-[var(--secondary)]" />

      {/* Títulos centrales */}
      <div id="explora" className="relative z-10 flex h-full items-center justify-center text-center px-6">
        <div>
          <h1 className="text-white font-extrabold leading-tight drop-shadow text-[52px] md:text-[64px]">
            Bolsa estudiantil FEUCN
          </h1>
          <p className="mt-3 text-white/95 font-medium drop-shadow text-[20px] md:text-[22px]">
            Trabajos y servicios para estudiantes
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="/offers"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-[16px] font-semibold text-white
                         bg-[var(--primary)] shadow-[0_8px_30px_rgba(109,94,247,.35)]
                         hover:shadow-[0_10px_40px_rgba(109,94,247,.5)] hover:-translate-y-0.5 transition"
            >
              Explorar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

