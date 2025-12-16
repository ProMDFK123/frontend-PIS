"use client";

import { NotificationBanner } from "@/components/ui/notification";
import type { NotificationState } from "@/hooks/common/use-notification";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
  studentHasRespectOfferor: boolean; 
  isCompleted: boolean;
  isReviewForStudentCompleted: boolean;
  isReviewForOfferorCompleted: boolean;
  hasReviewForOfferorBeenDeleted: boolean;
  hasReviewForStudentBeenDeleted: boolean;
  isClosed: boolean;
}

interface CombinedReviewDTO {
  publication: PublicationDTO;
  review: ReviewDetailDTO;
}

export default function OfferentReviewsPage() {
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

  /* ======= FORMULARIO (Oferente → Estudiante) ======= */
  const [commentStudent, setCommentStudent] = useState("");
  const [rating, setRating] = useState(0);
  const [atTime, setAtTime] = useState(false);
  const [goodPresentation, setGoodPresentation] = useState(false);
  const [studentHasRespectOfferor, setStudentHasRespectOfferor] = useState(false);
  const MAX_COMMENT_LENGTH = 320;

  const remainingCommentChars =
  MAX_COMMENT_LENGTH - commentStudent.length;

  const isCommentOverLimit = remainingCommentChars < 0;


  const openModal = (item: CombinedReviewDTO) => {
    setSelectedReview(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  const openFinishModal = (item: CombinedReviewDTO) => {
  if (item.review.hasReviewForStudentBeenDeleted) return;
  setFinishReview(item);
  setShowFinishModal(true);

  setCommentStudent("");
  setRating(0);
  setAtTime(false);
  setGoodPresentation(false);
  setStudentHasRespectOfferor(false);
};

  const closeFinishModal = () => {
  setShowFinishModal(false);
  setFinishReview(null);

  setCommentStudent("");
  setRating(0);
  setAtTime(false);
  setGoodPresentation(false);
  setStudentHasRespectOfferor(false); 
};


  /* ======= NOTIFICACIONES ======= */
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  /* ======= Refrescar pagina sin reiniciarla ======= */

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
    if (!commentStudent.trim() || rating === 0) return;
    setShowConfirmModal(true);
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  /* ======= ENVÍO FINAL (OFERENTE → ESTUDIANTE) ======= */
  const confirmSubmitStudentReview = async () => {
    if (!finishReview) return;

    const token = Cookies.get("token");
    if (!token) return;

    try {
      const body = {
      ratingForStudent: rating,
      commentForStudent: commentStudent.trim(),
      sendedAt: new Date(),
      atTime,
      goodPresentation,
      studentHasRespectOfferor,
      reviewId: finishReview.review.idReview,
    };


      await axios.post(
        "http://localhost:5185/api/Review/AddStudentReview",
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowConfirmModal(false);
      closeFinishModal();

      // Recargar los datos sin refrescar la página
      await refreshReviews();
      // Mostrar notificacion de reseña enviada
      setNotification({
        type: "success",
        title: "Reseña enviada",
        message: `La evaluación del estudiante "${finishReview.review.studentName}" fue enviada correctamente para el trabajo "${finishReview.publication.title}" (Reseña #${finishReview.review.idReview}).`,
      });
      setIsNotificationVisible(true);

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
    } catch (err) {
      console.error("Error al generar PDF:", err);
    }
  };

  /* ======= FILTROS ======= */
  const filtered = reviews.filter(({ publication, review }) => {
    // Solo trabajos (types == 0)
    if (publication.types !== 0) return false;

    if (filterStatus === "open" && review.isClosed) return false;
    if (filterStatus === "closed" && !review.isClosed) return false;

    if (filterScore !== "all") {
      const s = Number(filterScore);
      if (review.ratingForStudent !== s && review.ratingForOfferor !== s) return false;
    }

    return true;
  });

  /* ======= ORDEN POR IDPUBLICATION ======= */
  const ordered = [...filtered].sort((a, b) => {
  if (orderBy === "asc") return a.publication.idPublication - b.publication.idPublication;
  if (orderBy === "desc") return b.publication.idPublication - a.publication.idPublication;
  return 0;
});


  /* ======= AGRUPAR POR TRABAJO (ANTES DE PAGINAR) ======= */
  const map = new Map<number, { publication: PublicationDTO; reviews: ReviewDetailDTO[] }>();

  for (const item of ordered) {
    const pubId = item.publication.idPublication;

    if (!map.has(pubId)) {
      map.set(pubId, { publication: item.publication, reviews: [] });
    }

    map.get(pubId)!.reviews.push(item.review);
  }

const groupedArray = Array.from(map.values());

/* ======= PAGINAR TRABAJOS ======= */
const paginatedGroups = groupedArray.slice(
  (page - 1) * pageSize,
  page * pageSize
);



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

  useEffect(() => {
    const isAnyModalOpen = showModal || showFinishModal || showConfirmModal;

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal, showFinishModal, showConfirmModal]);

  // Auto cerrar notificacion
  useEffect(() => {
  if (!isNotificationVisible) return;

  const timer = setTimeout(() => {
    setIsNotificationVisible(false);
  }, 3500);

  return () => clearTimeout(timer);
  }, [isNotificationVisible]);

  useEffect(() => {
  setPage(1);
}, [orderBy, filterStatus, filterScore]);

  if (loading) return <p className="text-center mt-10">Cargando reseñas...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen max-w-3xl mx-auto mt-10 space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-center">
        Historial de estudiantes evaluados
      </h1>

      {/* ======= FILTERS + PDF ======= */}
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
      {paginatedGroups.map(
  ({ publication, reviews }) => {

    // SABER SI ES UNA SOLA RESEÑA
    const hasSingleReview = reviews.length === 1;

    return (
      <div
        key={publication.idPublication}
        className="border-2 border-gray-900 rounded-2xl p-6 bg-white shadow-md space-y-4"
      >
        {/* ===== TRABAJO ===== */}
        <div>
          <h2 className="text-xl font-bold text-purple-700">
            {publication.title}{" "}
            <span className="text-gray-600 font-semibold">
              #{publication.idPublication}
            </span>
          </h2>


          <p className="text-sm text-gray-500">
            Publicado el{" "}
            {new Date(publication.publicationDate).toLocaleDateString("es-CL")}
          </p>
        </div>

        {/* ===== RESEÑAS ===== */}
        <div className="space-y-4 mt-4">
          {reviews.map((review) => (
            <div
              key={review.idReview}
              className="border-2 border-gray-300 rounded-2xl p-6 bg-white shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  Reseña #{review.idReview}
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    review.isClosed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {review.isClosed ? "Cerrada" : "Abierta"}
                </span>
              </div>

              {/* SOLO SI HAY UNA SOLA RESEÑA */}
              {hasSingleReview && (
                <p className="text-sm text-gray-700">
                  <strong>Estudiante:</strong> {review.studentName}
                </p>
              )}

              {!hasSingleReview && (
                <p className="text-sm">
                  <strong>Estudiante:</strong> {review.studentName}
                </p>
              )}

              <p className="text-sm">
                <strong>Tu calificación al estudiante:</strong>{" "}
                <span className="text-purple-700">
                  {starsOrNone(review.ratingForStudent)}
                </span>
              </p>

              <p className="text-sm">
                <strong>Calificación del estudiante hacia ti:</strong>{" "}
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
                disabled={
                  review.isReviewForStudentCompleted ||
                  review.hasReviewForStudentBeenDeleted
                }
                className={`mt-2 w-full text-center text-sm font-medium rounded-lg py-2 transition ${
                  review.isReviewForStudentCompleted || review.hasReviewForStudentBeenDeleted
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                Evaluar al estudiante
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
)}

    {/* ======= PAGINACIÓN ======= */}
    <div className="flex flex-col items-center gap-3 mt-6">
      <p className="text-sm text-gray-600">
        Página {page} de {Math.ceil(groupedArray.length / pageSize)}
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
          disabled={page * pageSize >= groupedArray.length}
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
        <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

         <div className="bg-white w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
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
                {selectedReview.review.hasReviewForStudentBeenDeleted
                  ? "Tu reseña fue eliminada por un administrador"
                  : selectedReview.review.commentForStudent?.trim()
                    ? selectedReview.review.commentForStudent
                    : "Reseña pendiente"}
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
                {selectedReview.review.hasReviewForOfferorBeenDeleted
                  ? "La reseña del estudiante fue eliminada por un administrador."
                  : selectedReview.review.commentForOfferor &&
                    selectedReview.review.commentForOfferor !== "Reseña eliminada"
                      ? selectedReview.review.commentForOfferor
                      : "Reseña pendiente"}
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

              <label className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedReview.review.studentHasRespectOfferor
                      ? "bg-purple-700 border-purple-800"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {selectedReview.review.studentHasRespectOfferor && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                ¿El estudiante fue respetuoso con el oferente?
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
          MODAL FINALIZAR EVALUACIÓN (OFERENTE → ESTUDIANTE)
      ================================================================= */}
      {showFinishModal && finishReview && (
        <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
         <div className="bg-white w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">

            <button
              onClick={closeFinishModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* Encabezado tipo “formulario FEUCN” */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                Formulario de evaluación
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mt-1">
                Evalúa al estudiante
              </h2>
            </div>

            {/* Nombre del estudiante + explicación */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-purple-500 text-white rounded-lg p-6 flex-1 flex items-center justify-center text-center text-lg font-semibold shadow-md">
                {finishReview.review.studentName}
              </div>

              <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                A través de este formulario, evalúa el desempeño del estudiante
                en este trabajo. Esta información también le entregará
                orientación a futuros oferentes.
              </div>
            </div>

            {/* Preguntas de checkboxes */}
            <div className="mt-8 space-y-4">
              <p className="text-sm font-semibold text-gray-800">
                Sobre el compromiso del estudiante
              </p>

              <label className="flex items-center gap-3 text-sm text-gray-800">
                <button
                  type="button"
                  onClick={() => setAtTime((prev) => !prev)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                    atTime
                      ? "bg-purple-600 border-purple-700"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {atTime && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                El estudiante llegó puntualmente al trabajo.
              </label>

              <label className="flex items-center gap-3 text-sm text-gray-800">
                <button
                  type="button"
                  onClick={() => setGoodPresentation((prev) => !prev)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                    goodPresentation
                      ? "bg-purple-600 border-purple-700"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {goodPresentation && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                El estudiante tuvo una buena presentación personal.
              </label>

              <label className="flex items-center gap-3 text-sm text-gray-800">
                <button
                  type="button"
                  onClick={() => setStudentHasRespectOfferor((prev) => !prev)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                    studentHasRespectOfferor
                      ? "bg-purple-600 border-purple-700"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {studentHasRespectOfferor && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                El estudiante fue respetuoso durante el trabajo.
              </label>

            </div>

            {/* Rating */}
            <div className="flex flex-col items-center mt-8">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Califica el desempeño general del estudiante
              </p>
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
              <p className="text-xs mt-1 text-gray-500">
                1 = Muy bajo, 6 = Excelente
              </p>
            </div>

            {/* Comentario */}
            <div className="mt-8">
              <label className="text-sm font-semibold text-gray-800">
                Déjanos un comentario sobre el estudiante
              </label>
              <textarea
                rows={4}
                value={commentStudent}
                onChange={(e) => setCommentStudent(e.target.value)}
                placeholder="Describe el desempeño, fortalezas o aspectos a mejorar del estudiante..."
                className={`w-full rounded-lg p-3 mt-2 focus:outline-none ${
                  isCommentOverLimit
                    ? "border-2 border-red-500 focus:ring-2 focus:ring-red-400"
                    : "border border-purple-300 focus:ring-2 focus:ring-purple-400"
                }`}
              />

              <p
                className={`mt-1 text-xs text-right ${
                  isCommentOverLimit ? "text-red-600" : "text-gray-500"
                }`}
              >
                {remainingCommentChars >= 0
                  ? `320 carácteres máximo | ${remainingCommentChars} restantes`
                  : `Te excediste por ${Math.abs(remainingCommentChars)} carácteres.`}
              </p>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={handleOpenConfirm}
                disabled={
                  !commentStudent.trim() ||
                  rating === 0 ||
                  isCommentOverLimit
                }
                className="px-8 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md disabled:bg-gray-400"
              >
                Enviar evaluación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL CONFIRMACIÓN (blur + morado)
      ================================================================= */}
      <ConfirmDialog
        open={showConfirmModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowConfirmModal(false);
          }
        }}
        title="Confirmar envío"
        description="¿Seguro que deseas enviar esta evaluación del estudiante? Una vez enviada no podrás editarla."
        confirmText="Confirmar envío"
        cancelText="Cancelar"
        onConfirm={confirmSubmitStudentReview}
        onCancel={handleCancelConfirm}
      />


      {/* ======= NOTIFICACION ======= */}
      <div
        className={`fixed top-0 right-0 z-50 ${
          isNotificationVisible ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <NotificationBanner
          data={notification}
          isVisible={isNotificationVisible}
          onClose={() => setIsNotificationVisible(false)}
        />
      </div>

    </div>
  );
}
