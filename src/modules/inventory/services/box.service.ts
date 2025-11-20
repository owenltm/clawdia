import type { Box } from "../entities";
import { BoxRepository } from "../repositories/box.repository";
import { CreateBoxParam, ListBoxesParams, UpdateBoxParam } from "../types";

export class BoxService {
  async list(params?: ListBoxesParams): Promise<Box[]> {
    return BoxRepository.list(params);
  }

  async get(id: number): Promise<Box | undefined> {
    return BoxRepository.get(id);
  }

  async getByLabel(label: string): Promise<Box | undefined> {
    return BoxRepository.getByLabel(label);
  }

  async create(data: CreateBoxParam): Promise<number> {
    return BoxRepository.create(data);
  }

  async update(id: number, data: Partial<UpdateBoxParam>): Promise<boolean> {
    return BoxRepository.update(id, data);
  }

  async remove(id: number): Promise<boolean> {
    return BoxRepository.remove(id);
  }
}

export const boxService = new BoxService();
