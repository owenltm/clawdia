import { BoxStatus, UpdateBoxParam } from "../types";
import { Box as PersistedBox } from "../schemas/box.schema";

export class Box {
  id: number;
  label: string;
  status: BoxStatus;
  maxFill: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    label: string,
    status: BoxStatus,
    maxFill: number,
    notes: string | null,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.label = label;
    this.status = status;
    this.maxFill = maxFill;
    this.notes = notes
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Helper methods
  isAvailable(): boolean {
    return this.status !== BoxStatus.UNAVAILABLE;
  }

  isMaxFilled(currentFill: number): boolean {
    return currentFill >= this.maxFill;
  }

  isFilled(): boolean {
    return this.status === BoxStatus.FILLED;
  }

  canUpdate(update: UpdateBoxParam): boolean {
    if (update.status === BoxStatus.EMPTY || update.status === BoxStatus.UNAVAILABLE) {
      if (this.isFilled()) {
        console.error(`Cannot update box with id ${this.id} to status ${update.status} because it contains crabs`);
        return false;
      }
    }
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      label: this.label,
      status: this.status,
      maxFill: this.maxFill,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Mapper methods
  static fromDatabase(dbBox: PersistedBox): Box {
    return new Box(
      dbBox.id,
      dbBox.label,
      dbBox.status as BoxStatus,
      dbBox.maxFill,
      dbBox.notes,
      dbBox.createdAt,
      dbBox.updatedAt
    );
  }

  static fromDatabaseList(dbBoxes: PersistedBox[]): Box[] {
    return dbBoxes.map(this.fromDatabase);
  }

  toPersistence(): Omit<PersistedBox, 'id' | 'createdAt'> {
    return {
      label: this.label,
      status: this.status,
      maxFill: this.maxFill,
      notes: this.notes,
      updatedAt: this.updatedAt,
    };
  }
}