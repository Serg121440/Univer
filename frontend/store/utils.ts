import { jwtDecode } from 'jwt-decode';

export function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return parseInt(decoded.sub);
  } catch (e) {
    return null;
  }
}
