export default async (requestJson, apiUrl) => {

  if (!apiUrl) {
    apiUrl = 'https://api.prod.agenarisk.com/public/calculate';
  }

  const initialResponse = await submitJob(requestJson, apiUrl);

  if (initialResponse == null) {
    // Error
    return null;
  }

  if (initialResponse.status && (initialResponse.status === 'success' || initialResponse.status === 'failure')){
    // Check if the job was resolved on submission
    return initialResponse;
  }

  if (!initialResponse.pollingUrl) {
    // Rejected, no polling URL
    return initialResponse;
  }

  while(true){
    let pollResponse = await pollResult(initialResponse.pollingUrl, 5000);
    if (pollResponse == null){
      return null;
    }
    if (pollResponse.status && (pollResponse.status === 'success' || pollResponse.status === 'failure')){
      return pollResponse;
    }
  }
};

function submitJob(request, url) {
  console.log('Submitting job to: ' + url);
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'text/plain; charset=utf-8',
    },
    body: JSON.stringify(request),
  })
    .then(response => response.json())
    .catch(function (error) {
      alert('Error: ' + error)
      return null;
    });
}

function pollResult(url, delay) {
  console.log('Checking job status at: ' + url);
  return sleep(delay).then(v => fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'text/plain; charset=utf-8',
    },
    body: '{"auth":"whatever"}',
  })
    .then(response => response.json())
    .catch(function (error) {
      alert('Error: ' + error)
      return null;
    }));
}

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}