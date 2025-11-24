"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface ReviewDTO {
  idReview: number;
  ratingForStudent?: number;
  commentForStudent?: string;
  ratingForOfferor?: number;
  commentForOfferor?: string;
  atTime: boolean;
  goodPresentation: boolean;
  reviewWindowEndDate: string;
  idStudent: number;
  idOfferor: number;
  idPublication: number;
  hasReviewForOfferorBeenDeleted: boolean;
  hasReviewForStudentBeenDeleted: boolean;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // paginación simple: 5 por página
  const pageSize = 5;
  const [page, setPage] = useState(1);

  const paginated = reviews.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No hay token de administrador.");
      setLoading(false);
      return;
    }

    try {
      const claims: any = jwtDecode(token);
      const role =
        claims[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      if (role !== "Admin") {
        setError("No tienes permisos para ver esta sección.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Token inválido.");
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      console.log(token);
      try {
        const res = await axios.get("http://localhost:5185/api/Review/Admin/GetAllReviews", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReviews(res.data);
        console.log("📌 DATOS RECIBIDOS DEL BACK:", res.data);  // <<<<<< AQUI
      } catch (err) {
        console.error(err);
        setError("Error al cargar las reseñas.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando reseñas...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    

    <div className="max-w-3xl mx-auto mt-10 space-y-6 pb-10">
      <h1 className="text-3xl font-bold text-center">Reseñas registradas</h1>

      {/* Tarjetas tipo revista */}
      {paginated.map((review) => (
        <div
          key={review.idReview}
          className="border rounded-xl shadow-sm p-5 flex flex-col gap-2"
        >
          <h2 className="text-xl font-semibold">
            Reseña #{review.idReview}
          </h2>

          <p className="text-sm text-gray-600">
            Finaliza el:{" "}
            {new Date(review.reviewWindowEndDate).toLocaleDateString("es-CL")}
          </p>

          <p>
            <strong>Estudiante:</strong> {review.idStudent}
          </p>
          <p>
            <strong>Oferente:</strong> {review.idOfferor}
          </p>
          <p>
            <strong>Publicación ID:</strong> {review.idPublication}
          </p>

          <p>
            <strong>Calificación al estudiante:</strong>{" "}
            {"★".repeat(review.ratingForStudent ?? 0)}
          </p>

          <p>
            <strong>Calificación al oferente:</strong>{" "}
            {"★".repeat(review.ratingForOfferor ?? 0)}
          </p>

          <p>
            <strong>Comentario del estudiante:</strong>{" "}
            {review.commentForOfferor || "Sin comentario"}
          </p>

          <p>
            <strong>Comentario del oferente:</strong>{" "}
            {review.commentForStudent || "Sin comentario"}
          </p>

          <p>
            <strong>Entrega a tiempo:</strong> {review.atTime ? "Sí" : "No"}
          </p>

          <p>
            <strong>Buena presentación:</strong>{" "}
            {review.goodPresentation ? "Sí" : "No"}
          </p>
        </div>
      ))}

      {/* PAGINACIÓN */}
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
