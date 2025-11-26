"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

interface ReviewDetailDTO {
  idReview: number;
  studentName: string;
  offerorName: string;
  ratingForStudent: number;
  commentForStudent: string;
  ratingForOfferor: number;
  commentForOfferor: string;
  atTime: boolean;
  goodPresentation: boolean;
  isCompleted: boolean;
  isReviewForStudentCompleted: boolean;
  isReviewForOfferorCompleted: boolean;
  isClosed: boolean;
}

export default function StudentReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDetailDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [orderBy, setOrderBy] = useState("none");

  const pageSize = 5;
  const [page, setPage] = useState(1);

  // MODAL DETALLES
  const [selectedReview, setSelectedReview] = useState<ReviewDetailDTO | null>(null);
  const [showModal, setShowModal] = useState(false);

  // MODAL FINALIZAR
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishReview, setFinishReview] = useState<ReviewDetailDTO | null>(null);

  // FORMULARIO DE FINALIZAR
  const [commentJob, setCommentJob] = useState("");
  const [commentEmployer, setCommentEmployer] = useState("");
  const [rating, setRating] = useState(0);

  const openModal = (item: ReviewDetailDTO) => {
    setSelectedReview(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  const openFinishModal = (item: ReviewDetailDTO) => {
    setFinishReview(item);
    setShowFinishModal(true);
  };

  const closeFinishModal = () => {
    setShowFinishModal(false);
    setFinishReview(null);
    setCommentJob("");
    setCommentEmployer("");
    setRating(0);
  };

  const submitOfferorReview = async () => {
  if (!finishReview) return;

  if (!commentEmployer.trim() || rating === 0) {
    alert("Debes ingresar un comentario y una calificación.");
    return;
  }

  const token = Cookies.get("token");
  if (!token) {
    alert("No hay token válido.");
    return;
  }

  try {
    const body = {
      ratingForOfferor: rating,
      commentForOfferor: commentEmployer.trim(),
      sendedAt: new Date(),
      publicationId: finishReview.publicationId ?? 0 // ⚠ Confirmar si existe este campo
    };

    await axios.post(
      "http://localhost:5185/api/Review/AddOfferorReview",
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("¡Gracias! Tu reseña ha sido enviada.");

    // Marcar reseña como completada en la UI
    setReviews(prev =>
      prev.map(r =>
        r.idReview === finishReview.idReview
          ? { ...r, isReviewForOfferorCompleted: true }
          : r
      )
    );

    closeFinishModal();

  } catch (err) {
    console.error(err);
    alert("Hubo un error al enviar tu reseña.");
  }
};


  const starsOrNone = (score: number) =>
    score > 0 ? "★".repeat(score) : "Sin puntuación";

  /* ========================== PDF ========================== */
  const downloadPdf = async () => {
    const token = Cookies.get("token");
    if (!token) {
      alert("No se encontró el token.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5185/api/Review/my-reviews/pdf",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", "mis-reviews.pdf");
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Error descargando PDF:", err);
      alert("No se pudo generar el PDF.");
    }
  };

  /* ========================== FILTROS ========================== */
  const filtered = reviews.filter((r) => {
    if (filterStatus === "open" && r.isClosed) return false;
    if (filterStatus === "closed" && !r.isClosed) return false;

    if (filterScore !== "all") {
      const s = Number(filterScore);
      if (r.ratingForStudent !== s && r.ratingForOfferor !== s) return false;
    }

    return true;
  });

  /* ========================== ORDEN ========================== */
  const ordered = [...filtered].sort((a, b) => {
    if (orderBy === "asc") return a.idReview - b.idReview;
    if (orderBy === "desc") return b.idReview - a.idReview;
    return 0;
  });

  /* ========================== PAGINACIÓN ========================== */
  const paginated = ordered.slice((page - 1) * pageSize, page * pageSize);

  /* ========================== CARGA ========================== */
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setError("No hay token.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5185/api/Review/my-reviews", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReviews(res.data))
      .catch(() => setError("Error al cargar las reseñas."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando reseñas...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-center">Historial de Reseñas</h1>

      {/* ========================== FILTROS + PDF ========================== */}
      <div className="flex justify-between items-end mt-6 flex-wrap gap-6">

        <div className="flex gap-4 items-end">

          {/* Estado */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Todas</option>
              <option value="open">Abiertas</option>
              <option value="closed">Cerradas</option>
            </select>
          </div>

          {/* Puntuación */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Puntuación</label>
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Todas</option>
              <option value="5">★★★★★★ (6)</option>
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★ (4)</option>
              <option value="3">★★★ (3)</option>
              <option value="2">★★ (2)</option>
              <option value="1">★ (1)</option>
              <option value="0">Sin calificar</option>
            </select>
          </div>

          {/* Orden */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Ordenar por ID</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="none">Sin orden</option>
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>
        </div>

        {/* BOTÓN PDF */}
        <button
          onClick={downloadPdf}
          className="px-4 py-2 bg-red-600 !bg-red-600 text-white rounded-lg hover:!bg-red-700 transition"
        >
          Generar PDF
        </button>
      </div>

      {/* ========================== TARJETAS ========================== */}
      {paginated.map((r) => (
        <div
          key={r.idReview}
          className="border rounded-xl shadow-sm p-5 bg-white flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Reseña #{r.idReview}</h2>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                r.isClosed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {r.isClosed ? "Cerrada" : "Abierta"}
            </span>
          </div>

          <div className="text-base space-y-1">
            <p><strong>Oferente:</strong> {r.offerorName}</p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Calificación al estudiante:</strong>{" "}
              <span className="text-purple-700">{starsOrNone(r.ratingForStudent)}</span>
            </p>

            <p>
              <strong>Tu calificación al oferente:</strong>{" "}
              <span className="text-purple-700">{starsOrNone(r.ratingForOfferor)}</span>
            </p>
          </div>

          {/* VER DETALLES */}
          <button
            onClick={() => openModal(r)}
            className="mt-2 w-full text-center text-sm font-medium border border-purple-400 text-purple-700 rounded-lg py-2 hover:bg-purple-50"
          >
            Ver detalles
          </button>

          {/* FINALIZAR */}
          <button
            onClick={() => openFinishModal(r)}
            disabled={r.isReviewForOfferorCompleted}
            className={`mt-2 w-full text-center text-sm font-medium rounded-lg py-2 transition 
              ${r.isReviewForOfferorCompleted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
          >
            Finalizar
          </button>
        </div>
      ))}

      {/* ========================== PAGINACIÓN ========================== */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <p className="text-sm text-gray-600">
          Página <strong>{page}</strong> de{" "}
          <strong>{Math.ceil(filtered.length / pageSize)}</strong>
        </p>

        <div className="flex gap-4">
          <button
            className="px-4 py-2 rounded-md border hover:bg-gray-100 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </button>

          <button
            className="px-4 py-2 rounded-md border hover:bg-gray-100 disabled:opacity-50"
            disabled={page * pageSize >= filtered.length}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* ========================== MODAL DETALLES ========================== */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-3xl rounded-lg shadow-lg p-6 relative">

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Detalles de la reseña #{selectedReview.idReview}</h2>

            {/* Oferente → Estudiante */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-1">Oferente → Estudiante</p>

              <div className="flex items-center gap-2">
                <p className="text-yellow-500 text-lg">
                  {starsOrNone(selectedReview.ratingForStudent)}
                </p>
                <span className="font-medium">{selectedReview.offerorName}</span>
              </div>

              <p className="mt-2 text-sm text-gray-700">
                {selectedReview.commentForStudent || "Sin reseña"}
              </p>
            </div>

            {/* Estudiante → Oferente */}
            <div className="border rounded-lg p-4 mt-6">
              <p className="font-semibold text-gray-800 mb-1">Estudiante → Oferente</p>

              <div className="flex items-center gap-2">
                <p className="text-yellow-500 text-lg">
                  {starsOrNone(selectedReview.ratingForOfferor)}
                </p>
                <span className="font-medium">{selectedReview.studentName}</span>
              </div>

              <p className="mt-2 text-sm text-gray-700">
                {selectedReview.commentForOfferor || "Sin reseña"}
              </p>
            </div>

            {/* CHECKBOXES */}
            <div className="text-sm text-gray-800 space-y-4 mt-6">
              <label className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center 
                    ${selectedReview.atTime
                      ? "bg-purple-700 border-purple-800"
                      : "bg-white border-gray-400"}`}
                >
                  {selectedReview.atTime && (
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                ¿Llegó a la hora?
              </label>

              <label className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center 
                    ${selectedReview.goodPresentation
                      ? "bg-purple-700 border-purple-800"
                      : "bg-white border-gray-400"}`}
                >
                  {selectedReview.goodPresentation && (
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                ¿Buena presentación personal?
              </label>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================== MODAL FINALIZAR ========================== */}
      {showFinishModal && finishReview && (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white w-[95%] max-w-3xl rounded-xl shadow-xl p-8 relative animate-fadeIn">

          {/* BOTÓN CERRAR */}
          <button
            onClick={closeFinishModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>

          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            ¡GRACIAS POR TRABAJAR CON NOSOTROS!
          </h2>

          <div className="flex flex-col md:flex-row gap-6">

            {/* BLOQUE OFERENTE */}
            <div className="bg-purple-500 text-white rounded-lg p-6 flex-1 flex items-center justify-center text-center text-lg font-semibold shadow-md">
              {finishReview.offerorName}
            </div>

            {/* TEXTO EXPLICATIVO */}
            <div className="flex-1 text-sm text-gray-700 leading-relaxed">
              A través del siguiente formulario, nos gustaría saber tu experiencia en este puesto.
            </div>
          </div>

          {/* COMENTARIO TRABAJO */}
          <div className="mt-8">
            <label className="text-sm font-semibold text-gray-800">
              ¿Cómo fue tu experiencia en este trabajo?
            </label>
            <textarea
              rows={3}
              value={commentJob}
              onChange={(e) => setCommentJob(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="w-full border border-purple-300 rounded-lg p-3 mt-2 focus:outline-purple-500"
            />
          </div>

          {/* COMENTARIO EMPLEADOR */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-800">
              ¿Cómo fue tu relación con el empleador?
            </label>
            <textarea
              rows={3}
              value={commentEmployer}
              onChange={(e) => setCommentEmployer(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="w-full border border-purple-300 rounded-lg p-3 mt-2 focus:outline-purple-500"
              required
            />
          </div>

          {/* ESTRELLAS */}
          <div className="flex flex-col items-center mt-8">
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-4xl cursor-pointer transition ${
                    rating >= n ? "text-yellow-400" : "text-gray-300"
                  } hover:text-yellow-300`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm mt-2 text-gray-600">Puntuar</p>
          </div>

          {/* BOTÓN ENVIAR */}
          <div className="flex justify-center mt-10">
            <button
              onClick={submitOfferorReview}
              className="px-8 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md disabled:bg-gray-400"
              disabled={!commentEmployer.trim() || rating === 0}
            >
              Enviar
            </button>
          </div>

        </div>
      </div>
    )}
    </div>
  );
}
