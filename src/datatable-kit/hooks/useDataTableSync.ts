'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ColumnFiltersState, OnChangeFn, PaginationState, SortingState } from '@tanstack/react-table'

export interface DataTableSyncOptions {
  defaultPagination?: PaginationState
  defaultSorting?: SortingState
  defaultFilters?: ColumnFiltersState
}

export interface DataTableSyncState {
  pagination: PaginationState
  sorting: SortingState
  columnFilters: ColumnFiltersState
  onPaginationChange: OnChangeFn<PaginationState>
  onSortingChange: OnChangeFn<SortingState>
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
}

function parseJsonParam<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function useDataTableSync(options: DataTableSyncOptions = {}): DataTableSyncState {
  const {
    defaultPagination = { pageIndex: 0, pageSize: 10 },
    defaultSorting = [],
    defaultFilters = [],
  } = options

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchKey = searchParams?.toString() || ''
  const defaultSortingKey = JSON.stringify(defaultSorting)
  const defaultFiltersKey = JSON.stringify(defaultFilters)

  const arePaginationEqual = (a: PaginationState, b: PaginationState) =>
    a.pageIndex === b.pageIndex && a.pageSize === b.pageSize

  const areSortingEqual = (a: SortingState, b: SortingState) =>
    JSON.stringify(a) === JSON.stringify(b)

  const areFiltersEqual = (a: ColumnFiltersState, b: ColumnFiltersState) =>
    JSON.stringify(a) === JSON.stringify(b)

  const initialState = useMemo(() => {
    const params = new URLSearchParams(searchKey)
    const parsedDefaultSorting = parseJsonParam<SortingState>(defaultSortingKey, [])
    const parsedDefaultFilters = parseJsonParam<ColumnFiltersState>(defaultFiltersKey, [])

    return {
      pagination: {
        pageIndex: Number(params.get('page') || defaultPagination.pageIndex),
        pageSize: Number(params.get('pageSize') || defaultPagination.pageSize),
      },
      sorting: parseJsonParam<SortingState>(params.get('sort'), parsedDefaultSorting),
      columnFilters: parseJsonParam<ColumnFiltersState>(params.get('filters'), parsedDefaultFilters),
    }
  }, [searchKey, defaultPagination.pageIndex, defaultPagination.pageSize, defaultSortingKey, defaultFiltersKey])

  const [pagination, setPagination] = useState<PaginationState>(initialState.pagination)
  const [sorting, setSorting] = useState<SortingState>(initialState.sorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState.columnFilters)

  const syncUrl = useCallback(
    (nextPagination: PaginationState, nextSorting: SortingState, nextFilters: ColumnFiltersState) => {
      const params = new URLSearchParams(searchKey)
      params.set('page', String(nextPagination.pageIndex))
      params.set('pageSize', String(nextPagination.pageSize))

      if (nextSorting.length > 0) params.set('sort', JSON.stringify(nextSorting))
      else params.delete('sort')

      if (nextFilters.length > 0) params.set('filters', JSON.stringify(nextFilters))
      else params.delete('filters')

      const nextQuery = params.toString()
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
    },
    [pathname, router, searchKey]
  )

  const onPaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater
      setPagination(next)
      syncUrl(next, sorting, columnFilters)
    },
    [pagination, sorting, columnFilters, syncUrl]
  )

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      const nextSorting = typeof updater === 'function' ? updater(sorting) : updater
      const resetPagination = { ...pagination, pageIndex: 0 }
      setSorting(nextSorting)
      setPagination(resetPagination)
      syncUrl(resetPagination, nextSorting, columnFilters)
    },
    [sorting, pagination, columnFilters, syncUrl]
  )

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      const nextFilters = typeof updater === 'function' ? updater(columnFilters) : updater
      const resetPagination = { ...pagination, pageIndex: 0 }
      setColumnFilters(nextFilters)
      setPagination(resetPagination)
      syncUrl(resetPagination, sorting, nextFilters)
    },
    [columnFilters, pagination, sorting, syncUrl]
  )

  useEffect(() => {
    setPagination((prev) =>
      arePaginationEqual(prev, initialState.pagination) ? prev : initialState.pagination
    )
    setSorting((prev) =>
      areSortingEqual(prev, initialState.sorting) ? prev : initialState.sorting
    )
    setColumnFilters((prev) =>
      areFiltersEqual(prev, initialState.columnFilters) ? prev : initialState.columnFilters
    )
  }, [initialState])

  return {
    pagination,
    sorting,
    columnFilters,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
  }
}
