// services/adapters/adapters.ts
import { Offer } from "@/components/offers/OfferCard";
import { OfferBasicDto, BuySellBasicDto } from "@/services/dtos/dto";
import { OfferForAdmin } from "@/types/admin-publications";
import { PendingOffersForAdminDto } from "@/services/dtos/adminDto";

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

function toOfferTypeForAdmin(dto: PendingOffersForAdminDto): OfferForAdmin["type"] {
    // Usamos el campo 'type' (minúscula) y verificamos el número
    if (dto.type === 0 || dto.type === 1) { 
        return "Trabajo"; 
    }
    return "Trabajo"; // Fallback seguro
}

// 🚨 Corrección: mapOfferDtoToValidate debe aceptar el nuevo DTO
export function mapOfferDtoToValidate(o: PendingOffersForAdminDto): OfferForAdmin {
    return {
        id: String(o.id), // Asumimos que el ID fue incluido en el DTO de lectura
        title: o.title, 
        // 🚨 Usar el DTO completo como argumento
        type: toOfferTypeForAdmin(o), 
    };
}

export function mapBuySellDtoToValidate(b: BuySellBasicDto): OfferForAdmin {
    return {
        id: `bs-${String(b.id)}`, 
        title: b.title, 
        type: "CompraVenta", 
    };
}