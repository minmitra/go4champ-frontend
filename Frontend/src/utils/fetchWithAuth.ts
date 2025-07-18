export const fetchWithAuth = (url: string, options: RequestInit = {}) => {
   const token = localStorage.getItem('token');
   const hasBody = options.body !== undefined && options.body !== null;
   const headers = {
     ...(options.headers || {}),
     ...(token ? { Authorization: `Bearer ${token}` } : {}),
     ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
   };

   const body =
     hasBody && typeof options.body !== 'string'
       ? JSON.stringify(options.body)
       : options.body;

   return fetch(url, {
     ...options,
     headers,
     body,
    });
 };