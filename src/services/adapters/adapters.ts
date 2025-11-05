// services/adapters/adapters.ts
import { Offer } from "@/components/offers/OfferCard";
import { OfferBasicDto, BuySellBasicDto } from "@/services/dtos/dto";
import { OfferForAdmin } from "@/types/admin-publications";
import { PendingOffersForAdminDto, OfferDetailForAdminDto } from "@/services/dtos/adminDto";
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
    if (typeof typeValue === 'number') {
        if (typeValue === 0) return "Trabajo";
        if (typeValue === 1) return "Voluntariado";
    }
    if (typeValue === "Trabajo") return "Trabajo";
    if (typeValue === "Voluntariado") return "Voluntariado";
    return "CompraVenta";
}

export function mapOfferDtoToDetail(dto: any): AdminDetail {
    // Usamos 'any' aquí temporalmente para permitir el acceso a .Title y .title
    
    // 🚨 CORRECCIÓN 2 (CAPITALIZACIÓN): Aplicamos DOBLE FALLBACK: PascalCase (DTO) ?? camelCase (API) ?? Valor por defecto
    const idValue = (dto as OfferDetailForAdminDto).Id ?? dto.id;
    const titleValue = (dto as OfferDetailForAdminDto).Title ?? dto.title ?? "Sin título";
    const descriptionValue = (dto as OfferDetailForAdminDto).Description ?? dto.description ?? "No hay descripción disponible.";
    const companyNameValue = (dto as OfferDetailForAdminDto).CompanyName ?? dto.companyName ?? "Empresa Desconocida";
    
    // Remuneration: buscamos PascalCase, luego camelCase, luego 0.
    const remunerationRaw = (dto as any).Remuneration ?? dto.remuneration ?? 0;
    // 🚨 CORRECCIÓN: Usar parseFloat para convertir el string a número.
    const remunerationValue = parseFloat(String(remunerationRaw)) || 0;

    // Fechas y otros campos con el mismo doble fallback.
    const publicationDateValue = (dto as OfferDetailForAdminDto).PublicationDate ?? dto.publicationDate;
    const statusValidationValue = (dto as OfferDetailForAdminDto).StatusValidation ?? dto.statusValidation ?? 'Pending';
    const activeValue = (dto as OfferDetailForAdminDto).Active ?? dto.active ?? false;
    const imagesValue = (dto as OfferDetailForAdminDto).Images ?? dto.images ?? [];
    const typeValue = (dto as OfferDetailForAdminDto).Type ?? dto.type;
    
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
    };
}

/* 
export function mapBuySellDtoToDetail(dto: any): AdminDetail {
    const titleValue = dto.Title ?? dto.title ?? "Sin título";
    const descriptionValue = dto.Description ?? dto.description ?? "No hay descripción disponible.";
    const userNameValue = dto.UserName ?? dto.userName ?? "Usuario UCN";
    const publicationDateValue = dto.PublicationDate ?? dto.publicationDate ?? undefined;
    const priceValue = dto.Price ?? dto.price ?? undefined;

    return {
        id: `bs-${String(dto.id ?? dto.Id)}`,
        title: titleValue,
        description: descriptionValue,
        companyName: userNameValue,
        publicationDate: publicationDateValue,
        price: priceValue,
        type: "CompraVenta", 
        remuneration: undefined, 
    };
}
*/