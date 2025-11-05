// services/adapters/adapters.ts
import { Offer } from "@/components/offers/OfferCard";
import { OfferBasicDto, BuySellBasicDto } from "@/services/dtos/dto";
import { OfferForAdmin } from "@/types/admin-publications";
import { PendingOffersForAdminDto, OfferDetailForAdminDto, BuySellDetailForAdminDto } from "@/services/dtos/adminDto";
import { AdminDetail, PublicationType } from "@/types/admin-publications";

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

function normalizeOfferType(typeValue: any): PublicationType {
    if (typeof typeValue === 'number') {
        if (typeValue === 0) return "Trabajo"; 
        if (typeValue === 1) return "Voluntariado"; 
    }
    if (typeValue === "Trabajo") return "Trabajo";
    if (typeValue === "Voluntariado") return "Voluntariado";
    return "CompraVenta";
}

function toOfferTypeForAdmin(o: PendingOffersForAdminDto): OfferForAdmin["type"] {
    // Asumimos que el campo que tiene el enum numérico es 'type' (minúscula)
    // Usamos el operador '?? 0' para tratar de forma segura si el campo es nulo.
    const typeValue = (o.type ?? 0); 
    
    if (typeValue === 0 || typeValue === 1) { 
        return "Trabajo"; 
    }
    return "Trabajo"; // Fallback
}

export function mapOfferDtoToValidate(o: PendingOffersForAdminDto): OfferForAdmin {
    return {
        id: String(o.id), // Asegurado que el ID numérico es convertido a string
        title: o.title, 
        // 🚨 CORRECCIÓN 2: Le pasamos el DTO completo (o) a la función conversora
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

function getAdminDetailType(typeValue: any): PublicationType {
    // Si el valor es una cadena, la usamos directamente si es válida
    if (typeof typeValue === 'string') {
        if (typeValue === "Trabajo" || typeValue === "Voluntariado" || typeValue === "CompraVenta") return typeValue as PublicationType;
    }
    // Si es un número (como viene del DTO)
    if (typeof typeValue === 'number') {
        if (typeValue === 0) return "Trabajo"; // Ofertacompany, Ofertaindividual
        if (typeValue === 1) return "Voluntariado"; // Voluntariado
        // Si tienes otro tipo numérico para CompraVenta, agrégalo aquí.
    }
    // Fallback si no se reconoce nada
    return "Trabajo"; // 🚨 Cambiamos el fallback de CompraVenta a Trabajo
}


export function mapOfferDtoToDetail(dto: any): AdminDetail {
    // Aplicamos DOBLE FALLBACK: PascalCase (DTO) ?? camelCase (API) ?? Valor por defecto
    const idValue = (dto as OfferDetailForAdminDto).Id ?? dto.id;
    const titleValue = (dto as OfferDetailForAdminDto).Title ?? dto.title ?? "Sin título";
    const descriptionValue = (dto as OfferDetailForAdminDto).Description ?? dto.description ?? "No hay descripción disponible.";
    const companyNameValue = (dto as OfferDetailForAdminDto).CompanyName ?? dto.companyName ?? "Empresa Desconocida";
    
    // 🚨 CORRECCIÓN REMUNERACIÓN (2): Limpiamos la cadena antes de parseFloat.
    const remunerationRaw = (dto as OfferDetailForAdminDto).Remuneration ?? dto.remuneration ?? 0;
    // Elimina signos, comas y puntos (excepto el punto decimal si existe) y asegura que es un string.
    const cleanRemuneration = String(remunerationRaw).replace(/[^\d.]/g, ''); 
    const remunerationValue = parseFloat(cleanRemuneration) || 0; 
    
    // Fechas e imágenes
    const publicationDateValue = (dto as OfferDetailForAdminDto).PublicationDate ?? dto.publicationDate;
    const statusValidationValue = (dto as OfferDetailForAdminDto).StatusValidation ?? dto.statusValidation ?? 'Pending';
    const activeValue = (dto as OfferDetailForAdminDto).Active ?? dto.active ?? false;
    const imagesValue = (dto as OfferDetailForAdminDto).Images ?? dto.images ?? [];
    const typeValue = (dto as OfferDetailForAdminDto).Type ?? dto.type;

    // 🚨 CORRECCIÓN 3: Nuevos campos de fecha
    const deadlineDateValue = (dto as any).DeadlineDate ?? dto.deadlineDate; // Fecha de inicio (si la API la llama así)
    const endDateValue = (dto as any).EndDate ?? dto.endDate; // Fecha de término (si la API la llama así)
    
    return {
        id: String(idValue),
        title: titleValue, 
        description: descriptionValue, 
        companyName: companyNameValue, 
        publicationDate: publicationDateValue,
        remuneration: remunerationValue, 
        type: getAdminDetailType(typeValue), 
        statusValidation: statusValidationValue, 
        active: activeValue,
        images: imagesValue,
        price: undefined,
        // 🚨 Mapear los nuevos campos
        deadlineDate: deadlineDateValue,
        endDate: endDateValue,
    };
}

export function mapBuySellDtoToDetail(dto: any): AdminDetail {
    // (Sin cambios, solo para completar el archivo)
    const idValue = (dto as BuySellDetailForAdminDto).Id ?? dto.id;
    const titleValue = (dto as BuySellDetailForAdminDto).Title ?? dto.title ?? "Sin título";
    const descriptionValue = (dto as BuySellDetailForAdminDto).Description ?? dto.description ?? "No hay descripción disponible.";
    const userNameValue = (dto as BuySellDetailForAdminDto).UserName ?? dto.userName ?? "Usuario UCN";
    const publicationDateValue = (dto as BuySellDetailForAdminDto).PublicationDate ?? dto.publicationDate ?? undefined;
    const priceValue = (dto as BuySellDetailForAdminDto).Price ?? dto.price ?? undefined;

    return {
        id: `bs-${String(idValue)}`,
        title: titleValue,
        description: descriptionValue,
        companyName: userNameValue,
        publicationDate: publicationDateValue,
        price: priceValue,
        type: "CompraVenta", 
        remuneration: undefined, 
    };
}