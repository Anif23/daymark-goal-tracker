
export const getErrorMessage = (error) => {
  if (!error) return "";

  if (error.response?.data) {
    const data = error.response.data;
    
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.error) return typeof data.error === 'string' ? data.error : data.error.message;
  }

  return error.message || "An unexpected error occurred. Please try again.";
};
