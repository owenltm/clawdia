import { CrabStatus } from "../types";
import { Crab as CrabSchema } from "../schemas/crab.schema";
import { db } from "@/src/db";

export class Crab {
  id: number;
  weight: number;
  supplier: string;
  status: CrabStatus;
  checkInDate: Date;
  checkOutDate?: Date | null;
  notes?: string;
  boxId?: number | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: number;
    weight: number;
    supplier: string;
    status: CrabStatus;
    checkInDate: Date;
    createdAt: Date;
    updatedAt: Date;
    checkOutDate?: Date | null;
    boxId?: number | null;
    notes?: string;
  }) {
    this.id = params.id;
    this.weight = params.weight;
    this.supplier = params.supplier;
    this.status = params.status;
    this.checkInDate = params.checkInDate;
    this.checkOutDate = params.checkOutDate;
    this.boxId = params.boxId;
    this.notes = params.notes;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
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
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Mapper methods
  static fromDatabase(dbCrab: CrabSchema): Crab {
    return new Crab({
      id: dbCrab.id,
      weight: Number(dbCrab.weight), // Convert decimal to number
      supplier: dbCrab.supplier,
      status: dbCrab.status as CrabStatus,
      checkInDate: new Date(dbCrab.checkInDate), // Convert date string to Date
      createdAt: dbCrab.createdAt,
      updatedAt: dbCrab.updatedAt,
      checkOutDate: dbCrab.checkOutDate ? new Date(dbCrab.checkOutDate) : null,
      boxId: dbCrab.boxId,
      notes: dbCrab.notes || undefined,
    });
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
      notes: this.notes ?? '', // Convert undefined to empty string
      boxId: this.boxId ?? null, // Convert undefined to null
      updatedAt: this.updatedAt,
    };
  }
}