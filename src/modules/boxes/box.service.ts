import type { Box } from "./types";

import { BoxRepository } from "./box.repository";

import type { CreateBoxInput, UpdateBoxInput } from "./types";

export class BoxService {
  async list(): Promise<Box[]> {
    return BoxRepository.list();
  }

  async get(id: number): Promise<Box | undefined> {
    return BoxRepository.get(id);
  }

  async getByLabel(label: string): Promise<Box | undefined> {
    return BoxRepository.getByLabel(label);
  }

  async create(data: CreateBoxInput): Promise<number> {
    return BoxRepository.create(data);
  }

  async update(id: number, data: UpdateBoxInput): Promise<boolean> {
    return BoxRepository.update(id, data);
  }

  async remove(id: number): Promise<boolean> {
    return BoxRepository.remove(id);
  }
}

export const boxService = new BoxService();
