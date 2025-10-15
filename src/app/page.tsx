import HomeHero from "@/components/home/HomeHero";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <main className="max-w-7xl mx-auto px-4 pb-24">
        {/* Explora categorías */}
        <section className="grid gap-8 md:grid-cols-2 items-center pt-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold">Explora categorías</h2>
            <p className="mt-4 text-[17px] text-muted-foreground">
              Encuentra ofertas laborales y de compra/venta filtrando por categoría
              para facilitar tu búsqueda.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-2 shadow-sm border">
            {/* imagen genérica */}
            <img src="/explora.png" alt="Explora" className="w-full rounded-2xl object-cover" />
          </div>
        </section>

        {/* Postula fácil */}
        <section className="grid gap-8 md:grid-cols-2 items-center pt-16">
          <div className="rounded-3xl bg-card p-2 shadow-sm border order-2 md:order-1">
            <img src="/postula.png" alt="Postula" className="w-full rounded-2xl object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-5xl font-extrabold">Postula fácil</h2>
            <p className="mt-4 text-[17px] text-muted-foreground">
              Revisa los detalles de cada oferta y postúlate con un clic,
              recibiendo notificaciones del estado.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
