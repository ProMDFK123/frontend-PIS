"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState(false);

  const handleExplore = () => {
    if (!accepted) {
      setError(true);
      return;
    }
    router.push("/auth/register");
  };

  return (
    <>
      <main className="page">

      {/* HERO */}
      <section className="hero" style={{ 
        background: "linear-gradient(135deg, #4f46e5, #ec4899)", color: "white", 
        padding: "80px 40px", borderRadius: "20px", marginBottom: "40px" }}>
        <div className="hero-text" style={{ maxWidth: "500px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "800", lineHeight: 1.2,
            color: "white", textShadow: "2px 2px 8px rgba(0,0,0,0.3)"
           }}>
            Encuentra oportunidades, servicios y proyectos estudiantiles
          </h1>
          <a href="/offers" className="btn-primary" style={{ background: "#22c55e", 
            color: "white", padding: "12px 26px", borderRadius: "12px", 
            display: "inline-block", marginTop: "20px", fontWeight: "600" }}>
            Explorar
          </a>
        </div>
        <img 
          src="/ucenin.png" 
          className="hero-img" 
          alt="hero"
        />
      </section>

      {/* FEATURES */}
      <section className="features" style={{ display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", 
        padding: "50px 40px" }}>
        {[
          { img: "/explora.png", title: "Explora categorías", 
            text: "Encuentra trabajos, servicios, tutorías y más.", color: "#4f46e5" },
          { img: "/postula.png", title: "Postula fácil", 
            text: "Revisa detalles y postula en segundos.", color: "#ec4899" },
          { img: "/feucn_logo.png", title: "Comunidad UCN", 
            text: "Creado por y para estudiantes. 100% gratuito.", color: "#22c55e" }
        ].map((card, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", 
          alignItems: "center", textAlign: "center", padding: "24px", 
          borderRadius: "16px", background: "white", 
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)", gap: "14px" }}>
            <img src={card.img} style={{ width: "120px" }} />
            <h3 style={{ fontSize: "20px", color: card.color }}>{card.title}</h3>
            <p style={{ color: "#1f2937" }}>{card.text}</p>
          </div>
        ))}
      </section>

      {/* ABOUT */}
      <section className="about" style={{ display: "flex", alignItems: "center", 
        justifyContent: "center", gap: "40px", flexWrap: "wrap", 
        padding: "60px 40px", background: "#f0f4f8", borderRadius: "20px", 
        marginBottom: "40px" }}>
        <img src="/feucn_logo.png" style={{ width: "320px", flexShrink: 0 }} 
          alt="Logo FEUCN" />
        <div style={{ maxWidth: "600px", textAlign: "left" }}>
          <h2 style={{ fontSize: "30px", fontWeight: 700, color: "#4f46e5", 
            marginBottom: "20px" }}>¿Quiénes somos?</h2>
          <p style={{ marginTop: "10px", color: "#1f2937" }}>
            Somos la <b>Federación de Estudiantes de la Universidad Católica del Norte</b>, 
            y nuestro objetivo es conectar a estudiantes con oportunidades reales
            que impulsen su crecimiento académico, laboral y personal.
          </p>
          <p style={{ marginTop: "10px", color: "#1f2937" }}>
            Aquí podrás encontrar ofertas laborales, servicios estudiantiles,
            emprendimientos y espacios de apoyo mutuo.
          </p>
        </div>
      </section>

      {/* RULES */}
      <section className="rules" style={{ background: "#ec4899", color: "white", 
        padding: "60px 40px", textAlign: "center", borderRadius: "20px" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Normas y buen uso</h2>
        <ul style={{ listStyle: "none", margin: "20px auto", maxWidth: "500px", textAlign: "left" }}>
          <li style={{ margin: "10px 0", fontSize: "17px" }}>
            💙 Respeto y empatía siempre.</li>
          <li style={{ margin: "10px 0", fontSize: "17px" }}>
            📌 Publica información real y útil.</li>
          <li style={{ margin: "10px 0", fontSize: "17px" }}>
            ❌ No compartas datos personales de terceros.</li>
          <li style={{ margin: "10px 0", fontSize: "17px" }}>
            🚀 Comparte oportunidades con tu comunidad.</li>
        </ul>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
          <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="checkbox" checked={accepted} onChange={() => 
              { setAccepted(!accepted); setError(false); }} />
            <span>Acepto las normas de buen uso</span>
          </label>
        </div>
        {error && <p style={{ color: "#facc15", marginTop: "10px", fontSize: "15px" }}>
          Debes aceptar las normas antes de continuar.</p>}
        <button onClick={handleExplore} style={{ display: "inline-block", 
          marginTop: "20px", background: "#22c55e", color: "white", 
          padding: "12px 26px", fontWeight: "600", borderRadius: "10px", 
          cursor: "pointer" }}>
          Empezar a explorar
        </button>
      </section>

        {/* FOOTER */}
        <footer className="footer">
          <p>© 2025 Bolsa Estudiantil FEUCN · Comunidad estudiantil UCN</p>
        </footer>
      </main>

      {/* --- ESTILOS COMPLETOS EN EL MISMO ARCHIVO --- */}
      <style jsx>{`
        /* BASE */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, .page {
          font-family: "Inter", sans-serif;
          background: #f7f8fc;
          color: #222;
        }

        a {
          text-decoration: none;
        }

        /* NAVBAR */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 40px;
          background: #ffffff;
          border-bottom: 2px solid #e3e6ef;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .brand {
          font-size: 22px;
          font-weight: 700;
          color: #0066ff;
        }

        .links a {
          margin-left: 20px;
          color: #333;
          font-weight: 500;
        }

        .links a:hover {
          color: #0066ff;
        }

        /* HERO */
        .hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 80px 40px;
          flex-wrap: wrap;
        }

        .hero-text {
          max-width: 500px;
        }

        .hero h1 {
          font-size: 40px;
          font-weight: 800;
          line-height: 1.2;
          background: linear-gradient(90deg, #0066ff, #ff4dd2);
          -webkit-background-clip: text;
          color: transparent;
        }

        .hero p {
          margin-top: 12px;
          font-size: 17px;
          color: #555;
        }

        .btn-primary {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 26px;
          background: #0066ff;
          color: white;
          border-radius: 10px;
          font-weight: 600;
        }

        .hero-img {
          width: 340px;
          margin-top: 20px;
        }

        /* FEATURE CARDS */
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          padding: 50px 40px;
        }

        .feature-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
        }

        .fc-img {
          width: 120px;
          margin-bottom: 14px;
        }

        .feature-card h3 {
          font-size: 20px;
          color: #0066ff;
        }

        .feature-card p {
          margin-top: 8px;
          color: #444;
        }

        /* ABOUT */
        .about {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 60px 40px;
          gap: 40px;
          flex-wrap: wrap;
        }

        .about h2 {
          font-size: 30px;
          font-weight: 700;
          color: #0066ff;
        }

        .about p {
          margin-top: 10px;
          color: #555;
        }

        .about-img {
          width: 320px;
        }

        /* RULES */
        .rules {
          background: #0066ff;
          color: white;
          padding: 60px 40px;
          text-align: center;
        }

        .rules h2 {
          font-size: 28px;
          margin-bottom: 20px;
        }

        .rules ul {
          list-style: none;
          margin: 20px auto;
          max-width: 500px;
          text-align: left;
        }

        .rules li {
          margin: 10px 0;
          font-size: 17px;
        }

        .btn-secondary {
          display: inline-block;
          margin-top: 20px;
          background: white;
          color: #0066ff;
          padding: 12px 26px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
        }

        /* FOOTER */
        .footer {
          padding: 20px;
          text-align: center;
          background: #ffffff;
          border-top: 2px solid #e3e6ef;
          margin-top: 40px;
          color: #666;
          font-size: 14px;
        }

        /* RESPONSIVE */
        @media (max-width: 800px) {
          .hero {
            text-align: center;
            justify-content: center;
          }
          .hero-img {
            margin-top: 40px;
          }
        }
      `}</style>
    </>
  );
}
