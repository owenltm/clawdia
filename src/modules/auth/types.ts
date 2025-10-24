export type ListAuthParams = Partial<{
  role: string;
  email: string;
}>;

export type CreateUserParams = {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role: string;
};