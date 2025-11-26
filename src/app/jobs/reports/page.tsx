"use client";

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
  isCompleted: boolean;
  isReviewForStudentCompleted: boolean;
  isReviewForOfferorCompleted: boolean;
  isClosed: boolean;
}

interface CombinedReviewDTO {
  publication: PublicationDTO;
  review: ReviewDetailDTO;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CombinedReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterScore, setFilterScore] = useState("all");

  // 🔥 Nuevo estado para ordenamiento
  const [orderBy, setOrderBy] = useState("none");

  const pageSize = 5;
  const [page, setPage] = useState(1);

  const [selectedReview, setSelectedReview] = useState<CombinedReviewDTO | null>(null);
  const [showModal, setShowModal] = useState(false);

  const downloadPdf = async () => {
    const token = Cookies.get("token");
    if (!token) {
      alert("No se encontró el token.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5185/api/Review/Admin/system-reviews/pdf",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "system-reviews.pdf");
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando PDF:", error);
      alert("No se pudo descargar el PDF.");
    }
  };

  const openModal = (item: CombinedReviewDTO) => {
    setSelectedReview(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  /* ============================================
      Filtros y type === 0
  ============================================ */
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

  /* ============================================
      🔥 Ordenamiento por ID (ASC / DESC)
  ============================================ */
  const orderedReviews = [...filteredReviews].sort((a, b) => {
    if (orderBy === "asc") return a.review.idReview - b.review.idReview;
    if (orderBy === "desc") return b.review.idReview - a.review.idReview;
    return 0;
  });

  /* ============================================
      Paginación usando orderedReviews
  ============================================ */
  const paginated = orderedReviews.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No hay token de administrador.");
      setLoading(false);
      return;
    }

    try {
      const claims: any = jwtDecode(token);
      if (claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] !== "Admin") {
        setError("No tienes permisos para ver esta sección.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Token inválido.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5185/api/Review/Admin/system-reviews", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setReviews(res.data);
      })
      .catch(() => setError("Error al cargar las reseñas."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando reseñas...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const starsOrNone = (score: number) =>
    score > 0 ? "★".repeat(score) : "Sin puntuación";

  const deleteReviewPart = async (
    ReviewId: number,
    DeleteStudent: boolean,
    DeleteOfferor: boolean
  ) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      await axios.request({
        method: "DELETE",
        url: "http://localhost:5185/api/Review/Admin/DeleteReviewPart",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          ReviewId,
          DeleteReviewForStudent: DeleteStudent,
          DeleteReviewForOfferor: DeleteOfferor,
        },
      });

      return true;
    } catch (err) {
      console.error("Error eliminando reseña:", err);
      return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6 pb-10">
      <h1 className="text-3xl font-bold text-center">Historial de Trabajos del Sistema</h1>

      {/* ============================ FILTROS + PDF ============================ */}

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
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★ (4)</option>
              <option value="3">★★★ (3)</option>
              <option value="2">★★ (2)</option>
              <option value="1">★ (1)</option>
              <option value="0">Sin calificar</option>
            </select>
          </div>

          {/* 🔥 Nuevo select: Ordenar por ID */}
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

        {/* PDF */}
        <button
          onClick={downloadPdf}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Descargar reporte PDF
        </button>
      </div>

      {/* ============================ TARJETAS ============================ */}
      {paginated.map((item) => {
        const r = item.review;
        const p = item.publication;

        return (
          <div key={r.idReview} className="border rounded-xl shadow-sm p-5 bg-white flex flex-col gap-4">

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{p.title} — Reseña #{r.idReview}</h2>

              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                r.isClosed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {r.isClosed ? "Cerrada" : "Abierta"}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Publicada el: {new Date(p.publicationDate).toLocaleDateString("es-CL")}
            </p>

            <div className="text-base space-y-1">
              <p><strong>Estudiante:</strong> {r.studentName}</p>
              <p><strong>Oferente:</strong> {r.offerorName}</p>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Calificación al estudiante:</strong>{" "}
                <span className="text-purple-600">
                  {starsOrNone(r.ratingForStudent)}
                </span>
              </p>

              <p>
                <strong>Calificación al oferente:</strong>{" "}
                <span className="text-purple-600">
                  {starsOrNone(r.ratingForOfferor)}
                </span>
              </p>
            </div>

            <button
              onClick={() => openModal(item)}
              className="mt-2 w-full text-center text-sm font-medium border border-purple-400 text-purple-700 rounded-lg py-2 hover:bg-purple-50"
            >
              Ver detalles
            </button>
          </div>
        );
      })}

      {/* ============================ PAGINACIÓN ============================ */}
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

      {/* ============================ MODAL DETALLES ============================ */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-5xl rounded-lg shadow-lg p-6 relative">

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

                {/* AQUI AGREGAMOS EL ESTADO DE LA RESEÑA */}
                <div className="text-sm text-gray-700 mt-3 space-y-1 w-full">
                  <p><strong>Fecha:</strong> {new Date(selectedReview.publication.publicationDate).toLocaleDateString("es-CL")}</p>

                  {/* NUEVO: ESTADO */}
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

              {/* REVIEWS */}
              <div className="col-span-2 space-y-6">

                {/* Oferente → Estudiante */}
                <div className="border rounded-lg p-4 relative">
                  <button
                    onClick={async () => {
                      const ok = await deleteReviewPart(
                        selectedReview.review.idReview,
                        false,
                        true
                      );

                      if (ok) {
                        setSelectedReview({
                          ...selectedReview,
                          review: {
                            ...selectedReview.review,
                            commentForStudent: "",
                          }
                        });
                      }
                    }}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-2xl"
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
                    {selectedReview.review.commentForStudent || "Sin reseña"}
                  </p>
                </div>

                {/* Estudiante → Oferente */}
                <div className="border rounded-lg p-4 relative">
                  <button
                    onClick={async () => {
                      const ok = await deleteReviewPart(
                        selectedReview.review.idReview,
                        true,
                        false
                      );

                      if (ok) {
                        setSelectedReview({
                          ...selectedReview,
                          review: {
                            ...selectedReview.review,
                            commentForOfferor: "",
                          }
                        });
                      }
                    }}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-2xl"
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
                    {selectedReview.review.commentForOfferor || "Sin reseña"}
                  </p>
                </div>

                {/* CHECKBOXES */}
                <div className="text-sm text-gray-800 space-y-4 mt-4">
                 <label className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center 
                      ${selectedReview.review.atTime
                        ? "bg-purple-700 border-purple-800"
                        : "bg-white border-gray-400"}
                    `}
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
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center 
                      ${selectedReview.review.goodPresentation
                        ? "bg-purple-700 border-purple-800"
                        : "bg-white border-gray-400"}
                    `}
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

          </div>
        </div>
      )}
    </div>
  );
}
