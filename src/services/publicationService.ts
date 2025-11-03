import api from "./Service";

export interface CreatePublicationData {
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  remuneration?: string;
  image?: File;
}

export interface PublicationResponse {
  id: number;
  title: string;
  description: string;
  // Agregar otros campos según la respuesta del backend
}

export const publicationService = {
  async create(data: CreatePublicationData): Promise<PublicationResponse> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    if (data.remuneration) formData.append("remuneration", data.remuneration);
    if (data.image) formData.append("image", data.image);

    const response = await api.post<PublicationResponse>("/api/publications", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
