class ApiError extends Error {
    constructor(message, status, type) {
        super(message);
        this.status = status;
        this.type = type;
        this.name = 'ApiError';
    }
}
const handleResponse = async (response) => {
        if (response.ok) {
        if (response.status === 204) return null; 
        return await response.json();
    }
//taking the error from the response and throwing it as an ApiError
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `שגיאת תקשורת מול השרת (${response.status})`;
    const status = response.status;
    const type = errorData.error?.type || 'server_error';
    throw new ApiError(message, status, type);
}
export {ApiError,handleResponse};