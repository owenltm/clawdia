import { User, SafeUser } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { ListAuthParams, CreateUserParams } from "./types";
import { hashPassword, comparePassword, getUserAuthToken } from "./utils";

export class AuthUseCase {

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

    const token = getUserAuthToken(user);

    // Return user without password
    return {
      user: user.toSafeObject(),
      token,
    };
  }

  async updateUser(id: number, data: Partial<CreateUserParams>): Promise<boolean> {
    // TODO: Might separate update password logic
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    return await UserRepository.update(id, data);
  }

  async removeUser(id: number): Promise<boolean> {
    return await UserRepository.remove(id);
  }
}

export const authUseCase = new AuthUseCase();