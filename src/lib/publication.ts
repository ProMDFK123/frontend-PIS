import { Badge } from '@/components/ui';
import { Offer } from 'src/components/offers/OfferCard';
import {
  OfferForAdmin,
  PendingOffersForAdmin,
  BuySellBasic,
  AdminDetail,
  OfferDetailForAdmin,
  BuySellDetailForAdmin,
  PublicationType,
  PublishedItem,
  ViewAppplicantsForAdmin,
  OfferTypeForAdmin,
  BuySellForAdmin,
} from "@/models/responses";
import { OfferSubType } from '@/models/responses/publication';

export function toOfferTypeForAdmin(o: PendingOffersForAdmin): OfferSubType {
    const typeValue = o.offerType ?? 0;
    if (typeValue === 1) {
        return "Voluntariado";
    }
    return "Oferta de Trabajo";
}

export function mapOfferDtoToValidate(o: PendingOffersForAdmin): OfferForAdmin {
  return {
    id: String(o.id),
    title: o.title,
    offerType: toOfferTypeForAdmin(o),
  };
}

export function mapBuySellDtoToValidate(b: BuySellBasic): BuySellForAdmin {
  return {
    id: `bs-${String(b.id)}`,
    title: b.title,
    type: "Compra/Venta",
  };
}
// funcion exclusiva solo para mapOfferToManage y mapBuySellToManage
function getPublicationTypeFromNumber(typeValue: number): AdminItemType {
    if (typeValue === 0 || typeValue === 1) return "Compra/Venta";
    return "Oferta de Trabajo";
}

export function mapOfferToManage(o: OfferDetailForAdmin): PublishedItem {
    return {
        id: o.id,
        title: o.title,
        type: getPublicationTypeFromNumber(o.type),
        name: o.companyName && o.companyName.trim() !== "" ? o.companyName : "Empresa Desconocida",
        publicationDate: o.publicationDate,
        activa: o.activa ?? false,
    };
}

export function mapBuySellToManage(b: BuySellDetailForAdmin): PublishedItem {
    return {
        id: b.id,
        title: b.title,
        type: getPublicationTypeFromNumber(b.type),
        name: b.userName && b.userName.trim() !== "" ? b.userName : "Empresa Desconocida",
        publicationDate: b.publicationDate,
        activa: b.activa ?? true,
    };
}

type BadgeDisplayType = "Oferta de Trabajo" | "Voluntariado" | "Compra/Venta";

export function getOfferTypeDisplay(type: BadgeDisplayType) {
switch (type) {
    case "Voluntariado":
      return {
        text: "Voluntariado",
        className: "bg-green-100 text-green-800 hover:bg-green-200", 
      };
    case "Compra/Venta":
      return {
        text: "Compra y Venta",
        className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      };
    case "Oferta de Trabajo":
    default:
      return {
        text: "Oferta de Trabajo",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      };
  }
}

function getAdminDetailType(typeValue: any): PublicationType {
  if (typeof typeValue === "string") {
    if (
      typeValue === "Trabajo" ||
      typeValue === "Voluntariado" ||
      typeValue === "CompraVenta"
    )
      return typeValue as PublicationType;
  }
  if (typeof typeValue === "number") {
    if (typeValue === 0) return "Trabajo";
    if (typeValue === 1) return "Voluntariado";
  }
  return "Trabajo";
}

export function mapOfferToDetail(dto: any): AdminDetail {
  const idValue = (dto as OfferDetailForAdmin).id ?? dto.id;
  const titleValue =
    (dto as OfferDetailForAdmin).title ?? dto.title ?? "Sin título";
  const descriptionValue =
    (dto as OfferDetailForAdmin).description ??
    dto.description ??
    "No hay descripción disponible.";
  const rawCompanyName =
    (dto as OfferDetailForAdmin).companyName ?? dto.companyName;
  const companyNameValue =
    rawCompanyName && rawCompanyName.trim() !== ""
      ? rawCompanyName
      : "Empresa Desconocida";
  const remunerationRaw =
    (dto as OfferDetailForAdmin).remuneration ?? dto.remuneration ?? 0;
  const cleanRemuneration = String(remunerationRaw).replace(/[^\d.]/g, "");
  const remunerationValue = parseFloat(cleanRemuneration) || 0;
  const publicationDateValue =
    (dto as OfferDetailForAdmin).publicationDate ?? dto.publicationDate;
  const statusValidationValue =
    (dto as OfferDetailForAdmin).statusValidation ??
    dto.statusValidation ??
    "Published";
  const activeValue =
    (dto as OfferDetailForAdmin).activa ?? dto.active ?? false;
  const imagesValue =
    (dto as OfferDetailForAdmin).images ?? dto.images ?? [];
  const typeValue = (dto as OfferDetailForAdmin).type ?? dto.type;
  const deadlineDateValue = (dto as any).DeadlineDate ?? dto.deadlineDate;
  const endDateValue = (dto as any).EndDate ?? dto.endDate;
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
    deadlineDate: deadlineDateValue,
    endDate: endDateValue,
  };
}

export function mapBuySellToDetail(dto: any): AdminDetail {
  const idValue = (dto as BuySellDetailForAdmin).id ?? dto.id;
  const titleValue =
    (dto as BuySellDetailForAdmin).title ?? dto.title ?? "Sin título";
  const descriptionValue =
    (dto as BuySellDetailForAdmin).description ??
    dto.description ??
    "No hay descripción disponible.";
  const rawUserName =
    (dto as BuySellDetailForAdmin).userName ?? dto.userName;
  const userNameValue =
    rawUserName && rawUserName.trim() !== "" ? rawUserName : "Usuario UCN";

  const publicationDateValue =
    (dto as BuySellDetailForAdmin).publicationDate ??
    dto.publicationDate ??
    undefined;
  const priceValue =
    (dto as BuySellDetailForAdmin).price ?? dto.price ?? undefined;

  return {
    id: `bs-${String(idValue)}`,
    title: titleValue,
    description: descriptionValue,
    companyName: userNameValue,
    publicationDate: publicationDateValue,
    price: priceValue,
    type: "Compra/Venta",
    remuneration: undefined,
    images: [],
    active: false,
    statusValidation: "Published",
  };
}

export function getPublicRouteFromAdmin(adminPath: string): string {
  if (
    adminPath === "/admin/publications/validate" ||
    adminPath === "/admin/publications/manage"
  ) {
    return "/offers";
  }
  return "/";
}

export type AdminItemType = "Oferta de Trabajo" | "Compra/Venta";

export function getAdminItemTypeString(typeValue: number): AdminItemType {
    if (typeValue === 0 || typeValue === 1) {
        return "Compra/Venta";
    }
    return "Oferta de Trabajo";
}

export function mapApplicantToView(dto: ViewAppplicantsForAdmin): ViewAppplicantsForAdmin {
    return {
        id: dto.id,
        applicant: dto.applicant,
        status: dto.status as "Pending" | "Published" | "Rejected",
    };
}