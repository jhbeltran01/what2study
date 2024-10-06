const getCsrfToken = () => {
  const input = document.getElementById('csrf-token-412');
  
  if (!input) {
    console.error('CSRF token element not found!');
    return null; // or return a default value like '' if needed
  }

  return input.value;
}

export default getCsrfToken