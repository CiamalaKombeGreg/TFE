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

// Holidays
export interface Holiday {
  absId: string;
  commentaire: string;
  createAt: string;
  endDate: string;
  startDate: string;
  status: string;
  title: string;
  typeId: string;
  updateAt: string;
}