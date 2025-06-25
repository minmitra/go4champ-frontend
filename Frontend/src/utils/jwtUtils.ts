// src/utils/jwtUtils.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedTokenPayload {
  username: string; // <-- **WICHTIG: Prüfe diesen Schlüssel!**
  // Kann auch 'sub', 'name', 'userId' oder etwas Ähnliches sein,
  // je nachdem, wie dein Backend den Benutzernamen im Token speichert.
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

    // Prüfe, ob das Token abgelaufen ist
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn('getUsernameFromToken: Token ist abgelaufen!');
      return null;
    }

    // **WICHTIG: Prüfe hier den korrekten Schlüssel für den Benutzernamen!**
    // Wenn `decoded.username` undefined ist, liegt es daran, dass dein Token einen anderen Schlüssel verwendet.
    // Du musst den Schlüssel hier anpassen, z.B. `decoded.sub` oder `decoded.name`.
    console.log('getUsernameFromToken: Extracted Username:', decoded.username); // Debug-Ausgabe
    return decoded.username || null; // Oder `decoded.sub` oder `decoded.name`
  } catch (error) {
    console.error('getUsernameFromToken: Fehler beim Dekodieren des Tokens:', error); // Debug-Ausgabe
    return null;
  }
};