import type { OfferDetail } from "src/models/generics";
import type { PublicationAction } from "../hooks/use-publication-detail-view";

interface Props {
  detail: OfferDetail;
  isMutating: boolean;
  handleAction: (action: PublicationAction, reason?: string) => void;
}

const getStatusInfo = (status: number) => {
    const statuses = {
        0: { text: "Publicada", color: "green" },
        1: { text: "En Revisión", color: "yellow" },
        2: { text: "Rechazada", color: "red" },
    };
    return statuses[status as keyof typeof statuses] || { text: "Desconocido", color: "gray" };
};

export function PublicationActionSection({ detail, isMutating, 
 handleAction 
}: Props) {
  const statusInfo = getStatusInfo(0);

  return (
    <aside className="sticky top-24 bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Estado y Acciones</h2>

      <div className="flex items-center gap-3">
        <span className="font-semibold">Estado:</span>
        { <span className={`px-3 py-1 text-sm font-medium rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
          {statusInfo.text}
        </span> }
      </div>

      <div className="pt-4 border-t border-gray-200 space-y-3">
        <button
         onClick={() => handleAction("postulantes")}
          disabled={isMutating}
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isMutating ? "Procesando..." : "Ver postulantes"}
        </button>
        <button
  //        onClick={() => handleAction("delete")}
          disabled={isMutating}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
        >
          {isMutating ? "Procesando..." : "Cerrar Publicación"}
        </button>
      </div>
    </aside>
  );
}