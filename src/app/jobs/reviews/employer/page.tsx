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

export default function OfferentReviewsPage() {
  const [reviews, setReviews] = useState<CombinedReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<CombinedReviewDTO | null>(null);
  const [showModal, setShowModal] = useState(false);

  const pageSize = 5;
  const [page, setPage] = useState(1);

  const starsOrNone = (score: number) =>
    score > 0 ? "★".repeat(score) : "Sin puntuación";

  const commentOrNone = (text: string | null | undefined) =>
    text && text.trim().length > 0 ? text : "Sin reseña";

  /* ==========================
      FETCH
  ========================== */
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setError("No hay token de autenticación.");
      setLoading(false);
      return;
    }

    try {
      const claims: any = jwtDecode(token);
      const role =
        claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role !== "Applicant" && role !== "Offerent") {
        setError("No tienes permisos para ver reseñas.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Token inválido.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5185/api/Review/my-reviews", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar las reseñas.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando reseñas...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const paginated = reviews.slice((page - 1) * pageSize, page * pageSize);

  /* ==========================
      MODAL
  ========================== */
  const openModal = (item: CombinedReviewDTO) => {
    setSelectedReview(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReview(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6 pb-10">
      <h1 className="text-3xl font-bold text-center">Mis reseñas</h1>

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
                <strong>Calificación que diste:</strong> 
                <span className="text-purple-600"> {starsOrNone(r.ratingForStudent)}</span>
              </p>

              <p>
                <strong>Calificación que recibiste:</strong>
                <span className="text-purple-600"> {starsOrNone(r.ratingForOfferor)}</span>
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

      {/* PAGINACIÓN */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <p className="text-sm text-gray-600">
          Página <strong>{page}</strong> de{" "}
          <strong>{Math.ceil(reviews.length / pageSize)}</strong>
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
            disabled={page * pageSize >= reviews.length}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-5xl rounded-lg shadow-lg p-6 relative">

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Detalles de la evaluación</h2>

            <p><strong>Comentario que recibiste:</strong> {commentOrNone(selectedReview.review.commentForOfferor)}</p>
            <p><strong>Comentario que diste:</strong> {commentOrNone(selectedReview.review.commentForStudent)}</p>

            <p className="mt-4"><strong>¿Llegó a tiempo?</strong> {selectedReview.review.atTime ? "Sí" : "No"}</p>
            <p><strong>¿Buena presentación?</strong> {selectedReview.review.goodPresentation ? "Sí" : "No"}</p>

            <div className="flex justify-end mt-4">
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

    </div>
  );
}
