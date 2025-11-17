import { ref } from "process";
import { User, SafeUser } from "./entities/user.entity";
import { RefreshTokenRepository } from "./repositories/refreshToken.repository";
import { UserRepository } from "./repositories/user.repository";
import { ListAuthParams, CreateUserParams } from "./types";
import { hashPassword, comparePassword, getUserAuthToken, getUserRefreshToken, getRandomTokenId } from "./utils";
import { refreshTokenService } from "./services/refreshToken.services";
import { BadRequestError, NotFoundError } from "@/src/errors/HttpError";

export class AuthUseCase {

  async initializeAdminUserIfNeeded() {
    const existingAdmin = await UserRepository.getByUsername("admin");
    if (existingAdmin) {
      throw new Error("Default admin user already exists");
    }

    const hashedPassword = await hashPassword("password");
    // TODO: Make default admin credentials configurable
    await UserRepository.create({
      username: "admin",
      firstName: "Admin",
      password: hashedPassword,
      role: "admin",
    } as CreateUserParams);
  }

  async listUser(params: ListAuthParams = {}): Promise<SafeUser[]> {
    const users = await UserRepository.list(params);
    return users.map(user => user.toSafeObject());
  }

  async getUserById(id: number): Promise<SafeUser | null> {
    const user = await UserRepository.get(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user.toSafeObject();
  }

  async createUser(data: CreateUserParams): Promise<number> {
    const hashedPassword = hashPassword(data.password);
    const userData = {
      ...data,
      password: await hashedPassword,
    };

    const newUserId = await UserRepository.create(userData);
    return newUserId;
  }

  async login(username: string, password: string): Promise<any> {
    // Fetch user with password for authentication
    const user = await UserRepository.getByUsername(username);

    if (!user) {
      return new BadRequestError("Invalid credentials");
    }

    // Compare the provided password with the hashed password
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return new BadRequestError("Invalid credentials");
    }

    const userTokenCount = (await RefreshTokenRepository.getByUserId(user.id)).length;
    const tokenId = `${userTokenCount + 1}${getRandomTokenId()}`;

    await RefreshTokenRepository.create({
      userId: user.id,
      tokenId,
    });

    const accessToken = getUserAuthToken(user, tokenId);
    const refreshToken = getUserRefreshToken(user, tokenId);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: number, tokenId: string): Promise<any> {
    try {
      if(!refreshTokenService.isRefreshTokenValid(tokenId)){
        return new BadRequestError("Invalid refresh token");
      }

      const user = await UserRepository.get(userId);
      if (!user) {
        return new BadRequestError("Invalid refresh token");
      }

      const accessToken = getUserAuthToken(user, tokenId);
      const refreshToken = getUserRefreshToken(user, tokenId);

      return {
        accessToken,
        refreshToken,
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      throw error;
    }
  }

  async logout(userId: number, tokenId: string): Promise<boolean> {
    try {
      const deleteResult = await RefreshTokenRepository.revokeTokenId(tokenId);
      return deleteResult;
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  }

  async updateUser(id: number, data: Partial<CreateUserParams>): Promise<boolean> {
    return await UserRepository.update(id, data);
  }

  async updateUserPassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await UserRepository.get(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Compare the provided password with the hashed password
    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestError("Invalid current password");
    }

    // Hash the new password and update the user
    const newPasswordHash = await hashPassword(newPassword);
    return await UserRepository.update(id, { password: newPasswordHash });
  }

  async removeUser(id: number): Promise<boolean> {
    return await UserRepository.remove(id);
  }
}

export const authUseCase = new AuthUseCase();