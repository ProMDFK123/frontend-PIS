import { AxiosInstance } from "axios";

import { axiosInstance } from "public/src/providers";

export abstract class BaseApiService {
    protected readonly baseURL: string;
    protected readonly httpClient: AxiosInstance;

    constructor(baseURL: string, httpClient: AxiosInstance = axiosInstance) {
        this.baseURL = baseURL;
        this.httpClient = httpClient;
    }
}