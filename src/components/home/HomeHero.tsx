export default function HomeHero() {
    return (
        <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
            {/* Imagen de fondo */}
            <img
                src="/campusucn.png"             // <- usa la extensión correcta
                alt="Campus UCN"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
            />

            {/* Capa de oscurecimiento (más contraste y menos gris) */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,20,.55)_0%,rgba(5,10,20,.45)_40%,rgba(5,10,20,.65)_100%)]" />

            {/* Menú superior derecho */}
            <div className="absolute right-6 top-6 flex gap-3">
                <a
                    href="/"
                    className="rounded-2xl px-5 py-2 text-white/95 backdrop-blur-[2px] border border-white/25 hover:border-white/40 hover:bg-white/10 transition"
                >
                    Inicio
                </a>
                <a
                    href="/offers"
                    className="rounded-2xl px-5 py-2 text-white/95 backdrop-blur-[2px] border border-white/25 hover:border-white/40 hover:bg-white/10 transition"
                >
                    Explorar
                </a>
                <a
                    href="/login"
                    className="rounded-2xl px-5 py-2 font-medium text-white bg-[#6D5EF7]/90 hover:bg-[#6D5EF7] shadow-[0_6px_24px_rgba(109,94,247,.35)] transition"
                >
                    Ingresar
                </a>
            </div>

            {/* Título central */}
            <div className="relative z-10 flex h-full items-center justify-center">
                <div className="px-6 text-center">
                    <h1 className="text-white font-extrabold leading-tight drop-shadow text-[64px] md:text-[64px]">
                        Bolsa de trabajo UCN
                    </h1>
                    <p className="mt-3 text-white/95 font-semibold drop-shadow text-[22px]">
                        Trabajos y servicios para estudiantes
                    </p>
                    <div className="mt-8 flex justify-center">
                        <a
                            href="/offers"
                            className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-[16px] font-semibold text-white bg-[#6D5EF7] shadow-[0_8px_30px_rgba(109,94,247,.35)] hover:shadow-[0_10px_40px_rgba(109,94,247,.5)] hover:-translate-y-0.5 transition"
                        >
                            Explorar
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
