// Auth Response
interface User {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photo: string;
}

export interface AuthResponse {
  idToken: string;
  scopes: string[];
  serverAuthCode: string;
  user: User;
}