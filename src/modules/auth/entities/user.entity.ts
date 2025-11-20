import type { User as UserSchema } from "../schemas/user.schema";

export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string | null,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly role: "admin" | "user",
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  getFullName(): string {
    return this.lastName ? `${this.firstName} ${this.lastName}` : this.firstName;
  }

  /**
   * Returns a safe version of the user without sensitive data
   */
  toSafeObject(): SafeUser {
    return {
      id: this.id,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      role: this.role
    };
  }
}

/**
 * Safe user type without sensitive fields like password
 */
export type SafeUser = Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'toSafeObject' | 'getFullName'>;

/**
 * Mapper function to convert DB schema to User entity
 */
export function mapToDomainUser(dbRow: UserSchema): User {
  return new User(
    dbRow.id,
    dbRow.username,
    dbRow.password,
    dbRow.firstName,
    dbRow.lastName,
    dbRow.email,
    dbRow.phone,
    dbRow.role,
    dbRow.createdAt,
    dbRow.updatedAt
  );
}

/**
 * Mapper function to convert array of DB rows to User entities
 */
export function mapToDomainUsers(dbRows: UserSchema[]): User[] {
  return dbRows.map(mapToDomainUser);
}
