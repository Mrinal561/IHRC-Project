// // import {
// //     forwardRef,
// //     useMemo,
// //     useEffect,
// //     useState,
// //     useImperativeHandle,
// // } from 'react'
// // import classNames from 'classnames'
// // import Table from '@/components/ui/Table'
// // import Pagination from '@/components/ui/Pagination'
// // import Select from '@/components/ui/Select'
// // import TableRowSkeleton from './loaders/TableRowSkeleton'
// // import Loading from './Loading'
// // import {
// //     useReactTable,
// //     getCoreRowModel,
// //     getFilteredRowModel,
// //     getPaginationRowModel,
// //     getSortedRowModel,
// //     flexRender,
// //     ColumnDef,
// //     ColumnSort,
// //     Row,
// //     CellContext,
// // } from '@tanstack/react-table'
// // import type { SkeletonProps } from '@/components/ui/Skeleton'
// // import type { ForwardedRef, ChangeEvent } from 'react'

// // export type OnSortParam = { order: 'asc' | 'desc' | ''; key: string | number }

// // type DataTableProps<T> = {
// //     columns: ColumnDef<T>[]
// //     data?: unknown[]
// //     loading?: boolean
// //     onCheckBoxChange?: (checked: boolean, row: T) => void
// //     onIndeterminateCheckBoxChange?: (checked: boolean, rows: Row<T>[]) => void
// //     onPaginationChange?: (page: number) => void
// //     onSelectChange?: (num: number) => void
// //     onSort?: (sort: OnSortParam) => void
// //     pageSizes?: number[]
// //     selectable?: boolean
// //     skeletonAvatarColumns?: number[]
// //     skeletonAvatarProps?: SkeletonProps
// //     pagingData?: {
// //         total: number
// //         pageIndex: number
// //         pageSize: number
// //     }
// //     stickyHeader?: boolean
// //     stickyFirstColumn?: boolean
// //     stickyLastColumn?: boolean
// // }

// // export type DataTableResetHandle = {
// //     resetSorting: () => void
// //     resetSelected: () => void
// // }

// // function _DataTable<T>(
// //     props: DataTableProps<T>,
// //     ref: ForwardedRef<DataTableResetHandle>
// // ) {
// //     const {
// //         skeletonAvatarColumns,
// //         columns: columnsProp = [],
// //         data = [],
// //         loading = false,
// //         onPaginationChange,
// //         onSelectChange,
// //         onSort,
// //         pageSizes = [10, 25, 50, 100],
// //         selectable = false,
// //         skeletonAvatarProps,
// //         pagingData = {
// //             total: 0,
// //             pageIndex: 1,
// //             pageSize: 10,
// //         },
// //     } = props

// //     const { pageSize, pageIndex, total } = pagingData

// //     const [sorting, setSorting] = useState<ColumnSort[] | null>(null);

// //     const pageSizeOption = useMemo(
// //         () =>
// //             pageSizes.map((number) => ({
// //                 value: number,
// //                 label: `${number} / page`,
// //             })),
// //         [pageSizes]
// //     )

// //     const handlePaginationChange = (page: number) => {
// //         if (!loading) {
// //             onPaginationChange?.(page)
// //         }
// //     }

// //     const handleSelectChange = (value?: number) => {
// //         if (!loading) {
// //             onSelectChange?.(Number(value))
// //         }
// //     }

// //     useEffect(() => {
// //         if (Array.isArray(sorting)) {
// //             const sortOrder =
// //                 sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
// //             const id = sorting.length > 0 ? sorting[0].id : ''
// //             onSort?.({ order: sortOrder, key: id })
// //         }
// //     }, [sorting, onSort])

// //     const finalColumns: ColumnDef<T>[] = useMemo(() => {
// //         const columns = columnsProp

// //         if (selectable) {
// //             return [
// //                 {
// //                     id: 'select',
// //                     header: ({ table }) => (
// //                         <></>
// //                     ),
// //                     cell: ({ row }) => (
// //                         <></>
// //                     ),
// //                 },
// //                 ...columns,
// //             ]
// //         }
// //         return columns
// //     }, [columnsProp, selectable])

// //     const table = useReactTable({
// //         data,
// //         columns: finalColumns as ColumnDef<unknown | object | any[], any>[],
// //         getCoreRowModel: getCoreRowModel(),
// //         getFilteredRowModel: getFilteredRowModel(),
// //         getPaginationRowModel: getPaginationRowModel(),
// //         getSortedRowModel: getSortedRowModel(),
// //         manualPagination: true,
// //         manualSorting: true,
// //         onSortingChange: (sorter) => {
// //             setSorting(sorter as ColumnSort[])
// //         },
// //         state: {
// //             sorting: sorting as ColumnSort[],
// //         },
// //     })

// //     const resetSorting = () => {
// //         table.resetSorting()
// //     }

// //     const resetSelected = () => {
// //         table.toggleAllRowsSelected(false)
// //     }

// //     useImperativeHandle(ref, () => ({
// //         resetSorting,
// //         resetSelected,
// //     }))

// //     return (
// //         <Loading loading={loading && data.length !== 0} type="cover">
// //             <div className="relative overflow-x-auto overflow-y-auto max-h-[500px]">
// //                 <style>{`
// //                     .sticky-column {
// //                         position: sticky;
// //                         background: #ffffff;
// //                         z-index: 1;
// //                     }
// //                     .sticky-left {
// //                         left: 0;
// //                         z-index: 2;
// //                     }
// //                     .sticky-right {
// //                         right: 0;
// //                         z-index: 2;
// //                     }
// //                     .sticky-header {
// //                         position: sticky;
// //                         top: 0;
// //                         background: #f9fafb;
// //                         z-index: 3;
// //                     }
// //                     .sticky-header.sticky-left {
// //                         z-index: 4;
// //                     }
// //                     .sticky-header.sticky-right {
// //                         z-index: 4;
// //                     }
// //                     .table-row:hover .sticky-column {
// //                         background-color: #f3f4f6;
// //                     }
// //                     .table-row:hover .sticky-column::after {
// //                         content: '';
// //                         position: absolute;
// //                         top: 0;
// //                         left: 0;
// //                         right: 0;
// //                         bottom: 0;
// //                         background-color: inherit;
// //                         z-index: -1;
// //                     }
// //                 `}</style>
// //                 <Table>
// //                     <Table.THead>
// //                         {table.getHeaderGroups().map((headerGroup) => (
// //                             <Table.Tr key={headerGroup.id}>
// //                                 {headerGroup.headers.map((header, index) => {
// //                                     const isFirstColumn = index === 0;
// //                                     const isLastColumn = index === headerGroup.headers.length - 1;
// //                                     const stickyClass = classNames({
// //                                         'sticky-header': true,
// //                                         'sticky-column': (isFirstColumn && props.stickyFirstColumn) || (isLastColumn && props.stickyLastColumn),
// //                                         'sticky-left': isFirstColumn && props.stickyFirstColumn,
// //                                         'sticky-right': isLastColumn && props.stickyLastColumn,
// //                                     });

// //                                     return (
// //                                         <Table.Th
// //                                             key={header.id}
// //                                             colSpan={header.colSpan}
// //                                             className={stickyClass}
// //                                         >
// //                                             {header.isPlaceholder ? null : (
// //                                                 <div
// //                                                     className={classNames(
// //                                                         header.column.getCanSort() &&
// //                                                             'cursor-pointer select-none point',
// //                                                         loading &&
// //                                                             'pointer-events-none'
// //                                                     )}
// //                                                     onClick={header.column.getToggleSortingHandler()}
// //                                                 >
// //                                                     {flexRender(
// //                                                         header.column.columnDef.header,
// //                                                         header.getContext()
// //                                                     )}
// //                                                     {header.column.getCanSort() && (
// //                                                         <Table.Sorter
// //                                                             sort={header.column.getIsSorted()}
// //                                                         />
// //                                                     )}
// //                                                 </div>
// //                                             )}
// //                                         </Table.Th>
// //                                     )
// //                                 })}
// //                             </Table.Tr>
// //                         ))}
// //                     </Table.THead>
// //                     {loading && data.length === 0 ? (
// //                         <TableRowSkeleton
// //                             columns={(finalColumns as Array<T>).length}
// //                             rows={pagingData.pageSize}
// //                             avatarInColumns={skeletonAvatarColumns}
// //                             avatarProps={skeletonAvatarProps}
// //                         />
// //                     ) : (
// //                         <Table.TBody>
// //                             {table
// //                                 .getRowModel()
// //                                 .rows.slice(0, pageSize)
// //                                 .map((row) => {
// //                                     return (
// //                                         <Table.Tr key={row.id} className="table-row">
// //                                             {row.getVisibleCells().map((cell, index) => {
// //                                                 const isFirstColumn = index === 0;
// //                                                 const isLastColumn = index === row.getVisibleCells().length - 1;
// //                                                 const stickyClass = classNames({
// //                                                     'sticky-column': (isFirstColumn && props.stickyFirstColumn) || (isLastColumn && props.stickyLastColumn),
// //                                                     'sticky-left': isFirstColumn && props.stickyFirstColumn,
// //                                                     'sticky-right': isLastColumn && props.stickyLastColumn,
// //                                                 });

// //                                                 return (
// //                                                     <Table.Td key={cell.id} className={stickyClass}>
// //                                                         {flexRender(
// //                                                             cell.column.columnDef.cell,
// //                                                             cell.getContext()
// //                                                         )}
// //                                                     </Table.Td>
// //                                                 )
// //                                             })}
// //                                         </Table.Tr>
// //                                     )
// //                                 })}
// //                         </Table.TBody>
// //                     )}
// //                 </Table>
// //             </div>
// //             <div className="flex items-center justify-between mt-4">
// //                 <Pagination
// //                     pageSize={pageSize}
// //                     currentPage={pageIndex}
// //                     total={total}
// //                     onChange={handlePaginationChange}
// //                 />
// //                 <div style={{ minWidth: 130 }}>
// //                     <Select
// //                         size="sm"
// //                         menuPlacement="top"
// //                         isSearchable={false}
// //                         value={pageSizeOption.filter(
// //                             (option) => option.value === pageSize
// //                         )}
// //                         options={pageSizeOption}
// //                         onChange={(option) => handleSelectChange(option?.value)}
// //                     />
// //                 </div>
// //             </div>
// //         </Loading>
// //     )
// // }

// // const DataTable = forwardRef(_DataTable) as <T>(
// //     props: DataTableProps<T> & {
// //         ref?: ForwardedRef<DataTableResetHandle>
// //     }
// // ) => ReturnType<typeof _DataTable>

// // export type { ColumnDef, Row, CellContext }
// // export default DataTable


// import {
//     forwardRef,
//     useMemo,
//     useEffect,
//     useState,
//     useImperativeHandle,
// } from 'react'
// import classNames from 'classnames'
// import Table from '@/components/ui/Table'
// import Pagination from '@/components/ui/Pagination'
// import Select from '@/components/ui/Select'
// import TableRowSkeleton from './loaders/TableRowSkeleton'
// import Loading from './Loading'
// import {
//     useReactTable,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     flexRender,
//     ColumnDef,
//     ColumnSort,
//     Row,
//     CellContext,
// } from '@tanstack/react-table'
// import type { SkeletonProps } from '@/components/ui/Skeleton'
// import type { ForwardedRef, ChangeEvent } from 'react'

// export type OnSortParam = { order: 'asc' | 'desc' | ''; key: string | number }

// type DataTableProps<T> = {
//     columns: ColumnDef<T>[]
//     data?: unknown[]
//     loading?: boolean
//     onCheckBoxChange?: (checked: boolean, row: T) => void
//     onIndeterminateCheckBoxChange?: (checked: boolean, rows: Row<T>[]) => void
//     onPaginationChange?: (page: number) => void
//     onSelectChange?: (num: number) => void
//     onSort?: (sort: OnSortParam) => void
//     pageSizes?: number[]
//     selectable?: boolean
//     skeletonAvatarColumns?: number[]
//     skeletonAvatarProps?: SkeletonProps
//     pagingData?: {
//         total: number
//         pageIndex: number
//         pageSize: number
//     }
//     stickyHeader?: boolean
//     stickyFirstColumn?: boolean
//     stickyLastColumn?: boolean
//     showPageSizeSelector?: boolean 
// }

// export type DataTableResetHandle = {
//     resetSorting: () => void
//     resetSelected: () => void
// }

// function _DataTable<T>(
//     props: DataTableProps<T>,
//     ref: ForwardedRef<DataTableResetHandle>
// ) {
//     const {
//         skeletonAvatarColumns,
//         columns: columnsProp = [],
//         data = [],
//         loading = false,
//         onPaginationChange,
//         onSelectChange,
//         onSort,
//         pageSizes = [10, 25, 50, 100],
//         selectable = false,
//         skeletonAvatarProps,
//         pagingData = {
//             total: 0,
//             pageIndex: 1,
//             pageSize: 10,
//         },
//         showPageSizeSelector = true, 
//     } = props

//     const { pageSize, pageIndex, total } = pagingData

//     const [sorting, setSorting] = useState<ColumnSort[] | null>(null);

//     const pageSizeOption = useMemo(
//         () =>
//             pageSizes.map((number) => ({
//                 value: number,
//                 label: `${number} / page`,
//             })),
//         [pageSizes]
//     )

//     const handlePaginationChange = (page: number) => {
//         if (!loading) {
//             onPaginationChange?.(page)
//         }
//     }

//     const handleSelectChange = (value?: number) => {
//         if (!loading) {
//             onSelectChange?.(Number(value))
//         }
//     }

//     useEffect(() => {
//         if (Array.isArray(sorting)) {
//             const sortOrder =
//                 sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
//             const id = sorting.length > 0 ? sorting[0].id : ''
//             onSort?.({ order: sortOrder, key: id })
//         }
//     }, [sorting, onSort])

//     const finalColumns: ColumnDef<T>[] = useMemo(() => {
//         const columns = columnsProp

//         if (selectable) {
//             return [
//                 {
//                     id: 'select',
//                     header: ({ table }) => (
//                         <></>
//                     ),
//                     cell: ({ row }) => (
//                         <></>
//                     ),
//                 },
//                 ...columns,
//             ]
//         }
//         return columns
//     }, [columnsProp, selectable])

//     const table = useReactTable({
//         data,
//         columns: finalColumns as ColumnDef<unknown | object | any[], any>[],
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         manualPagination: true,
//         manualSorting: true,
//         onSortingChange: (sorter) => {
//             setSorting(sorter as ColumnSort[])
//         },
//         state: {
//             sorting: sorting as ColumnSort[],
//         },
//     })

//     const resetSorting = () => {
//         table.resetSorting()
//     }

//     const resetSelected = () => {
//         table.toggleAllRowsSelected(false)
//     }

//     useImperativeHandle(ref, () => ({
//         resetSorting,
//         resetSelected,
//     }))

//     // Function to determine if a column should be sticky
//     const isSticky = (index: number, totalColumns: number, isHeader = false) => {
//         if (selectable) {
//             // If selectable is true, we need to account for the extra select column
//             if (index === 1 && props.stickyFirstColumn) return 'left'; // First data column after select
//             if (index === totalColumns - 1 && props.stickyLastColumn) return 'right';
//         } else {
//             // Normal case without select column
//             if (index === 0 && props.stickyFirstColumn) return 'left';
//             if (index === totalColumns - 1 && props.stickyLastColumn) return 'right';
//         }
//         return null;
//     };

//     return (
//         <Loading loading={loading && data.length !== 0} type="cover">
//             <div className="relative isolate">
//                 <style>{`
//                     .sticky-column {
//                         position: sticky;
//                         background: #ffffff;
//                         z-index: 10;
//                     }
//                     .sticky-left {
//                         left: 0;
//                         z-index: 11;
//                     }
//                     .sticky-right {
//                         right: 0;
//                         z-index: 11;
//                     }
//                     .sticky-header {
//                         position: sticky;
//                         top: 0;
//                         background: #f9fafb;
//                         z-index: 12;
//                     }
//                     .sticky-header.sticky-left {
//                         z-index: 13;
//                     }
//                     .sticky-header.sticky-right {
//                         z-index: 13;
//                     }
//                     .table-row:hover .sticky-column {
//                         background-color: #f3f4f6;
//                     }
//                     .table-row:hover .sticky-column::after {
//                         content: '';
//                         position: absolute;
//                         top: 0;
//                         left: 0;
//                         right: 0;
//                         bottom: 0;
//                         background-color: inherit;
//                         z-index: -1;
//                     }
                    
//                     /* Override Select component styles */
//                     .select-dropdown {
//                         z-index: 9999 !important;
//                     }
//                 `}</style>
//                 <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
//                     <Table>
//                         <Table.THead>
//                             {table.getHeaderGroups().map((headerGroup) => (
//                                   <Table.Tr key={headerGroup.id}>
//                                   {headerGroup.headers.map((header, index) => {
//                                       const stickyDirection = isSticky(index, headerGroup.headers.length, true);
//                                       const stickyClass = classNames({
//                                           'sticky-header': true,
//                                           'sticky-column': stickyDirection,
//                                           'sticky-left': stickyDirection === 'left',
//                                           'sticky-right': stickyDirection === 'right',
//                                       });

//                                         return (
//                                             <Table.Th
//                                                 key={header.id}
//                                                 colSpan={header.colSpan}
//                                                 className={stickyClass}
//                                             >
//                                                 {header.isPlaceholder ? null : (
//                                                     <div
//                                                         className={classNames(
//                                                             header.column.getCanSort() &&
//                                                                 'cursor-pointer select-none point',
//                                                             loading &&
//                                                                 'pointer-events-none'
//                                                         )}
//                                                         onClick={header.column.getToggleSortingHandler()}
//                                                     >
//                                                         {flexRender(
//                                                             header.column.columnDef.header,
//                                                             header.getContext()
//                                                         )}
//                                                         {header.column.getCanSort() && (
//                                                             <Table.Sorter
//                                                                 sort={header.column.getIsSorted()}
//                                                             />
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </Table.Th>
//                                         )
//                                     })}
//                                 </Table.Tr>
//                             ))}
//                         </Table.THead>
//                         {loading && data.length === 0 ? (
//                             <TableRowSkeleton
//                                 columns={(finalColumns as Array<T>).length}
//                                 rows={pagingData.pageSize}
//                                 avatarInColumns={skeletonAvatarColumns}
//                                 avatarProps={skeletonAvatarProps}
//                             />
//                         ) : (
//                             <Table.TBody>
//                             {table
//                                 .getRowModel()
//                                 .rows.slice(0, pageSize)
//                                 .map((row) => {
//                                     return (
//                                         <Table.Tr key={row.id} className="table-row">
//                                             {row.getVisibleCells().map((cell, index) => {
//                                                 const stickyDirection = isSticky(index, row.getVisibleCells().length);
//                                                 const stickyClass = classNames({
//                                                     'sticky-column': stickyDirection,
//                                                     'sticky-left': stickyDirection === 'left',
//                                                     'sticky-right': stickyDirection === 'right',
//                                                 });

//                                                 return (
//                                                     <Table.Td key={cell.id} className={stickyClass}>
//                                                         {flexRender(
//                                                             cell.column.columnDef.cell,
//                                                             cell.getContext()
//                                                         )}
//                                                     </Table.Td>
//                                                 )
//                                             })}
//                                         </Table.Tr>
//                                     )
//                                 })}
//                         </Table.TBody>
//                         )}
//                     </Table>
//                 </div>
//             </div>
//             <div className="flex items-center justify-between mt-4">
//                 <Pagination
//                     pageSize={pageSize}
//                     currentPage={pageIndex}
//                     total={total}
//                     onChange={handlePaginationChange}
//                 />
//                 <div className="relative" style={{ minWidth: 130 }}>
//                     <div className="relative">
//                         <Select
//                             size="sm"
//                             menuPlacement="top"
//                             isSearchable={false}
//                             classNamePrefix="select"
//                             value={pageSizeOption.filter(
//                                 (option) => option.value === pageSize
//                             )}
//                             options={pageSizeOption}
//                             onChange={(option) => handleSelectChange(option?.value)}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </Loading>
//     )
// }

// const DataTable = forwardRef(_DataTable) as <T>(
//     props: DataTableProps<T> & {
//         ref?: ForwardedRef<DataTableResetHandle>
//     }
// ) => ReturnType<typeof _DataTable>

// export type { ColumnDef, Row, CellContext }
// export default DataTable





import {
    forwardRef,
    useMemo,
    useEffect,
    useState,
    useImperativeHandle,
} from 'react'
import classNames from 'classnames'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import TableRowSkeleton from './loaders/TableRowSkeleton'
import Loading from './Loading'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    ColumnSort,
    Row,
    CellContext,
} from '@tanstack/react-table'
import type { SkeletonProps } from '@/components/ui/Skeleton'
import type { ForwardedRef, ChangeEvent } from 'react'

export type OnSortParam = { order: 'asc' | 'desc' | ''; key: string | number }

type DataTableProps<T> = {
    columns: ColumnDef<T>[]
    data?: unknown[]
    loading?: boolean
    onCheckBoxChange?: (checked: boolean, row: T) => void
    onIndeterminateCheckBoxChange?: (checked: boolean, rows: Row<T>[]) => void
    onPaginationChange?: (page: number) => void
    onSelectChange?: (num: number) => void
    onSort?: (sort: OnSortParam) => void
    pageSizes?: number[]
    selectable?: boolean
    skeletonAvatarColumns?: number[]
    skeletonAvatarProps?: SkeletonProps
    pagingData?: {
        total: number
        pageIndex: number
        pageSize: number
    }
    stickyHeader?: boolean
    stickyFirstColumn?: boolean
    stickyLastColumn?: boolean
}

export type DataTableResetHandle = {
    resetSorting: () => void
    resetSelected: () => void
}

function _DataTable<T>(
    props: DataTableProps<T>,
    ref: ForwardedRef<DataTableResetHandle>
) {
    const {
        skeletonAvatarColumns,
        columns: columnsProp = [],
        data = [],
        loading = false,
        onPaginationChange,
        onSelectChange,
        onSort,
        pageSizes = [10, 25, 50, 100],
        selectable = false,
        skeletonAvatarProps,
        pagingData = {
            total: 0,
            pageIndex: 1,
            pageSize: 10,
        },
    } = props

    const { pageSize, pageIndex, total } = pagingData

    const [sorting, setSorting] = useState<ColumnSort[] | null>(null);

    const pageSizeOption = useMemo(
        () =>
            pageSizes.map((number) => ({
                value: number,
                label: `${number} / page`,
            })),
        [pageSizes]
    )

    const handlePaginationChange = (page: number) => {
        if (!loading) {
            onPaginationChange?.(page)
        }
    }

    const handleSelectChange = (value?: number) => {
        if (!loading) {
            onSelectChange?.(Number(value))
        }
    }

    useEffect(() => {
        if (Array.isArray(sorting)) {
            const sortOrder =
                sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
            const id = sorting.length > 0 ? sorting[0].id : ''
            onSort?.({ order: sortOrder, key: id })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting])

    const finalColumns: ColumnDef<T>[] = useMemo(() => {
        const columns = columnsProp

        if (selectable) {
            return [
                {
                    id: 'select',
                    header: ({ table }) => (
                        <></>
                    ),
                    cell: ({ row }) => (
                        <></>
                    ),
                },
                ...columns,
            ]
        }
        return columns
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnsProp, selectable])

    const table = useReactTable({
        data,
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        columns: finalColumns as ColumnDef<unknown | object | any[], any>[],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        onSortingChange: (sorter) => {
            setSorting(sorter as ColumnSort[])
        },
        state: {
            sorting: sorting as ColumnSort[],
        },
    })

    const resetSorting = () => {
        table.resetSorting()
    }

    const resetSelected = () => {
        table.toggleAllRowsSelected(false)
    }

    useImperativeHandle(ref, () => ({
        resetSorting,
        resetSelected,
    }))

    // Function to determine if a column should be sticky
    const isSticky = (index: number, totalColumns: number, isHeader = false) => {
        if (selectable) {
            // If selectable is true, we need to account for the extra select column
            if (index === 1 && props.stickyFirstColumn) return 'left'; // First data column after select
            if (index === totalColumns - 1 && props.stickyLastColumn) return 'right';
        } else {
            // Normal case without select column
            if (index === 0 && props.stickyFirstColumn) return 'left';
            if (index === totalColumns - 1 && props.stickyLastColumn) return 'right';
        }
        return null;
    };

    return (
        <Loading loading={loading && data.length !== 0} type="cover">
            <div className="relative">
                <style>{`
                    .sticky-column {
                        position: sticky;
                        background: #ffffff;
                        z-index: 10;
                    }
                    .sticky-left {
                        left: 0;
                        z-index: 11;
                    }
                    .sticky-right {
                        right: 0;
                        z-index: 11;
                    }
                    .sticky-header {
                        position: sticky;
                        top: 0;
                        background: #f9fafb;
                        z-index: 12;
                    }
                    .sticky-header.sticky-left {
                        z-index: 13;
                    }
                    .sticky-header.sticky-right {
                        z-index: 13;
                    }
                    .table-row:hover .sticky-column {
                        background-color: #f3f4f6;
                    }
                    .table-row:hover .sticky-column::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: inherit;
                        z-index: -1;
                    }
                    
                    /* Override Select component styles */
                    .select-dropdown {
                        z-index: 9999 !important;
                    }
                `}</style>
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                    <Table>
                        <Table.THead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Table.Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header, index) => {
                                        const stickyDirection = isSticky(index, headerGroup.headers.length, true);
                                        const stickyClass = classNames({
                                            'sticky-header': true,
                                            'sticky-column': stickyDirection,
                                            'sticky-left': stickyDirection === 'left',
                                            'sticky-right': stickyDirection === 'right',
                                        });

                                        return (
                                            <Table.Th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className={stickyClass}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={classNames(
                                                            header.column.getCanSort() &&
                                                                'cursor-pointer select-none point',
                                                            loading &&
                                                                'pointer-events-none'
                                                        )}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getCanSort() && (
                                                            <Table.Sorter
                                                                sort={header.column.getIsSorted()}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </Table.Th>
                                        )
                                    })}
                                </Table.Tr>
                            ))}
                        </Table.THead>
                        {loading && data.length === 0 ? (
                            <TableRowSkeleton
                                columns={(finalColumns as Array<T>).length}
                                rows={pagingData.pageSize}
                                avatarInColumns={skeletonAvatarColumns}
                                avatarProps={skeletonAvatarProps}
                            />
                        ) : (
                            <Table.TBody>
                                {table
                                    .getRowModel()
                                    .rows.slice(0, pageSize)
                                    .map((row) => {
                                        return (
                                            <Table.Tr key={row.id} className="table-row">
                                                {row.getVisibleCells().map((cell, index) => {
                                                    const stickyDirection = isSticky(index, row.getVisibleCells().length);
                                                    const stickyClass = classNames({
                                                        'sticky-column': stickyDirection,
                                                        'sticky-left': stickyDirection === 'left',
                                                        'sticky-right': stickyDirection === 'right',
                                                    });

                                                    return (
                                                        <Table.Td key={cell.id} className={stickyClass}>
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </Table.Td>
                                                    )
                                                })}
                                            </Table.Tr>
                                        )
                                    })}
                            </Table.TBody>
                        )}
                    </Table>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={pageIndex}
                    total={total}
                    onChange={handlePaginationChange}
                />
                <div className="relative" style={{ minWidth: 130 }}>
                    <div className="relative">
                        <Select
                            size="sm"
                            menuPlacement="top"
                            isSearchable={false}
                            classNamePrefix="select"
                            value={pageSizeOption.filter(
                                (option) => option.value === pageSize
                            )}
                            options={pageSizeOption}
                            onChange={(option) => handleSelectChange(option?.value)}
                        />
                    </div>
                </div>
            </div>
        </Loading>
    )
}

const DataTable = forwardRef(_DataTable) as <T>(
    props: DataTableProps<T> & {
        ref?: ForwardedRef<DataTableResetHandle>
    }
) => ReturnType<typeof _DataTable>

export type { ColumnDef, Row, CellContext }
export default DataTable

