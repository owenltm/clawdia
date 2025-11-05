import { ref } from "process";
import { User, SafeUser } from "./entities/user.entity";
import { RefreshTokenRepository } from "./repositories/refreshToken.repository";
import { UserRepository } from "./repositories/user.repository";
import { ListAuthParams, CreateUserParams } from "./types";
import { hashPassword, comparePassword, getUserAuthToken, getUserRefreshToken, getRandomTokenId } from "./utils";
import { refreshTokenService } from "./services/refreshToken.services";

export class AuthUseCase {

  async initializeAdminUserIfNeeded() {
    const existingAdmin = await UserRepository.getByUsername("admin");
    if (!existingAdmin) {
      const hashedPassword = await hashPassword("password");
      // TODO: Make default admin credentials configurable
      await UserRepository.create({
        username: "admin",
        firstName: "Admin",
        password: hashedPassword,
        role: "admin",
      } as CreateUserParams);
    }
  }

  async listUser(params: ListAuthParams = {}): Promise<SafeUser[]> {
    const users = await UserRepository.list(params);
    return users.map(user => user.toSafeObject());
  }

  async getUserById(id: number): Promise<SafeUser | null> {
    const user = await UserRepository.get(id);
    return user ? user.toSafeObject() : null;
  }

  async createUser(data: CreateUserParams): Promise<number> {
    console.log("Creating user with data:", data);

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
      return null;
    }

    // Compare the provided password with the hashed password
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return null;
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
        return null;
      }

      const user = await UserRepository.get(userId);
      if (!user) {
        return null;
      }

      const accessToken = getUserAuthToken(user, tokenId);
      const refreshToken = getUserRefreshToken(user, tokenId);

      return {
        accessToken,
        refreshToken,
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      return null;
    }
  }

  async logout(userId: number, tokenId: string): Promise<boolean> {
    try {
      const deleteResult = await RefreshTokenRepository.revokeTokenId(tokenId);
      return deleteResult;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  }

  async updateUser(id: number, data: Partial<CreateUserParams>): Promise<boolean> {
    return await UserRepository.update(id, data);
  }

  async updateUserPassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await UserRepository.get(id);
    if (!user) {
      // TODO: Return error in response
      return false;
    }

    // Compare the provided password with the hashed password
    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      // TODO: Return error in response
      return false;
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