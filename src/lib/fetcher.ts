export const fetcher = <T>(url: string): Promise<T> =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });

// For external APIs where we want to handle errors gracefully
export const externalFetcher = <T>(url: string): Promise<T> =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });
