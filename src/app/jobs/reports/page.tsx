"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Offer {
  id: number;
  title: string;
  description?: string;
  companyName?: string;
  ownerName?: string;
  offerType: number;
  rating?: number;
  date: string;
  remuneration?: number;
  location?: string;
  deadlineDate?: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null); // 👈 para el modal

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("http://localhost:5185/api/publications/offers");
        if (!res.ok) throw new Error("Error al obtener ofertas");

        const json = await res.json();
        const allOffers = json.data || [];

        const transformedOffers = allOffers
          .filter((o: any) => o.offerType === 0)
          .map((o: any) => ({
            id: o.id,
            title: o.title,
            description: o.description ?? "Sin descripción",
            companyName: o.companyName ?? "Desconocido",
            ownerName: o.ownerName ?? "Desconocido",
            offerType: o.offerType,
            rating: o.rating ?? 0,
            remuneration: o.remuneration ?? 0,
            location: o.location ?? "Sin ubicación",
            date: new Date(o.publicationDate).toLocaleDateString("es-CL", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            deadlineDate: o.deadlineDate
              ? new Date(o.deadlineDate).toLocaleDateString("es-CL")
              : "No especificada",
          }));

        setOffers(transformedOffers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando ofertas...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <h1 className="text-3xl font-bold text-center">Ofertas activas</h1>

      {offers.length === 0 ? (
        <p className="text-center text-gray-500">No hay ofertas disponibles.</p>
      ) : (
        offers.map((offer) => (
          <Card key={offer.id} className="p-4">
            <CardContent>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">{offer.title}</h2>
                <p className="text-yellow-500 text-sm">
                  {"★".repeat(offer.rating ?? 0)}
                </p>
              </div>

              <p className="text-gray-600 text-sm mt-1">{offer.date}</p>
              <p className="text-gray-600 text-sm mt-1">
                Ubicación: {offer.location}
              </p>

              <p className="mt-3">
                <strong>Oferente:</strong> {offer.companyName}
              </p>
              <p>
                <strong>Responsable:</strong> {offer.ownerName}
              </p>

              <p className="mt-2">
                <strong>Remuneración:</strong>{" "}
                ${offer.remuneration?.toLocaleString("es-CL")}
              </p>

              <Button
                variant="outline"
                className="mt-3 w-full text-purple-700 border-purple-300 hover:bg-purple-50"
                onClick={() => setSelectedOffer(offer)} // 👈 Abre el modal
              >
                Ver detalles
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-white text-gray-900 rounded-xl shadow-lg">
    {selectedOffer && (
      <>
        <DialogHeader>
          <DialogTitle>{selectedOffer.title}</DialogTitle>
          <DialogDescription>
            Publicado el {selectedOffer.date}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2 text-sm">
          <p className="whitespace-pre-line break-words">
            <strong>Descripción:</strong> {selectedOffer.description || "Sin descripción disponible"}
          </p>
          <p><strong>Ubicación:</strong> {selectedOffer.location}</p>
          <p><strong>Remuneración:</strong> ${selectedOffer.remuneration?.toLocaleString("es-CL")}</p>
          <p><strong>Fecha límite:</strong> {selectedOffer.deadlineDate}</p>
          <p><strong>Oferente:</strong> {selectedOffer.companyName}</p>
          <p><strong>Responsable:</strong> {selectedOffer.ownerName}</p>
          <p><strong>Valoración:</strong> {"★".repeat(selectedOffer.rating ?? 0)}</p>
        </div>
      </>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
}
