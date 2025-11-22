import api from "./Service";
import {
  JobApplicationResponseDto,
  JobApplicationDetailDto,
} from "./dtos/jobApplicationDto";

export const jobApplicationService = {
  // Obtener historial de postulaciones del estudiante
  async getStudentApplications(): Promise<JobApplicationResponseDto[]> {
    const response = await api.get<{
      message: string;
      data: JobApplicationResponseDto[];
    }>("/job-applications/my-applications");
    return response.data.data;
  },

  // Obtener detalles de una postulación específica
  async getApplicationDetail(
    applicationId: number
  ): Promise<JobApplicationDetailDto> {
    const response = await api.get<{
      message: string;
      data: JobApplicationDetailDto;
    }>(`/job-applications/${applicationId}/details`);
    return response.data.data;
  },

  // Crear una nueva postulación
  async createApplication(jobOfferId: number) {
    const response = await api.post(`/job-applications/apply/${jobOfferId}`);
    return response.data;
  },
};