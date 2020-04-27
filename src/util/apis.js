export default async (input, apiUrl) => {

  if (!apiUrl) {
    apiUrl = 'https://api-prod.online.agenarisk.com/public/calculate';
  }

  const jobSubmission = await submitJob(input, apiUrl);

  if (jobSubmission == null) {
    // Error
    return null;
  }

  if (jobSubmission.status && (jobSubmission.status === 'success' || jobSubmission.status === 'failure')){
    // Check if the job was resolved on submission
    return jobSubmission;
  }

  if (!jobSubmission.pollingUrl) {
    // Rejected, no polling URL
    return jobSubmission;
  }

  return await (pollResult(jobSubmission.pollingUrl));
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

function pollResult(url) {
  console.log('Checking job status at: ' + url);
  return sleep(5000).then(v => fetch(url, {
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