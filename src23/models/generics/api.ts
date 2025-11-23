export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ErrorDetail {
  message: string;
  details?: string;
}

export interface ApiErrorResult extends ErrorDetail {
  canRetry: boolean;
}

export interface JwtClaims {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
}