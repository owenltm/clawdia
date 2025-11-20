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

export type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type UpdatePasswordParams = {
  currentPassword: string;
  newPassword: string;
};

export type CreateRefreshTokenInput = {
  userId: number;
  tokenId: string;
};

export type UpdateRefreshTokenInput = {
  tokenId?: string;
  isRevoked?: boolean;
};

export type ListRefreshTokenParams = {
  userId?: number;
  isRevoked?: boolean;
};
