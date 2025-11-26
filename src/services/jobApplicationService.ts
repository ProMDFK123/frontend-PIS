import axios from "axios";

const API_URL = "http://localhost:5185/api/job-applications";

export const jobApplicationsService = {
    getMyOfferApplications: async (token: string) => {
        const res = await axios.get(`${API_URL}/my-offers-applications`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data.data;
    },

    updateStatus: async (applicationId: number, newStatus: string, token: string) => {
        const res = await axios.patch(
            `${API_URL}/${applicationId}/status`,
            { newStatus },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    }
};
