export const getErrorMessage = (error, defaultMessage = "An error occurred.") => {
  if (error.response && error.response.data) {
    const errorData = error.response.data;
    // Handle generic DRF 'detail' error
    if (errorData.detail) {
      return errorData.detail;
    }
    // Handle field validation errors (returns object with arrays of strings)
    const messages = Object.values(errorData).flat();
    if (messages.length > 0) {
      return messages[0];
    }
  }
  return defaultMessage;
};