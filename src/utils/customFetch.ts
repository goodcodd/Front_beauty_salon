const customFetch = async (url: string, options: RequestInit = {}) => {
  const mergedOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: 'Bearer ' + process.env.API_TOKEN,
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(process.env.API_URL + url, mergedOptions);

  if (response.ok && response.status === 204) {
    return { data: true };
  }

  return await response.json();
};

export default customFetch;
