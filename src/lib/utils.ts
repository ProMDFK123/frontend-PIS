import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
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

export function thousandSeparatorPipe(num: number): string {
  return num
    .toFixed(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatDate(date: string): string {
  const parsedDate = new Date(date);
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
}

export const isValidId = (id: string): boolean => {
  return /^[1-9]\d*$/.test(id);
};

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export function getRoleFromToken() {
  const token = Cookies.get("token");
  if (!token) return null;
  try {
    const decodedToken: any = jwtDecode(token);
    const userRole = decodedToken[ROLE_CLAIM]; 
    return typeof userRole === 'string' ? userRole.trim() : null;
  } catch (e) {
    return null;
  }
}