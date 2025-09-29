import { BoxStatus } from "../types";
import { Box as PersistedBox } from "../schemas/box.schema";

export class Box {
  id: number;
  label: string;
  status: BoxStatus;
  maxFill: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    label: string,
    status: BoxStatus,
    maxFill: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.label = label;
    this.status = status;
    this.maxFill = maxFill;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Helper methods
  isEmpty(): boolean {
    return this.status === BoxStatus.EMPTY;
  }

  isFilled(): boolean {
    return this.status === BoxStatus.FILLED;
  }

  fill(): void {
    this.status = BoxStatus.FILLED;
    this.updatedAt = new Date();
  }

  empty(): void {
    this.status = BoxStatus.EMPTY;
    this.updatedAt = new Date();
  }

  updateLabel(newLabel: string): void {
    this.label = newLabel;
    this.updatedAt = new Date();
  }

  updateMaxFill(newMaxFill: number): void {
    if (newMaxFill <= 0) {
      throw new Error("Max fill must be greater than 0");
    }
    this.maxFill = newMaxFill;
    this.updatedAt = new Date();
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
      updatedAt: this.updatedAt,
    };
  }
}