import { createCash, updateCash, deleteCash, getCashById } from '@/src/repository/cashRepository';
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { TransactionGroup } from '@/src/db/types';

export const storeMutation = createTool({
  id: "Store Mutation",
  description: "Create a new cash transaction.",
  inputSchema: z.object({
    transactionDate: z.date().nullable(),
    invoiceNumber: z.string().nullable(),
    transactionType: z.string().nullable(),
    transactionAmount: z.number().nullable(),
    quantity: z.number().nullable(),
    price: z.number().nullable(),
    salesNotes: z.string().nullable(),
    createTime: z.date().nullable(),
    supplier: z.string().nullable(),
    transactionGroup: z.string().nullable(), // TransactionGroup is a string union
  }),
  execute: async ({ context }) => {
    const {
      transactionDate,
      invoiceNumber,
      transactionType,
      transactionAmount,
      quantity,
      price,
      salesNotes,
      createTime,
      supplier,
      transactionGroup
    } = context;
    return createCash(
      transactionDate,
      invoiceNumber,
      transactionType,
      transactionAmount,
      quantity,
      price,
      salesNotes,
      createTime,
      supplier,
      transactionGroup as TransactionGroup
    );
  },
});

export const updateMutation = createTool({
  id: "Update Mutation",
  description: "Update an existing cash transaction by ID.",
  inputSchema: z.object({
    id: z.number(),
    transactionDate: z.date().nullable(),
    invoiceNumber: z.string().nullable(),
    transactionType: z.string().nullable(),
    transactionAmount: z.number().nullable(),
    quantity: z.number().nullable(),
    price: z.number().nullable(),
    salesNotes: z.string().nullable(),
    createTime: z.date().nullable(),
    supplier: z.string().nullable(),
    transactionGroup: z.string().nullable(),
  }),
  execute: async ({ context }) => {
    const {
      id,
      transactionDate,
      invoiceNumber,
      transactionType,
      transactionAmount,
      quantity,
      price,
      salesNotes,
      createTime,
      supplier,
      transactionGroup
    } = context;
    return updateCash(
      id,
      transactionDate,
      invoiceNumber,
      transactionType,
      transactionAmount,
      quantity,
      price,
      salesNotes,
      createTime,
      supplier,
      transactionGroup as TransactionGroup
    );
  },
});

export const deleteMutation = createTool({
  id: "Delete Mutation",
  description: "Delete a cash transaction by ID.",
  inputSchema: z.object({
    id: z.number(),
  }),
  execute: async ({ context: { id } }) => {
    return deleteCash(id);
  },
});

export const getMutationById = createTool({
  id: "Get Mutation By Id",
  description: "Get a cash transaction by ID.",
  inputSchema: z.object({
    id: z.number(),
  }),
  execute: async ({ context: { id } }) => {
    return getCashById(id);
  },
}); 