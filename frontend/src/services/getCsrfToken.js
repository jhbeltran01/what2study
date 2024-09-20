const getCsrfToken = () => {
  const input = document.getElementById('csrf-token-412');
  
  if (input) {
    return input.value;  // Return the value if the element exists
  } else {
    console.error("CSRF token element not found");
    return '';  // Return an empty string or a fallback value
  }
};

export default getCsrfToken;
