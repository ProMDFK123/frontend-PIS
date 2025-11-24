"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface PublicationReviewDTO {
  idPublication: number;
  title: string;
  idReview: number;
  ratingForStudent?: number;
  ratingForOfferor?: number;
  commentForStudent?: string;
  commentForOfferor?: string;
  reviewWindowEndDate: string;
  idStudent: number;
  idOfferor: number;
  atTime: boolean;
  goodPresentation: boolean;
}

export default function UserReviewHistoryPage() {
  const [reviews, setReviews] = useState<PublicationReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 5;
  const [page, setPage] = useState(1);

  const paginated = reviews.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setError("Debes iniciar sesión.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5185/api/Review/publications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReviews(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar tus reseñas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando reseñas...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6 pb-10">
      <h1 className="text-3xl font-bold text-center">
        Historial de reseñas
      </h1>

      {paginated.map((review) => {
        const fecha = new Date(review.reviewWindowEndDate).toLocaleDateString(
          "es-CL",
          { day: "2-digit", month: "short", year: "numeric" }
        );

        const estrellasEstudiante =
          "★".repeat(review.ratingForStudent ?? 0) || "Sin calificar";

        const estrellasOferente =
          "★".repeat(review.ratingForOfferor ?? 0) || "Sin calificar";

        return (
          <div
            key={review.idReview}
            className="border rounded-xl shadow-sm p-5 bg-white flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {review.title}
              </h2>

              {/* Estrellas según rol */}
              <span className="text-purple-600 font-semibold">
                {estrellasEstudiante}
              </span>
            </div>

            <p className="text-sm text-gray-500">{fecha}</p>

            {/* Info */}
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Estudiante:</span>{" "}
                #{review.idStudent}
              </p>
              <p>
                <span className="font-medium">Oferente:</span>{" "}
                #{review.idOfferor}
              </p>
            </div>

            {/* Calificaciones */}
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Puntaje recibido:</span>{" "}
                <span className="text-purple-600 font-semibold">
                  {estrellasEstudiante}
                </span>
              </p>

              <p className="text-sm">
                <span className="font-medium">Puntaje otorgado:</span>{" "}
                <span className="text-purple-600 font-semibold">
                  {estrellasOferente}
                </span>
              </p>
            </div>

            {/* Button */}
            <button className="mt-2 w-full text-center text-sm font-medium border border-purple-400 text-purple-700 rounded-lg py-2 hover:bg-purple-50 transition">
              Ver detalles
            </button>
          </div>
        );
      })}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          className="px-4 py-2 rounded-md border hover:bg-gray-100"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ← Anterior
        </button>

        <button
          className="px-4 py-2 rounded-md border hover:bg-gray-100"
          disabled={page * pageSize >= reviews.length}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
