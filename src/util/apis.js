export default (input) => {
  const apiUrl = 'https://api.online.agenarisk.com/public/calculate';
  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'text/plain; charset=utf-8',
    },
    body: JSON.stringify(input),
  })
    .then(response => response.json());
};
