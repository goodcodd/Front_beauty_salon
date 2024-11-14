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

  return await response.json();
};

export default customFetch;
