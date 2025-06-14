export const fetchWithAuth = (url: string, options: RequestInit = {}) =>{
    const token = localStorage.getItem('token');

    const hasBody = options.body !== undefined && options.body !== null;

    const headers ={
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        ...(hasBody ? {'Content-Type': 'application/json'} : {}),
    };
    return fetch(url, {
        ...options,
        headers,
    });
};