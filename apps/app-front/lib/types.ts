// Auth Response
interface User {
  email: string;
  familyName: string | null;
  givenName: string | null;
  id: string;
  name: string | null;
  photo: string | null;
}

export interface AuthResponse {
  idToken: string | null;
  scopes: string[];
  serverAuthCode: string | null;
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

// Modal in usersList
export interface UsersListModal {
  id : string;
  pseudo: string;
  roles: string[]
  email: string;
  isOpen: boolean;
  supervisor: {superviseId : string, superviseurId : string}[];
  supervise: {superviseId : string, superviseurId : string}[];
}