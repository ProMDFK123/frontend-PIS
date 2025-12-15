"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Briefcase,
  Users,
  Rocket,
  Heart,
  FileCheck,
  Ban,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useDisclaimerAcceptance } from "@/hooks/common/use-disclaimer-acceptance";

export default function HomePage() {
  const router = useRouter();
  const {accepted, manageDisclaimer, isLoaded} = useDisclaimerAcceptance();
  const [error, setError] = useState(false);

  const handleExplore = () => {
    if (!accepted) {
      setError(true);
      const rulesSection = document.getElementById("rules-section");
      if (rulesSection) {
        rulesSection.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    router.push("/offers");
  };
  const handleKnowMore = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* ============ HERO ============ */}
      <section
        className="relative overflow-hidden py-20 px-6 md:px-12"
        style={{
          backgroundImage: `url('/fondo.png')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
        }}
      >
        {/* Degradado para suavizar el fondo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-[var(--primary)]/70 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Texto */}
          <div className="max-w-xl text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
              Encuentra oportunidades, servicios y proyectos estudiantiles
            </h1>

            <p className="text-white/80 text-lg mb-8">
              Conectamos estudiantes con oportunidades reales. Trabajos,
              tutorías, emprendimientos y más.
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={handleExplore}
                size="hero"
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--primary)] font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Search className="w-5 h-5" />
                Explorar ofertas
              </Button>

              <Button
                onClick={handleKnowMore}
                size="hero"
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm transition-all"
              >
                Saber más
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center lg:justify-start">
              {[
                { num: "500+", label: "Estudiantes" },
                { num: "120+", label: "Ofertas" },
                { num: "100%", label: "Gratuito" },
              ].map((stat, i) => (
                <div key={i} className="text-center flex flex-col items-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">
                    {stat.num}
                  </div>
                  <div className="text-white/80 text-sm tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features-section" className="py-20 px-6 md:px-12 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--chip)] text-[var(--primary)] text-sm font-semibold mb-4">
              ¿Qué puedes hacer?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink)] mb-4">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-[var(--muted-ink)] max-w-2xl mx-auto">
              Explora, postula y conecta con la comunidad estudiantil
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 px-4">
            {[
              {
                icon: Search,
                img: "/explora.png",
                title: "Explora categorías",
                text: "Encuentra trabajos, servicios, tutorías y más.",
                color: "var(--primary)",
              },
              {
                icon: Briefcase,
                img: "/postula.png",
                title: "Postula fácil",
                text: "Revisa detalles y postula en segundos.",
                color: "var(--pop)",
              },
              {
                icon: Users,
                img: "/feucn_logo.png",
                title: "Comunidad UCN",
                text: "Creado por y para estudiantes. 100% gratuito.",
                color: "var(--accent)",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[var(--border)]"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ background: `${card.color}20` }}
                >
                  <card.icon className="w-8 h-8" style={{ color: card.color }} />
                </div>
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-32 h-32 object-contain mx-auto mb-6"
                />
                <h3 className="text-2xl font-bold text-[var(--ink)] mb-4">
                  {card.title}
                </h3>
                <p className="text-[var(--muted-ink)]">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-[var(--chip)] to-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-3xl blur-2xl scale-105" />
            <img
              src="/feucn_logo.png"
              alt="Logo FEUCN"
              className="relative z-10 w-72 md:w-96 drop-shadow-xl"
            />
          </div>

          <div className="max-w-xl">
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold mb-4">
              Sobre nosotros
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink)] mb-6">
              ¿Quiénes somos?
            </h2>
            <p className="text-[var(--muted-ink)] text-lg mb-4">
              Somos la{" "}
              <strong className="text-[var(--ink)]">
                Federación de Estudiantes de la Universidad Católica del Norte
              </strong>
              , y nuestro objetivo es conectar a estudiantes con oportunidades
              reales que impulsen su crecimiento académico, laboral y personal.
            </p>
            <p className="text-[var(--muted-ink)] text-lg">
              Aquí podrás encontrar ofertas laborales, servicios estudiantiles,
              emprendimientos y espacios de apoyo mutuo.
            </p>

            <div className="flex gap-6 mt-8">
              {[
                { icon: Rocket, label: "Innovación" },
                { icon: Users, label: "Comunidad" },
                { icon: Heart, label: "Apoyo" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-[var(--primary)]"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== RULES ===== */}
      <section id="rules-section" className="py-20 px-6 md:px-12 bg-gradient-to-br from-[var(--pop)] to-[#F472B6]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-4 backdrop-blur-sm">
            Comunidad responsable
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-12">
            Normas y buen uso
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 text-left mb-12">
            {[
              {
                icon: Heart,
                text: "Respeto y empatía siempre.",
                color: "bg-blue-400",
              },
              {
                icon: FileCheck,
                text: "Publica información real y útil.",
                color: "bg-emerald-400",
              },
              {
                icon: Ban,
                text: "No compartas datos personales de terceros.",
                color: "bg-red-400",
              },
              {
                icon: Share2,
                text: "Comparte oportunidades con tu comunidad.",
                color: "bg-amber-400",
              },
            ].map((rule, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${rule.color} flex items-center justify-center flex-shrink-0`}
                >
                  <rule.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white font-medium">{rule.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-md mx-auto">
            <label className="flex items-center gap-3 cursor-pointer justify-center">
              <input
                type="checkbox"
                checked={accepted}
                onChange={() => {
                  manageDisclaimer(!accepted);
                  setError(false);
                }}
                className="w-5 h-5 rounded border-2 border-white/50 bg-white/10 checked:bg-white checked:border-white accent-[var(--primary)]"
              />
              <span className="text-white font-medium">
                Acepto las normas de buen uso
              </span>
            </label>

            {error && (
              <p className="text-yellow-300 mt-3 text-sm font-medium animate-pulse">
                ⚠️ Debes aceptar las normas antes de continuar.
              </p>
            )}
          </div>

          <button
            onClick={handleExplore}
            className="mt-8 inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-[var(--pop)] font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Rocket className="w-5 h-5" />
            Empezar a explorar
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 bg-white border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[var(--muted-ink)] text-sm">
            © 2025 Bolsa Estudiantil FEUCN · Comunidad estudiantil UCN
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
