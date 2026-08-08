export interface UserProfile {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
}

export async function getUserProfile(): Promise<UserProfile> {
  return {
    firstName: "علی",
    lastName: "محمدی",
    mobile: "۰۹۱۲۳۴۵۶۷۸۹",
    email: "ali@example.com",
  };
}

export async function updateUserProfile(data: UserProfile): Promise<void> {
  console.log("بروزرسانی پروفایل:", data);
}