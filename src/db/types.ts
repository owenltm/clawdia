import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from 'kysely'

export interface Database {
  crabs: CrabsTable
  cash: CashTable
}

export interface CrabsTable {
  id: Generated<number>
  box: string
  weight: number
  supplier: string
  orderdate: Date
}

export interface CashTable {
  id: Generated<number>
  amount: number
  description: string
  date: Date
  type: string
}

export type Crabs = Selectable<CrabsTable>
export type NewCrabs = Insertable<CrabsTable>
export type CrabsUpdate = Updateable<CrabsTable>

export type Cash = Selectable<CashTable>
export type NewCash = Insertable<CashTable>
export type CashUpdate = Updateable<CashTable>