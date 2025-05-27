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
  orderdt: Date
  exitdt: Date | null
}

export interface CashTable {
  id: Generated<number>
  trdt: Date | null
  invno: string | null
  trtype: string | null
  tramt: number | null
  qty: number | null
  price: number | null
  snotes: string | null
  create_time: Date | null
  supplier: string | null
  trgrp: string | null
}

export type Crabs = Selectable<CrabsTable>
export type NewCrabs = Insertable<CrabsTable>
export type CrabsUpdate = Updateable<CrabsTable>

export type Cash = Selectable<CashTable>
export type NewCash = Insertable<CashTable>
export type CashUpdate = Updateable<CashTable>