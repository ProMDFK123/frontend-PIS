import type { OfferDetail } from "src/models/generics";

interface Props {
  detail: OfferDetail;
 // isMutating: boolean;
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-base text-gray-900">{value || "No especificado"}</dd>
  </div>
);

export function PublicationDetailSection({ detail }: Props) {
  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
      <div className="mb-4 overflow-hidden rounded-md max-h-96">
        <img
          src={ "/generic.png"} //detail.imagesUrl?.[0] ||
          alt={detail.title}
          className="w-full object-cover h-64 md:h-96"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">
          Detalles de la Publicación
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {detail.description}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-xl font-bold text-indigo-600 mb-3">
          Información Adicional
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
          <DetailItem label="Remuneración" value={`$${detail.remuneration?.toLocaleString("es-CL")}`} />
          <DetailItem label="Ubicación" value={detail.location} />
          <DetailItem label="Publicador" value={detail.companyName} />
          <DetailItem label="Fecha de Término" value={detail.endDate}/>
          <DetailItem label="Descripción" value={detail.description} />
          <DetailItem label="Fecha de publicación" value={detail.postDate} />
        </dl>
      </div>
      { true  && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xl font-bold text-indigo-600 mb-3">Requisitos</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {"hola"}
          </p>
        </div>
      )}
    </section>
  );
}