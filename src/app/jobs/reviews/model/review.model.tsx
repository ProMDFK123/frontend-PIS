type ReviewDTO = {
  idReview: number;                     // identificador
  ratingForStudent?: number | null;
  commentForStudent?: string | null;
  ratingForOfferor?: number | null;
  commentForOfferor?: string | null;
  atTime: boolean;
  goodPresentation: boolean;
  reviewWindowEndDate: string;          // ISO string (ej: "2025-11-04T21:00:00Z")
  idStudent: number;
  idOfferor: number;
  idPublication: number;                // required
  hasReviewForOfferorBeenDeleted: boolean;
  hasReviewForStudentBeenDeleted: boolean;
}
