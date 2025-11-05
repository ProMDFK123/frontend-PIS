import api from "@/services/Service";

const API_BASE = "https://localhost:7000"; 

export async function getMyReviews(): Promise<ReviewDTO[]> {
  const { data } = await api.get<ReviewDTO[]>("/review/my-reviews");
  return data;
}




