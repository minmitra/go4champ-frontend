import { jwtDecode } from 'jwt-decode';

interface DecodedTokenPayload {
  username: string; 
  exp?: number;
  iat?: number;
}

export const getUsernameFromToken = (token: string): string | null => {
  console.log('getUsernameFromToken: Token received:', token ? 'Exists' : 'Does NOT exist'); // Debug-Ausgabe
  if (!token) {
    return null;
  }
  try {
    const decoded: DecodedTokenPayload = jwtDecode(token);
    console.log('getUsernameFromToken: Decoded Token Payload:', decoded); // Debug-Ausgabe

    
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn('getUsernameFromToken: Token ist abgelaufen!');
      return null;
    }

    console.log('getUsernameFromToken: Extracted Username:', decoded.username); // Debug-Ausgabe
    return decoded.username || null;
  } catch (error) {
    console.error('getUsernameFromToken: Fehler beim Dekodieren des Tokens:', error); // Debug-Ausgabe
    return null;
  }
};