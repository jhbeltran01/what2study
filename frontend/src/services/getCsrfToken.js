const getCsrfToken = () => {
  const input = document.getElementById('csrf-token-412')
  return input.value 
}

export default getCsrfToken