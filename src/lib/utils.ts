import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

import { 
    OfferForAdmin, 
    PendingOffersForAdmin, 
    BuySellBasic 
} from "@/models/responses/publication";

function toOfferTypeForAdmin(o: PendingOffersForAdmin): OfferForAdmin["type"] {
    const typeValue = (o.type ?? 0); 
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
            className: "bg-purple-100 text-purple-800 hover:bg-purple-200" 
        };
    }
    return {
        text: "Oferta de Trabajo",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200"
    };
}

export function isTokenExpired(
  token: { customExp?: number } | null | undefined
): boolean {
  if (!token || !token.customExp) return true;
  const now = Math.floor(Date.now() / 1000);
  return token.customExp < now;
}

export function getPublicRouteFromAdmin(adminPath: string): string {
  if (adminPath === "/admin/publications/validate" || adminPath === "/admin/publications/manage") {
    return "/offers";
  }
  return "/";
}