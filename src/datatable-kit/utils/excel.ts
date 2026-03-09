/**
 * DataTable Kit - Excel Utils
 * 
 * Excel import/export utilities for DataTable
 */

import * as XLSX from 'xlsx'
import type { ColumnDef } from '@tanstack/react-table'

/**
 * Export options for Excel
 */
export interface ExcelExportOptions {
  /** Filename without extension */
  filename?: string
  /** Sheet name */
  sheetName?: string
  /** Include headers in export */
  includeHeaders?: boolean
  /** Column definitions for header mapping */
  columns?: ColumnDef<any, any>[]
}

/**
 * Import options for Excel
 */
export interface ExcelImportOptions {
  /** Expected sheet name (optional) */
  sheetName?: string
  /** Skip first N rows */
  skipRows?: number
  /** Column mapping { excelColumn: dataKey } */
  columnMapping?: Record<string, string>
}

/**
 * Export data to Excel file
 * 
 * @example
 * ```ts
 * exportToExcel({
 *   data: tableData,
 *   filename: 'users-export',
 *   sheetName: 'Users',
 *   columns: columnDefs
 * })
 * ```
 */
export function exportToExcel<TData = any>(
  data: TData[],
  options: ExcelExportOptions = {}
): void {
  const {
    filename = 'export',
    sheetName = 'Sheet1',
    includeHeaders = true,
    columns = [],
  } = options

  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  try {
    // Prepare data for Excel
    let exportData: any[] = []

    if (columns && columns.length > 0) {
      // Use column definitions to map and format data
      exportData = data.map((row) => {
        const mappedRow: Record<string, any> = {}
        
        columns.forEach((col) => {
          // Skip selection columns and action columns
          if (col.id === 'select' || col.id === 'actions') return
          
          // Get column header text
          let header = col.id || ''
          if (typeof col.header === 'string') {
            header = col.header
          } else if (col.meta && (col.meta as any).title) {
            header = (col.meta as any).title
          }

          // Get cell value
          let value = ''
          if ('accessorKey' in col && col.accessorKey) {
            const key = col.accessorKey as string
            value = (row as any)[key]
          } else if ('accessorFn' in col && col.accessorFn) {
            value = col.accessorFn(row, 0)
          }

          // Format date objects
          if (value && typeof value === 'object' && 'toLocaleDateString' in value) {
            value = (value as Date).toLocaleDateString()
          }

          mappedRow[header] = value
        })

        return mappedRow
      })
    } else {
      // Export raw data
      exportData = data
    }

    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      skipHeader: !includeHeaders,
    })

    // Auto-size columns
    const columnWidths = Object.keys(exportData[0] || {}).map((key) => {
      const maxLength = Math.max(
        key.length,
        ...exportData.map((row) => String(row[key] || '').length)
      )
      return { wch: Math.min(maxLength + 2, 50) }
    })
    worksheet['!cols'] = columnWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // Download file
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw new Error('Failed to export data to Excel')
  }
}

/**
 * Import data from Excel file
 * 
 * @example
 * ```ts
 * const handleFileUpload = async (file: File) => {
 *   const data = await importFromExcel(file, {
 *     sheetName: 'Users',
 *     skipRows: 0
 *   })
 *   setTableData(data)
 * }
 * ```
 */
export async function importFromExcel<TData = any>(
  file: File,
  options: ExcelImportOptions = {}
): Promise<TData[]> {
  const {
    sheetName,
    skipRows = 0,
    columnMapping = {},
  } = options

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          reject(new Error('Failed to read file'))
          return
        }

        // Parse workbook
        const workbook = XLSX.read(data, { type: 'binary' })

        // Get sheet
        const targetSheetName = sheetName || workbook.SheetNames[0]
        const worksheet = workbook.Sheets[targetSheetName]

        if (!worksheet) {
          reject(new Error(`Sheet "${targetSheetName}" not found`))
          return
        }

        // Convert to JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
        }) as any[][]

        // Skip rows if needed
        const dataRows = skipRows > 0 ? rawData.slice(skipRows) : rawData

        if (dataRows.length === 0) {
          resolve([])
          return
        }

        // Get headers from first row
        const headers = dataRows[0] as string[]
        const rows = dataRows.slice(1)

        // Map to objects
        const mappedData: TData[] = rows.map((row) => {
          const obj: Record<string, any> = {}
          
          headers.forEach((header, index) => {
            const cellValue = row[index]
            
            // Use column mapping if provided
            const key = columnMapping[header] || header
            
            obj[key] = cellValue
          })

          return obj as TData
        })

        resolve(mappedData)
      } catch (error) {
        console.error('Error importing from Excel:', error)
        reject(new Error('Failed to import data from Excel'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * Download Excel template with headers
 * 
 * @example
 * ```ts
 * downloadExcelTemplate({
 *   filename: 'users-template',
 *   headers: ['Name', 'Email', 'Role', 'Status'],
 *   sheetName: 'Users'
 * })
 * ```
 */
export function downloadExcelTemplate(options: {
  filename?: string
  headers: string[]
  sheetName?: string
  sampleData?: Record<string, any>[]
}): void {
  const {
    filename = 'template',
    headers,
    sheetName = 'Sheet1',
    sampleData = [],
  } = options

  try {
    // Create data with headers and optional sample data
    const data = sampleData.length > 0 ? sampleData : [{}]

    // Create worksheet with only headers visible if no sample data
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers,
    })

    // If no sample data, clear the data row
    if (sampleData.length === 0) {
      headers.forEach((_, index) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 1, c: index })
        delete worksheet[cellAddress]
      })
    }

    // Auto-size columns
    worksheet['!cols'] = headers.map((header) => ({
      wch: Math.max(header.length + 2, 15),
    }))

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // Download file
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  } catch (error) {
    console.error('Error downloading template:', error)
    throw new Error('Failed to download Excel template')
  }
}

/**
 * Validate Excel file before import
 */
export async function validateExcelFile(
  file: File,
  options: {
    maxSizeBytes?: number
    allowedExtensions?: string[]
  } = {}
): Promise<{ valid: boolean; error?: string }> {
  const {
    maxSizeBytes = 10 * 1024 * 1024, // 10MB default
    allowedExtensions = ['.xlsx', '.xls', '.csv'],
  } = options

  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeBytes / 1024 / 1024}MB limit`,
    }
  }

  // Check file extension
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`,
    }
  }

  return { valid: true }
}
