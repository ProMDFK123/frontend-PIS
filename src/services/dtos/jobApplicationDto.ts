export interface JobApplicationResponseDto {
  id: number;
  studentName: string;
  studentEmail: string;
  offerTitle: string;
  status: string;
  applicationDate: string;
  curriculumVitae?: string;
  motivationLetter?: string;
}

export interface JobApplicationDetailDto {
  id: number;
  offerTitle: string;
  companyName: string;
  applicationDate: string;
  publicationDate: string;
  endDate?: string;
  remuneration: number;
  description?: string;
  requirements?: string;
  contactInfo?: string;
  status: string;
  statusMessage?: string;
}