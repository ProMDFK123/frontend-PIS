"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

/* ======= DTOs ======= */

interface ImageDTO {
  id: number;
  url: string;
}

interface PublicationDTO {
  idPublication: number;
  userId: number;
  title: string;
  types: number;
  description: string;
  publicationDate: string;
  images: ImageDTO[];
  isActive: boolean;
  statusValidation: number;
}

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

interface CombinedReviewDTO {
  publication: PublicationDTO;
  review: ReviewDetailDTO;
}

export default function StudentReviewsPage() {
  const [reviews, setReviews] = useState<CombinedReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [orderBy, setOrderBy] = useState("none");

  const pageSize = 5;
  const [page, setPage] = useState(1);

  /* ======= MODALES ======= */
  const [selectedReview, setSelectedReview] = useState<CombinedReviewDTO | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishReview, setFinishReview] = useState<CombinedReviewDTO | null>(null);

  /* ======= MODAL DE CONFIRMACIÓN ======= */
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /* ======= FORMULARIO ======= */
  const [commentJob, setCommentJob] = useState("");
  const [commentEmployer, setCommentEmployer] = useState("");
  const [rating, setRating] = useState(0);

  const openModal = (item: CombinedReviewDTO) => {
    setSelectedReview(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  const openFinishModal = (item: CombinedReviewDTO) => {
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

  const refreshReviews = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    const res = await axios.get("http://localhost:5185/api/Review/my-reviews", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setReviews(res.data);
  };

  /* ======= CONFIRMAR ENVÍO ======= */
  const handleOpenConfirm = () => {
    if (!commentEmployer.trim() || rating === 0) return;
    setShowConfirmModal(true);
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  /* ======= SEND FINAL ======= */
  const confirmSubmitOfferorReview = async () => {
    if (!finishReview) return;

    const token = Cookies.get("token");
    if (!token) return;

    const combinedComment =
      `¿Cómo fue tu experiencia en este trabajo?: ${commentJob.trim() || "Sin comentario"}. ` +
      `¿Cómo fue tu relación con el empleador?: ${commentEmployer.trim()}`;

    try {
      const body = {
        ratingForOfferor: rating,
        commentForOfferor: combinedComment,
        sendedAt: new Date(),
        reviewId: finishReview.review.idReview,
      };

      await axios.post(
        "http://localhost:5185/api/Review/AddOfferorReview",
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowConfirmModal(false);
      closeFinishModal();

      // 🔄 Recargar los datos sin refrescar la página
      await refreshReviews();

    } catch (err) {
      console.error("Error al enviar reseña:", err);
      setShowConfirmModal(false);
    }
  };

  /* ======= UTIL ======= */
  const starsOrNone = (score: number) =>
    score > 0 ? "★".repeat(score) : "Sin puntuación";

  /* ======= PDF ======= */
  const downloadPdf = async () => {
    const token = Cookies.get("token");
    if (!token) return;

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
      link.setAttribute("download", "mis-reseñas.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {}
  };

  /* ======= FILTROS ======= */
  const filtered = reviews.filter(({ publication, review }) => {
    if (publication.types !== 0) return false;

    if (filterStatus === "open" && review.isClosed) return false;
    if (filterStatus === "closed" && !review.isClosed) return false;

    if (filterScore !== "all") {
      const s = Number(filterScore);
      if (review.ratingForStudent !== s && review.ratingForOfferor !== s)
        return false;
    }

    return true;
  });

  /* ======= ORDEN ======= */
  const ordered = [...filtered].sort((a, b) => {
    if (orderBy === "asc") return a.review.idReview - b.review.idReview;
    if (orderBy === "desc") return b.review.idReview - a.review.idReview;
    return 0;
  });

  /* ======= PAGINACIÓN ======= */
  const paginated = ordered.slice((page - 1) * pageSize, page * pageSize);

  /* ======= LOAD ======= */
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
      .catch(() => setError("Error al cargar reseñas."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando reseñas...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-center">
        Historial de trabajos realizados
      </h1>

      {/* ======= FILTERS ======= */}
      <div className="flex justify-between items-end mt-6 flex-wrap gap-6">
        <div className="flex gap-4 items-end">
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

          <div className="flex flex-col">
            <label className="text-sm font-medium">Puntuación</label>
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Todas</option>
              <option value="6">★★★★★★ (6)</option>
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★ (4)</option>
              <option value="3">★★★ (3)</option>
              <option value="2">★★ (2)</option>
              <option value="1">★ (1)</option>
              <option value="0">Sin calificar</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Ordenar</label>
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

        <button
          onClick={downloadPdf}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Generar PDF
        </button>
      </div>

      {/* ======= LISTA ======= */}
      {paginated.map(({ publication, review }) => (
        <div
          key={review.idReview}
          className="border rounded-xl shadow-sm p-5 bg-white flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">
              {publication.title} — Reseña #{review.idReview}
            </h2>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                review.isClosed
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {review.isClosed ? "Cerrada" : "Abierta"}
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Publicada el:{" "}
            {new Date(publication.publicationDate).toLocaleDateString("es-CL")}
          </p>

          <div>
            <p>
              <strong>Oferente:</strong> {review.offerorName}
            </p>
          </div>

          <p>
            <strong>Calificación al estudiante:</strong>{" "}
            <span className="text-purple-700">
              {starsOrNone(review.ratingForStudent)}
            </span>
          </p>

          <p>
            <strong>Tu calificación al oferente:</strong>{" "}
            <span className="text-purple-700">
              {starsOrNone(review.ratingForOfferor)}
            </span>
          </p>

          <button
            onClick={() => openModal({ publication, review })}
            className="mt-2 w-full text-center text-sm font-medium border border-purple-400 text-purple-700 rounded-lg py-2 hover:bg-purple-50"
          >
            Ver detalles
          </button>

          <button
            onClick={() => openFinishModal({ publication, review })}
            disabled={review.isReviewForOfferorCompleted}
            className={`mt-2 w-full text-center text-sm font-medium rounded-lg py-2 transition ${
              review.isReviewForOfferorCompleted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Finalizar
          </button>
        </div>
      ))}

      {/* ======= PAGINACIÓN ======= */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <p className="text-sm text-gray-600">
          Página {page} de {Math.ceil(filtered.length / pageSize)}
        </p>

        <div className="flex gap-4">
          <button
            className="px-4 py-2 rounded-md border hover:bg-gray-100 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ← Anterior
          </button>

          <button
            className="px-4 py-2 rounded-md border hover:bg-gray-100 disabled:opacity-50"
            disabled={page * pageSize >= filtered.length}
            onClick={() => setPage(page + 1)}
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* ================================================================
          MODAL DETALLES
      ================================================================= */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-3xl rounded-lg shadow-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">
              Detalles de la reseña #{selectedReview.review.idReview}
            </h2>

            {/* PUBLICACIÓN */}
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold">
                {selectedReview.publication.title}
              </h3>
              <p className="text-gray-600">
                {selectedReview.publication.description}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Fecha:{" "}
                {new Date(
                  selectedReview.publication.publicationDate
                ).toLocaleDateString("es-CL")}
              </p>
            </div>

            {/* OFERENTE → ESTUDIANTE */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-1">
                Oferente → Estudiante
              </p>

              <div className="flex items-center gap-2">
                <p className="text-yellow-500 text-lg">
                  {starsOrNone(selectedReview.review.ratingForStudent)}
                </p>
                <span className="font-medium">
                  {selectedReview.review.offerorName}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-700">
                {selectedReview.review.commentForStudent || "Sin reseña"}
              </p>
            </div>

            {/* ESTUDIANTE → OFERENTE */}
            <div className="border rounded-lg p-4 mt-6">
              <p className="font-semibold text-gray-800 mb-1">
                Estudiante → Oferente
              </p>

              <div className="flex items-center gap-2">
                <p className="text-yellow-500 text-lg">
                  {starsOrNone(selectedReview.review.ratingForOfferor)}
                </p>
                <span className="font-medium">
                  {selectedReview.review.studentName}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-700">
                {selectedReview.review.commentForOfferor || "Sin reseña"}
              </p>
            </div>

            {/* CHECKBOXES */}
            <div className="text-sm text-gray-800 space-y-4 mt-6">
              <label className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedReview.review.atTime
                      ? "bg-purple-700 border-purple-800"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {selectedReview.review.atTime && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                ¿Llegó a la hora?
              </label>

              <label className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedReview.review.goodPresentation
                      ? "bg-purple-700 border-purple-800"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {selectedReview.review.goodPresentation && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
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

      {/* ================================================================
          MODAL FINALIZAR EVALUACIÓN
      ================================================================= */}
      {showFinishModal && finishReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-40">
          <div className="bg-white w-[95%] max-w-3xl rounded-xl shadow-xl p-8 relative">
            <button
              onClick={closeFinishModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-center mb-8">
              ¡GRACIAS POR TRABAJAR CON NOSOTROS!
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-purple-500 text-white rounded-lg p-6 flex-1 flex items-center justify-center text-center text-lg font-semibold shadow-md">
                {finishReview.review.offerorName}
              </div>

              <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                A través de este formulario, cuéntanos cómo fue tu experiencia
                trabajando con este oferente.
              </div>
            </div>

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
              />
            </div>

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
              <p className="text-sm mt-1 text-gray-600">Puntuar</p>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={handleOpenConfirm}
                disabled={!commentEmployer.trim() || rating === 0}
                className="px-8 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md disabled:bg-gray-400"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL CONFIRMACIÓN (blur + FEUCN)
      ================================================================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">Confirmar envío</h2>
            <p className="text-gray-700 mb-6">
              ¿Seguro que deseas enviar esta evaluación?  
              Una vez enviada no podrás editarla.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelConfirm}
                className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>

              <button
                onClick={confirmSubmitOfferorReview}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
