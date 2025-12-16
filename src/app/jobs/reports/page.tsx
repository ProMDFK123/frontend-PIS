"use client";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { NotificationBanner } from "@/components/ui/notification";
import type { NotificationState } from "@/hooks/common/use-notification";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

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

export default function AdminReviewsPage() {
  // Constantes de estado
  const [reviews, setReviews] = useState<CombinedReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Constantes para filtros y ordenamiento
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [orderBy, setOrderBy] = useState("none");

  // Constantes para paginación
  const pageSize = 5;
  const [page, setPage] = useState(1);

  // Constantes para el uso del modal de detalles
  const [selectedReview, setSelectedReview] = useState<CombinedReviewDTO | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Constantes para notificaciones
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  // Modal de confirmación
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    ReviewId: number;
    DeleteStudent: boolean;
    DeleteOfferor: boolean;
  } | null>(null);

  // ========================================================
  // PDF
  // ========================================================
  const downloadPdf = async () => {
    const token = Cookies.get("token");
    if (!token) return alert("No se encontró el token.");

    try {
      const response = await axios.get(
        "http://localhost:5185/api/Review/Admin/system-reviews/pdf",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "system-reviews.pdf");
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("No se pudo descargar el PDF.");
    }
  };

  // ========================================================
  // Modal detalles
  // ========================================================
  const openModal = (item: CombinedReviewDTO) => {
    setSelectedReview(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  // ========================================================
  // Filtros
  // ========================================================
  const filteredReviews = reviews.filter((item) => {
    const r = item.review;
    const p = item.publication;

    if (p.types !== 0) return false;
    if (filterStatus === "open" && r.isClosed) return false;
    if (filterStatus === "closed" && !r.isClosed) return false;

    if (filterScore !== "all") {
      const score = Number(filterScore);
      if (r.ratingForStudent !== score && r.ratingForOfferor !== score) return false;
    }

    return true;
  });

  const orderedReviews = [...filteredReviews].sort((a, b) => {
    if (orderBy === "asc") return a.review.idReview - b.review.idReview;
    if (orderBy === "desc") return b.review.idReview - a.review.idReview;
    return 0;
  });

  const paginated = orderedReviews.slice((page - 1) * pageSize, page * pageSize);


  useEffect(() => {
  if (!isNotificationVisible) return;

  const timer = setTimeout(() => {
    setIsNotificationVisible(false);
  }, 3500);

  return () => clearTimeout(timer);
  }, [isNotificationVisible]);


  // ========================================================
  // Load Reviews
  // ========================================================
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return setError("No hay token de administrador.");

    try {
      const claims: any = jwtDecode(token);
      if (claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] !== "Admin") {
        return setError("No tienes permisos para ver esta sección.");
      }
    } catch {
      return setError("Token inválido.");
    }

    axios
      .get("http://localhost:5185/api/Review/Admin/system-reviews", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReviews(res.data))
      .catch(() => setError("Error al cargar las reseñas."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
  if (showModal || confirmDelete) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [showModal, confirmDelete]);

  
  const starsOrNone = (score: number) =>
    score > 0 ? "★".repeat(score) : "Sin puntuación";

  // ========================================================
  //  Preparar eliminación (abre modal de confirmación)
  // ========================================================
  const requestDelete = (
  ReviewId: number,
  DeleteStudent: boolean,
  DeleteOfferor: boolean
) => {
  if (!selectedReview) return;

  const review = selectedReview.review;

  // Intento de borrar parte del oferente
  if (DeleteStudent && !canDeleteOfferorReview(review)) {
    setNotification({
      type: "error",
      title: "Acción no permitida",
      message:
        "No se puede eliminar una reseña que aún no ha sido emitida por el oferente.",
    });
    setIsNotificationVisible(true);
    return;
  }

  // Intento de borrar parte del estudiante
  if (DeleteOfferor && !canDeleteStudentReview(review)) {
    setNotification({
      type: "error",
      title: "Acción no permitida",
      message:
        "No se puede eliminar una reseña que aún no ha sido emitida por el estudiante.",
    });
    setIsNotificationVisible(true);
    return;
  }

  setDeleteTarget({ ReviewId, DeleteStudent, DeleteOfferor });
  setConfirmDelete(true);
};

  // ========================================================
  //  Ejecutar eliminación
  // ========================================================
  const executeDelete = async () => {
  if (!deleteTarget || !selectedReview) return;

  const { ReviewId, DeleteStudent, DeleteOfferor } = deleteTarget;
  const token = Cookies.get("token");
  if (!token) return;

  try {
    await axios.post(
      "http://localhost:5185/api/Review/Admin/DeleteReviewPart",
      {
        reviewId: ReviewId,
        deleteReviewForStudent: DeleteStudent,
        deleteReviewForOfferor: DeleteOfferor,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const refreshed = await axios.get(
      "http://localhost:5185/api/Review/Admin/system-reviews",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setReviews(refreshed.data);

    const updated = refreshed.data.find(
      (x: CombinedReviewDTO) => x.review.idReview === ReviewId
    );
    if (updated) setSelectedReview(updated);

    // ✅ CREAR NOTIFICACIÓN
    const notificationData = buildDeleteNotification(
      DeleteStudent,
      DeleteOfferor,
      ReviewId,
      selectedReview.publication.title
    );

    setNotification(notificationData);
    setIsNotificationVisible(true);

    // limpiar confirmación
    setConfirmDelete(false);
    setDeleteTarget(null);
  } catch {
    alert("Error al eliminar la reseña.");
  }
};

  // ========================================================
  // RENDER
  // ========================================================
  if (loading) return <p className="text-center mt-10">Cargando reseñas...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  // Descripción dinámica del modal de confirmación
  const getConfirmDescription = () => {
  if (!deleteTarget) return "";

  if (deleteTarget.DeleteStudent && deleteTarget.DeleteOfferor) {
    return "¿Seguro que deseas borrar TODAS las partes de esta reseña?";
  }

  if (deleteTarget.DeleteStudent) {
    return "¿Seguro que deseas borrar la parte del OFERENTE?";
  }

  return "¿Seguro que deseas borrar la parte del ESTUDIANTE?";
  };


  const buildDeleteNotification = (
  isStudent: boolean,
  isOfferor: boolean,
  reviewId: number,
  jobTitle: string
): NotificationState => {
  if (isStudent && isOfferor) {
    return {
      type: "success",
      title: "Reseña eliminada",
      message: `Se eliminaron todas las partes de la reseña #${reviewId} del trabajo "${jobTitle}".`,
    };
  }

  if (isStudent) {
    return {
      type: "success",
      title: "Comentario eliminado",
      message: `Se eliminó el comentario del OFERENTE en el trabajo "${jobTitle}" (Reseña #${reviewId}).`,
    };
  }

  return {
    type: "success",
    title: "Comentario eliminado",
    message: `Se eliminó el comentario del ESTUDIANTE en el trabajo "${jobTitle}" (Reseña #${reviewId}).`,
  };
};

// Obtener texto adecuado para comentarios eliminados o vacíos
const getStudentCommentText = (review: ReviewDetailDTO) => {
  if (review.hasReviewForOfferorBeenDeleted) {
    return "Reseña eliminada por administrador";
  }

  if (!review.commentForOfferor || review.commentForOfferor.trim() === "") {
    return "Reseña pendiente";
  }

  return review.commentForOfferor;
};

const getOfferorCommentText = (review: ReviewDetailDTO) => {
  if (review.hasReviewForStudentBeenDeleted) {
    return "Reseña eliminada por administrador";
  }

  if (!review.commentForStudent || review.commentForStudent.trim() === "") {
    return "Reseña pendiente";
  }

  return review.commentForStudent;
};

  // Constantes para permisos de eliminación
  const canDeleteOfferorReview = (review: ReviewDetailDTO) => {
  // Oferente califica al estudiante
  return review.isReviewForStudentCompleted;
};

const canDeleteStudentReview = (review: ReviewDetailDTO) => {
  // Estudiante califica al oferente
  return review.isReviewForOfferorCompleted;
};

const reviewsGroupedByPublication = paginated.reduce((acc, item) => {
  const pubId = item.publication.idPublication;
  
  if (!acc[pubId]) {
    acc[pubId] = {
      publication: item.publication,
      reviews: [],
    };
  }

  acc[pubId].reviews.push(item.review);
  return acc;
}, {} as Record<
  number,
  { publication: PublicationDTO; reviews: ReviewDetailDTO[] }
>);


  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6 pb-10">

      <h1 className="text-3xl font-bold text-center">Historial de Trabajos del Sistema</h1>

      {/* FILTROS */}
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

        <button
          onClick={downloadPdf}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Descargar reporte PDF
        </button>
      </div>

      {/* TARJETAS */}
      {Object.values(reviewsGroupedByPublication).map(
        ({ publication, reviews }) => {

          // AQUÍ se declara correctamente
          const hasSingleReview = reviews.length === 1;

          return (
            <div
              key={publication.idPublication}
              className="border-2 border-gray-900 rounded-2xl p-6 bg-white shadow-md space-y-4"
            >
              {/* ===== TARJETA GRANDE: TRABAJO ===== */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-purple-700">
                    {publication.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Publicado el{" "}
                    {new Date(publication.publicationDate).toLocaleDateString("es-CL")}
                  </p>

                  {!hasSingleReview && (
                    <p className="text-sm text-gray-600">
                      Oferente: <strong>{reviews[0].offerorName}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* ===== RESEÑAS DEL TRABAJO ===== */}
              <div className="space-y-3 mt-4">
                {reviews.map((review) => (
                  <div
                    key={review.idReview}
                    className="border-2 border-gray-300 rounded-2xl p-6 bg-white shadow-md space-y-4"
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

                    {/* SOLO cuando hay UNA reseña */}
                    {hasSingleReview && (
                      <p className="text-sm text-gray-700">
                        <strong>Oferente:</strong> {review.offerorName}
                      </p>
                    )}

                    <p className="text-sm">
                      <strong>Estudiante:</strong> {review.studentName}
                    </p>

                    <p className="text-sm">
                      <strong>Calificación al estudiante:</strong>{" "}
                      <span className="text-purple-600">
                        {starsOrNone(review.ratingForStudent)}
                      </span>
                    </p>

                    <p className="text-sm">
                      <strong>Calificación al oferente:</strong>{" "}
                      <span className="text-purple-600">
                        {starsOrNone(review.ratingForOfferor)}
                      </span>
                    </p>

                    <button
                      onClick={() =>
                        openModal({
                          publication,
                          review,
                        })
                      }
                      className="mt-2 w-full text-center text-sm font-medium border border-purple-400 text-purple-700 rounded-lg py-2 hover:bg-purple-50"
                    >
                      Ver detalles
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      )}


      {/* PAGINACIÓN */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <p className="text-sm text-gray-600">
          Página <strong>{page}</strong> de{" "}
          <strong>{Math.ceil(filteredReviews.length / pageSize)}</strong>
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
            disabled={page * pageSize >= filteredReviews.length}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/*                     MODAL DETALLES                */}
      {/* ================================================= */}

      {showModal && selectedReview && (
        <div className="fixed inset-0 h-screen w-screen bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Evaluación de Trabajo</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {/* PUBLICACIÓN */}
  <div className="col-span-1 border rounded-lg p-3 flex flex-col items-center">

    {selectedReview.publication.images.length > 0 ? (
      <img
        src={selectedReview.publication.images[0].url}
        className="w-full h-40 object-cover rounded-md"
      />
    ) : (
      <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
        Sin imagen
      </div>
    )}

    <h3 className="text-lg font-semibold mt-3">
      {selectedReview.publication.title}
    </h3>

    <p className="text-sm text-center text-gray-600 mt-1">
      {selectedReview.publication.description}
    </p>

    <div className="text-sm text-gray-700 mt-3 space-y-1 w-full">
      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(selectedReview.publication.publicationDate).toLocaleDateString("es-CL")}
      </p>

      <p>
        <strong>Estado reseña:</strong>{" "}
        {selectedReview.review.isClosed ? (
          <span className="text-green-600 font-semibold">Cerrada</span>
        ) : (
          <span className="text-yellow-600 font-semibold">Abierta</span>
        )}
      </p>
    </div>
  </div>

  {/* RESEÑAS + CHECKBOXES ALINEADOS A LA DERECHA */}
  <div className="col-span-2 space-y-6">

    {/* Oferente */}
    <div className="border rounded-lg p-4 relative">
      <button
        onClick={() =>
          requestDelete(selectedReview.review.idReview, true, false)
        }
        disabled={!canDeleteOfferorReview(selectedReview.review)}
        className={`absolute top-3 right-3 text-2xl ${
          canDeleteOfferorReview(selectedReview.review)
            ? "text-red-500 hover:text-red-700"
            : "text-gray-300 cursor-not-allowed"
        }`}
        title={
          canDeleteOfferorReview(selectedReview.review)
            ? "Eliminar reseña del oferente"
            : "El oferente aún no ha emitido su reseña"
        }
      >
        🗑️
      </button>
      <p className="font-semibold text-gray-800 mb-1">Oferente</p>

      <div className="flex items-center gap-2">
        <p className="text-yellow-500 text-lg">
          {selectedReview.review.ratingForStudent > 0
            ? "★".repeat(selectedReview.review.ratingForStudent)
            : "Sin puntuación"}
        </p>
        <span className="font-medium">{selectedReview.review.offerorName}</span>
      </div>

      <p className="mt-2 text-sm text-gray-700">
      {getOfferorCommentText(selectedReview.review)}
    </p>
    </div>

    {/* Estudiante */}
    <div className="border rounded-lg p-4 relative">
      <button
        onClick={() =>
          requestDelete(selectedReview.review.idReview, false, true)
        }
        disabled={!canDeleteStudentReview(selectedReview.review)}
        className={`absolute top-3 right-3 text-2xl ${
          canDeleteStudentReview(selectedReview.review)
            ? "text-red-500 hover:text-red-700"
            : "text-gray-300 cursor-not-allowed"
        }`}
        title={
          canDeleteStudentReview(selectedReview.review)
            ? "Eliminar reseña del estudiante"
            : "El estudiante aún no ha emitido su reseña"
        }
      >
        🗑️
      </button>


      <p className="font-semibold text-gray-800 mb-1">Estudiante</p>

      <div className="flex items-center gap-2">
        <p className="text-yellow-500 text-lg">
          {selectedReview.review.ratingForOfferor > 0
            ? "★".repeat(selectedReview.review.ratingForOfferor)
            : "Sin puntuación"}
        </p>
        <span className="font-medium">{selectedReview.review.studentName}</span>
      </div>

      <p className="mt-2 text-sm text-gray-700">
        {getStudentCommentText(selectedReview.review)}
      </p>
    </div>

    {/* CHECKBOXES — debajo del estudiante y alineados a la derecha */}
    <div className="flex flex-col gap-3 pl-4">

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        ¿Se presentó a trabajar en la hora acordada?
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        ¿Tuvo buena presentación personal?
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
      ¿El estudiante fue respetuoso con el oferente?
      </label>

    </div>

  </div>




              {/* BOTÓN CERRAR */}
              <div className="flex justify-end mt-6 col-span-3">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/*         MODAL DE CONFIRMACIÓN ELEGANTE            */}
      {/* ================================================= */}
      
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDelete(false);
            setDeleteTarget(null);
          }
        }}
        title="Confirmar eliminación"
        description={getConfirmDescription()}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={executeDelete}
        onCancel={() => {
          setConfirmDelete(false);
          setDeleteTarget(null);
        }}
      />

      {/* ================================================= */}
      {/*               BANNER DE NOTIFICACIÓN              */}
      {/* ================================================= */}
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
