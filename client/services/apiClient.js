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
        return await response.json();
    }
//taking the error from the response and throwing it as an ApiError
    const errorData = await response.json().catch(() => ({}));
    const serverError = errorData.error || {};
    const message = serverError.message || `שגיאת תקשורת מול השרת (${response.status})`;
    const type = serverError.type || 'server_error';
    throw new ApiError(message, response.status, type);
}
export {ApiError,handleResponse};