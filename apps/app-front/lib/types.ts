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

// Modal in users and their absences fetch
export interface UserRelatedAbsenceProps {
  prsId: string;
  pseudo: string;
  email: string;
  roles: string[];
  conges: {
      absId: string;
      title: string;
      typeId: string;
      startDate: Date;
      endDate: Date;
      createAt: Date;
      updateAt: Date;
      status: string;
      commentaire: string;
      personnelId: string;
  }[];
}