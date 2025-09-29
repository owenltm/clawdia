import { CrabStatus } from "../types";
import { Crab as CrabSchema } from "../schemas/crab.schema";

export class Crab {
  id: number;
  weight: number;
  supplier: string;
  status: CrabStatus;
  checkInDate: Date;
  checkOutDate?: Date | null;
  boxId?: number | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    weight: number,
    supplier: string,
    status: CrabStatus,
    checkInDate: Date,
    createdAt: Date,
    updatedAt: Date,
    checkOutDate?: Date | null,
    boxId?: number | null
  ) {
    this.id = id;
    this.weight = weight;
    this.supplier = supplier;
    this.status = status;
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
    this.boxId = boxId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Helper methods
  isCheckedIn(): boolean {
    return this.status === CrabStatus.IN;
  }

  isSold(): boolean {
    return this.status === CrabStatus.SOLD;
  }

  isDead(): boolean {
    return this.status === CrabStatus.DEAD;
  }

  isInBox(): boolean {
    return this.boxId !== null && this.boxId !== undefined;
  }

  checkOut(): void {
    if (this.status !== CrabStatus.IN) {
      throw new Error("Cannot check out crab that is not checked in");
    }
    this.checkOutDate = new Date();
    this.updatedAt = new Date();
  }

  sell(): void {
    this.status = CrabStatus.SOLD;
    this.checkOutDate = new Date();
    this.updatedAt = new Date();
  }

  markAsDead(): void {
    this.status = CrabStatus.DEAD;
    this.checkOutDate = new Date();
    this.updatedAt = new Date();
  }

  assignToBox(boxId: number): void {
    if (this.status !== CrabStatus.IN) {
      throw new Error("Cannot assign crab to box unless it's checked in");
    }
    this.boxId = boxId;
    this.updatedAt = new Date();
  }

  removeFromBox(): void {
    this.boxId = null;
    this.updatedAt = new Date();
  }

  updateWeight(newWeight: number): void {
    if (newWeight <= 0) {
      throw new Error("Weight must be greater than 0");
    }
    this.weight = newWeight;
    this.updatedAt = new Date();
  }

  updateSupplier(newSupplier: string): void {
    if (!newSupplier.trim()) {
      throw new Error("Supplier cannot be empty");
    }
    this.supplier = newSupplier;
    this.updatedAt = new Date();
  }

  getDaysInStorage(): number {
    const endDate = this.checkOutDate || new Date();
    const diffTime = Math.abs(endDate.getTime() - this.checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  toJSON() {
    return {
      id: this.id,
      weight: this.weight,
      supplier: this.supplier,
      status: this.status,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      boxId: this.boxId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Mapper methods
  static fromDatabase(dbCrab: CrabSchema): Crab {
    return new Crab(
      dbCrab.id,
      Number(dbCrab.weight), // Convert decimal to number
      dbCrab.supplier,
      dbCrab.status as CrabStatus,
      new Date(dbCrab.checkInDate), // Convert date string to Date
      dbCrab.createdAt,
      dbCrab.updatedAt,
      dbCrab.checkOutDate ? new Date(dbCrab.checkOutDate) : null,
      dbCrab.boxId
    );
  }

  static fromDatabaseList(dbCrabs: CrabSchema[]): Crab[] {
    return dbCrabs.map(this.fromDatabase);
  }

  toPersistence(): Omit<CrabSchema, 'id' | 'createdAt'> {
    return {
      weight: this.weight.toString(), // Convert number to decimal string
      supplier: this.supplier,
      status: this.status,
      checkInDate: this.checkInDate, // Keep as Date - Drizzle handles conversion
      checkOutDate: this.checkOutDate ?? null, // Convert undefined to null
      boxId: this.boxId ?? null, // Convert undefined to null
      updatedAt: this.updatedAt,
    };
  }
}