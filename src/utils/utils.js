export function formatErrorResponse(error) {
  // If error has response data, return it (backend error format)
  if (error.response && error.response.data) {
    return error.response.data;
  }
  // Otherwise return generic error
  return {
    detail: error.message || `${error}`,
  };
}