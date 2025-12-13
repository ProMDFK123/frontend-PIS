import type { OfferDetail, MyBuySell } from "src/models/responses";
import type { PublicationAction } from "../hooks/use-publication-detail-view";

interface Props {
  detail: OfferDetail | MyBuySell;
  isMutating: boolean;
  id: number;
  handleAction: (action: PublicationAction, reason?: string) => void;
  status: number;
}

// ✅ CORRECCIÓN 1: Clases de Tailwind completas
// En lugar de guardar "green", guardamos toda la clase para que Tailwind la detecte.
const getStatusInfo = (status: number) => {
  switch (status) {
    case 0: // Publicada / Activa
      return {
        text: "Publicada",
        classes: "bg-green-100 text-green-800 border-green-200",
      };
    case 1: // En Revisión / Pendiente
      return {
        text: "En proceso",
        classes: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    case 2: // Rechazada
      return {
        text: "Rechazada",
        classes: "bg-red-100 text-red-800 border-red-200",
      };
    case 3: // Finalizada / Cerrada (Ejemplo)
      return {
        text: "Cerrada",
        classes: "bg-gray-100 text-gray-800 border-gray-200",
      };
    default:
      return {
        text: "Desconocido",
        classes: "bg-gray-100 text-gray-600 border-gray-200",
      };
  }
};

export function PublicationActionSection({
  detail,
  isMutating,
  // id, // Si no lo usas aquí, puedes quitarlo de props o dejarlo
  handleAction,
  status,
}: Props) {
  // ✅ CORRECCIÓN 2: Normalización del Status
  // Verificamos si la propiedad se llama 'status' (en listas) o 'statusValidation' (en detalles)
  // Usamos 'as any' o 'in' para evitar errores de TS si las interfaces difieren.
  const numericStatus =
    "status" in detail ? detail.status : (detail as any).statusValidation;

  const statusInfo = getStatusInfo(status);

  return (
    <aside className="sticky top-24 bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Estado y Acciones</h2>

      {/* Badge de Estado */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-600">Estado actual:</span>
        <span
          className={`px-3 py-1 text-sm font-bold rounded-full border ${statusInfo.classes}`}
        >
          {statusInfo.text}
        </span>
      </div>

      {/* Botones de Acción */}
      <div className="pt-4 border-t border-gray-200 space-y-3">
        {status !== 1 && status !== 2 && (
          <button
            onClick={() => handleAction("postulantes")}
            disabled={isMutating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {/* Icono opcional */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {isMutating ? "Cargando..." : "Ver postulantes"}
          </button>
        )}

        {status === 2 && (
          <button
            onClick={() => handleAction("appeal" as any)}
            disabled={isMutating}
            className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50 shadow-sm"
          >
            Apelar
          </button>
        )}

        <button
          // onClick={() => handleAction("delete")}
          disabled={isMutating || numericStatus === 3} // Deshabilitar si ya está cerrada
          className="w-full flex items-center justify-center px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-50 hover:border-red-300 transition disabled:opacity-50"
        >
          {isMutating ? "Procesando..." : "Cerrar Publicación"}
        </button>
      </div>
    </aside>
  );
}
