export const fetcher = <T>(url: string): Promise<T> =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });

// For external APIs with Next.js data cache (1 hour default revalidation)
export const externalFetcher = <T>(url: string, revalidate: number = 3600): Promise<T> =>
  fetch(url, { next: { revalidate } }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });
