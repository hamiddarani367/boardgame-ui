export interface UserProfile {
  id?: number;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  permissions?: string[];
}

export interface UpdateUserProfileBody {
  first_name?: string;
  last_name?: string;
  email?: string;
}