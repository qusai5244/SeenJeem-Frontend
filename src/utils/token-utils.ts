import { jwtDecode } from 'src/auth/context/jwt/utils';
import { JWT_STORAGE_KEY } from 'src/auth/context/jwt/constant';

// ----------------------------------------------------------------------

export interface DecodedToken {
  token: string | null;
  decoded: any | null;
  isValid: boolean;
  error?: string;
}

/**
 * Get and decode JWT token from localStorage
 * @returns DecodedToken object with token, decoded payload, and validation status
 */
export function getDecodedToken(): DecodedToken {
  try {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    if (!token) {
      return {
        token: null,
        decoded: null,
        isValid: false,
        error: 'No token found in localStorage'
      };
    }
    
    const decoded = jwtDecode(token);
    return {
      token,
      decoded,
      isValid: true
    };
  } catch (error) {
    console.error('Error getting/decoding token:', error);
    return {
      token: null,
      decoded: null,
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get raw token from localStorage without decoding
 * @returns The raw JWT token string or null if not found
 */
export function getToken(): string | null {
  return localStorage.getItem(JWT_STORAGE_KEY);
}

/**
 * Check if token exists and is valid
 * @returns boolean indicating if token exists and is valid
 */
export function isTokenValid(): boolean {
  try {
    const token = getToken();
    if (!token) return false;
    
    const decoded = jwtDecode(token);
    if (!decoded || !('exp' in decoded)) return false;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
}

/**
 * Get specific claim from decoded token
 * @param claim - The claim name to extract (e.g., 'sub', 'email', 'role')
 * @returns The claim value or null if not found
 */
export function getTokenClaim(claim: string): any {
  try {
    const { decoded } = getDecodedToken();
    return decoded?.[claim] || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get user ID from token (assuming 'sub' claim contains user ID)
 * @returns User ID or null if not found
 */
export function getUserId(): string | null {
  return getTokenClaim('sub');
}

/**
 * Get user email from token (assuming 'email' claim exists)
 * @returns User email or null if not found
 */
export function getUserEmail(): string | null {
  return getTokenClaim('email');
}

/**
 * Get user role from token (assuming 'role' claim exists)
 * @returns User role or null if not found
 */
export function getUserRole(): string | null {
  return getTokenClaim('role');
} 