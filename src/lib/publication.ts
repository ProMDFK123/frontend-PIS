import {
  OfferForAdmin,
  PendingOffersForAdmin,
  BuySellBasic,
  AdminDetail,
  OfferDetailForAdmin,
  BuySellDetailForAdmin,
  PublicationType
} from "@/models/responses";

function toOfferTypeForAdmin(o: PendingOffersForAdmin): OfferForAdmin["type"] {
  const typeValue = o.type ?? 0;
  if (typeValue === 0 || typeValue === 1) {
    return "Trabajo";
  }
  return "Trabajo";
}

export function mapOfferDtoToValidate(o: PendingOffersForAdmin): OfferForAdmin {
  return {
    id: String(o.id),
    title: o.title,
    type: toOfferTypeForAdmin(o),
  };
}

export function mapBuySellDtoToValidate(b: BuySellBasic): OfferForAdmin {
  return {
    id: `bs-${String(b.id)}`,
    title: b.title,
    type: "CompraVenta",
  };
}

export function getOfferTypeDisplay(type: OfferForAdmin["type"]) {
  if (type === "CompraVenta") {
    return {
      text: "Compra y Venta",
      className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    };
  }
  return {
    text: "Oferta de Trabajo",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  };
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
  const idValue = (dto as OfferDetailForAdmin).Id ?? dto.id;
  const titleValue =
    (dto as OfferDetailForAdmin).Title ?? dto.title ?? "Sin título";
  const descriptionValue =
    (dto as OfferDetailForAdmin).Description ??
    dto.description ??
    "No hay descripción disponible.";
  const rawCompanyName =
    (dto as OfferDetailForAdmin).CompanyName ?? dto.companyName;
  const companyNameValue =
    rawCompanyName && rawCompanyName.trim() !== ""
      ? rawCompanyName
      : "Empresa Desconocida";
  const remunerationRaw =
    (dto as OfferDetailForAdmin).Remuneration ?? dto.remuneration ?? 0;
  const cleanRemuneration = String(remunerationRaw).replace(/[^\d.]/g, "");
  const remunerationValue = parseFloat(cleanRemuneration) || 0;
  const publicationDateValue =
    (dto as OfferDetailForAdmin).PublicationDate ?? dto.publicationDate;
  const statusValidationValue =
    (dto as OfferDetailForAdmin).StatusValidation ??
    dto.statusValidation ??
    "Published";
  const activeValue =
    (dto as OfferDetailForAdmin).Active ?? dto.active ?? false;
  const imagesValue =
    (dto as OfferDetailForAdmin).Images ?? dto.images ?? [];
  const typeValue = (dto as OfferDetailForAdmin).Type ?? dto.type;
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
  const idValue = (dto as BuySellDetailForAdmin).Id ?? dto.id;
  const titleValue =
    (dto as BuySellDetailForAdmin).Title ?? dto.title ?? "Sin título";
  const descriptionValue =
    (dto as BuySellDetailForAdmin).Description ??
    dto.description ??
    "No hay descripción disponible.";
  const rawUserName =
    (dto as BuySellDetailForAdmin).UserName ?? dto.userName;
  const userNameValue =
    rawUserName && rawUserName.trim() !== "" ? rawUserName : "Usuario UCN";

  const publicationDateValue =
    (dto as BuySellDetailForAdmin).PublicationDate ??
    dto.publicationDate ??
    undefined;
  const priceValue =
    (dto as BuySellDetailForAdmin).Price ?? dto.price ?? undefined;

  return {
    id: `bs-${String(idValue)}`,
    title: titleValue,
    description: descriptionValue,
    companyName: userNameValue,
    publicationDate: publicationDateValue,
    price: priceValue,
    type: "CompraVenta",
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