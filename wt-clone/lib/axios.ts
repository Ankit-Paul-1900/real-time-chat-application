import axios from "axios";

console.log(process.env.NEXT_PUBLIC_BASEURL);

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASEURL,
    withCredentials: true,
});

const refreshApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASEURL,
    withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Only handle 401
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Don't refresh these endpoints
        const skipRefresh = [
            "/user/login",
            "/user/register",
            "/user/auth/refresh",
        ];

        const shouldSkipRefresh = skipRefresh.some((url) =>
            originalRequest?.url?.includes(url)
        );

        if (shouldSkipRefresh) {
            return Promise.reject(error);
        }

        // Don't retry the same request twice
        if (originalRequest?._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {

            // If another request is already refreshing,
            // wait for that same refresh request.
            if (!isRefreshing) {

                isRefreshing = true;
                console.log("Refreh token used!!!")
                refreshPromise = refreshApi.post(
                    "/user/auth/refresh"
                );
            }

            await refreshPromise;

            // Refresh completed successfully.
            // Browser now has the new accessToken cookie.

            return api(originalRequest);

        } catch (refreshError) {

            console.error(
                "Refresh token failed:",
                refreshError
            );

            // Refresh token is invalid/expired
            window.location.href = "/login";

            return Promise.reject(refreshError);

        } finally {

            // Only the refresh operation should reset this state
            isRefreshing = false;
            refreshPromise = null;
        }
    }
);

export default api;