// services/adapters/adapters.ts
import { Offer } from "public/src/components/offers/OfferCard";
import { OfferBasicDto, BuySellBasicDto } from "public/src/services/dtos/dto";
import { OfferForAdmin } from "public/src/types/admin-publications";
import { PendingOffersForAdminDto, OfferDetailForAdminDto, BuySellDetailForAdminDto } from "public/src/services/dtos/adminDto";
import { AdminDetail, PublicationType } from "public/src/types/admin-publications";

function toOfferType(t: OfferBasicDto["offerType"]): Offer["type"] {
  if (t === "Voluntariado" || t === 1) return "Voluntariado";
  return "Trabajo";
}

export function mapOfferDtoToCard(o: OfferBasicDto): Offer {
    // Remuneración robusta (manteniendo corrección anterior)
    const remunerationRaw = o.remuneration ?? 0;
    const cleanRemuneration = String(remunerationRaw).replace(/[^\d.]/g, ''); 
    const stipendValue = parseFloat(cleanRemuneration) || 0; 

    // 🚨 CORRECCIÓN USUARIO (Tarjeta Oferta): Comprobamos que ownerName no sea null, undefined, ni una cadena vacía.
    const ownerName = o.ownerName && o.ownerName.trim() !== "" ? o.ownerName : "UCN";
    
  return {
    id: String(o.id),
    title: o.title,
    type: toOfferType(o.offerType),
    image: "/generic.png",
    deadline: o.deadlineDate,
    stipend: stipendValue, 
    postedAt: o.publicationDate ?? new Date().toISOString(),
    owner: ownerName, // Aplicando el nombre de propietario corregido
  };
}

export function mapBuySellDtoToCard(b: BuySellBasicDto): Offer {
    // 🚨 CORRECCIÓN USUARIO (Tarjeta BuySell): Comprobamos que userName no sea null, undefined, ni una cadena vacía.
    const userName = b.userName && b.userName.trim() !== "" ? b.userName : "UCN";

  return {
    id: `bs-${b.id}`,
    title: b.title,
    type: "CompraVenta",
    image: "/generic.png",
    // compra/venta no tiene deadline ni duration
    stipend: b.price,
    postedAt: b.publicationDate ?? new Date().toISOString(),
    owner: userName, // Aplicando el nombre de usuario corregido
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
    const typeValue = (o.type ?? 0); 
    
    if (typeValue === 0 || typeValue === 1) { 
        return "Trabajo"; 
    }
    return "Trabajo"; // Fallback
}

export function mapOfferDtoToValidate(o: PendingOffersForAdminDto): OfferForAdmin {
    return {
        id: String(o.id), 
        title: o.title, 
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
    if (typeof typeValue === 'string') {
        if (typeValue === "Trabajo" || typeValue === "Voluntariado" || typeValue === "CompraVenta") return typeValue as PublicationType;
    }
    if (typeof typeValue === 'number') {
        if (typeValue === 0) return "Trabajo";
        if (typeValue === 1) return "Voluntariado";
    }
    return "Trabajo"; 
}


export function mapOfferDtoToDetail(dto: any): AdminDetail {
    const idValue = (dto as OfferDetailForAdminDto).Id ?? dto.id;
    const titleValue = (dto as OfferDetailForAdminDto).Title ?? dto.title ?? "Sin título";
    const descriptionValue = (dto as OfferDetailForAdminDto).Description ?? dto.description ?? "No hay descripción disponible.";
    
    // 🚨 CORRECCIÓN USUARIO (Detalle Oferta): Aseguramos CompanyName
    const rawCompanyName = (dto as OfferDetailForAdminDto).CompanyName ?? dto.companyName;
    const companyNameValue = rawCompanyName && rawCompanyName.trim() !== "" ? rawCompanyName : "Empresa Desconocida";
    
    // Remuneración
    const remunerationRaw = (dto as OfferDetailForAdminDto).Remuneration ?? dto.remuneration ?? 0;
    const cleanRemuneration = String(remunerationRaw).replace(/[^\d.]/g, ''); 
    const remunerationValue = parseFloat(cleanRemuneration) || 0; 
    
    // Fechas e imágenes
    const publicationDateValue = (dto as OfferDetailForAdminDto).PublicationDate ?? dto.publicationDate;
    const statusValidationValue = (dto as OfferDetailForAdminDto).StatusValidation ?? dto.statusValidation ?? 'Published'; 
    const activeValue = (dto as OfferDetailForAdminDto).Active ?? dto.active ?? false;
    const imagesValue = (dto as OfferDetailForAdminDto).Images ?? dto.images ?? [];
    const typeValue = (dto as OfferDetailForAdminDto).Type ?? dto.type;
    const deadlineDateValue = (dto as any).DeadlineDate ?? dto.deadlineDate;
    const endDateValue = (dto as any).EndDate ?? dto.endDate;
    
    return {
        id: String(idValue),
        title: titleValue, 
        description: descriptionValue, 
        companyName: companyNameValue, // Aplicando el nombre corregido
        publicationDate: publicationDateValue,
        remuneration: remunerationValue, 
        type: getAdminDetailType(typeValue), 
        statusValidation: statusValidationValue, 
        active: activeValue,
        images: imagesValue,
        price: undefined,
        deadlineDate: deadlineDateValue,
        endDate: endDateValue,
    };
}

export function mapBuySellDtoToDetail(dto: any): AdminDetail {
    const idValue = (dto as BuySellDetailForAdminDto).Id ?? dto.id;
    const titleValue = (dto as BuySellDetailForAdminDto).Title ?? dto.title ?? "Sin título";
    const descriptionValue = (dto as BuySellDetailForAdminDto).Description ?? dto.description ?? "No hay descripción disponible.";
    
    // 🚨 CORRECCIÓN USUARIO (Detalle BuySell): Aseguramos UserName
    const rawUserName = (dto as BuySellDetailForAdminDto).UserName ?? dto.userName;
    const userNameValue = rawUserName && rawUserName.trim() !== "" ? rawUserName : "Usuario UCN";
    
    const publicationDateValue = (dto as BuySellDetailForAdminDto).PublicationDate ?? dto.publicationDate ?? undefined;
    const priceValue = (dto as BuySellDetailForAdminDto).Price ?? dto.price ?? undefined;

    return {
        id: `bs-${String(idValue)}`,
        title: titleValue,
        description: descriptionValue,
        companyName: userNameValue, // Aquí usamos el nombre de usuario
        publicationDate: publicationDateValue,
        price: priceValue,
        type: "CompraVenta", 
        remuneration: undefined, 
    };
}