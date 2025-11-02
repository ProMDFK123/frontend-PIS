import HomeHero from "@/components/home/HomeHero";

export default function HomePage() {
  return (
    <main>
      <HomeHero />

      {/* Explora categorías */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold">
              Explora categorías
            </h2>
            <p className="mt-3 text-[var(--muted-ink)] text-lg">
              Encuentra ofertas laborales y de compra/venta filtrando por categoría
              para facilitar tu búsqueda.
            </p>
          </div>
          {/* imagen: centrada, sin recorte, con radio interno */}
          <div className="flex justify-center">
            <img
              src="/explora.png"
              alt="Explora categorías"
              className="w-[320px] md:w-[380px] max-w-full h-auto drop-shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Postula fácil */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 flex justify-center">
            <img
              src="/postula.png"
              alt="Postula fácil"
              className="w-[320px] md:w-[380px] max-w-full h-auto drop-shadow-sm"
            />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-extrabold">
              Postula fácil
            </h2>
            <p className="mt-3 text-[var(--muted-ink)] text-lg">
              Revisa los detalles de cada oferta y postúlate con un clic,
              recibiendo notificaciones del estado.
            </p>
          </div>
        </div>
      </section>
      {/* ¿Quiénes somos? */}
      <section id="about" className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[color:var(--foreground)]">
              ¿Quiénes somos?
            </h3>
            <p className="mt-4 text-[color:var(--foreground)]/85 text-lg leading-relaxed">
              Bolsa estudiantil FEUCN es una plataforma creada por la{" "}
              <span className="font-semibold">Federación de Estudiantes de la Universidad Católica del Norte</span>{" "}
              para conectar a estudiantes con oportunidades laborales y de servicios.
              Nuestro propósito es apoyar el desarrollo profesional y el
              emprendimiento dentro de la comunidad UCN.
            </p>
            <p className="mt-5 text-[color:var(--foreground)]/85 text-lg leading-relaxed">
              Facilitamos la publicación, búsqueda y gestión de ofertas desde una
              experiencia amigable y segura, enfocada en el crecimiento y bienestar
              estudiantil de la Universidad Católica del Norte.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="/feucn_logo.png"
              alt="Logo FEUCN"
              className="w-[340px] md:w-[420px] max-w-full h-auto drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Normas y buen uso */}
      <section id="normas" className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-10">
          <h3 className="text-2xl md:text-3xl font-bold">Normas y buen uso</h3>
          <p className="mt-2 text-[color:var(--foreground)]/80">
            Este espacio busca conectar a estudiantes con oportunidades de trabajo y servicios dentro de la comunidad UCN.
            Te pedimos mantener siempre un ambiente de respeto y apoyo mutuo.
          </p>

          <ul className="mt-5 space-y-2 text-[color:var(--foreground)]/90">
            <li>• Usa la plataforma con respeto y empatía hacia todos.</li>
            <li>• Publica solo información real y relacionada con trabajo o servicios.</li>
            <li>• No compartas contenido ofensivo ni datos personales de otros.</li>
            <li>• Si conoces nuevas oportunidades, ¡compártelas con la comunidad!</li>
          </ul>

          <div className="mt-6 flex items-start gap-3">
            <input
              id="accept"
              type="checkbox"
              className="mt-1 size-5 rounded border-[var(--border)] outline-none"
            />
            <label htmlFor="accept" className="text-[color:var(--foreground)]/80">
              Acepto las normas de uso de la Plataforma Bolsa estudiantil FEUCN.
            </label>
          </div>

          <div className="mt-6">
           <a
              href="#explora"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-[15px] font-semibold text-white
                        bg-[var(--primary)] hover:opacity-95 transition"
            >
              Empezar a explorar
            </a>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--card)] py-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-[color:var(--foreground)]/80">
          <div>
            <h4 className="font-bold text-[color:var(--foreground)] mb-3">FEUCN</h4>
            <div className="flex gap-4 text-xl">
              <a href="#" aria-label="Facebook"><i className="ri-facebook-fill" /></a>
              <a href="#" aria-label="LinkedIn"><i className="ri-linkedin-fill" /></a>
              <a href="#" aria-label="YouTube"><i className="ri-youtube-fill" /></a>
              <a href="#" aria-label="Instagram"><i className="ri-instagram-fill" /></a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-[color:var(--foreground)] mb-2">Navegación</h5>
            <ul className="space-y-1">
              <li><a href="/">Inicio</a></li>
              <li><a href="/offers">Ofertas</a></li>
              <li><a href="/publish">Publicar</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-[color:var(--foreground)] mb-2">Ayuda</h5>
            <ul className="space-y-1">
              <li><a href="/faq">Preguntas frecuentes</a></li>
              <li><a href="/contact">Contacto</a></li>
              <li><a href="/support">Soporte</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-[color:var(--foreground)] mb-2">Nosotros</h5>
            <ul className="space-y-1">
              <li><a href="/about">Misión</a></li>
              <li><a href="/team">Equipo</a></li>
              <li><a href="https://www.instagram.com/feucn">Federación UCN</a></li>
            </ul>
          </div>
        </div>
      </footer>

    </main>
  );
}
