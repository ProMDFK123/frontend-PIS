// services/adapters/adapters.ts
import { Offer } from "@/components/offers/OfferCard";
import { OfferBasicDto, BuySellBasicDto } from "@/services/dtos/dto";

function toOfferType(t: OfferBasicDto["offerType"]): Offer["type"] {
  if (t === "Voluntariado" || t === 1) return "Voluntariado";
  return "Trabajo";
}

export function mapOfferDtoToCard(o: OfferBasicDto): Offer {
  return {
    id: String(o.id),
    title: o.title,
    type: toOfferType(o.offerType),
    image: "/generic.png",
    deadline: o.deadlineDate,
    stipend: typeof o.remuneration === "number" ? o.remuneration : 0,
    postedAt: o.publicationDate ?? new Date().toISOString(),
    owner: o.ownerName ?? "UCN",
  };
}

export function mapBuySellDtoToCard(b: BuySellBasicDto): Offer {
  return {
    id: `bs-${b.id}`,
    title: b.title,
    type: "CompraVenta",
    image: "/generic.png",
    // compra/venta no tiene deadline ni duration
    stipend: b.price,
    postedAt: b.publicationDate ?? new Date().toISOString(),
    owner: b.userName ?? "UCN",
  };
}