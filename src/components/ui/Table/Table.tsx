import React, { forwardRef, ReactElement, ReactNode, cloneElement, isValidElement, useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import type { ComponentPropsWithRef, ElementType } from 'react'

export interface TableProps extends ComponentPropsWithRef<'table'> {
    asElement?: ElementType
    borderlessRow?: boolean
    compact?: boolean
    hoverable?: boolean
    overflow?: boolean
    stickyFirstColumn?: boolean
    stickyLastColumn?: boolean
    children: ReactNode
}

const Table = forwardRef<HTMLElement, TableProps>((props, ref) => {
    const {
        asElement: Component = 'table',
        borderlessRow,
        children,
        className,
        compact = false,
        hoverable = true,
        overflow = true,
        stickyFirstColumn = false,
        stickyLastColumn = false,
        ...rest
    } = props
    const tableRef = useRef<HTMLDivElement>(null);
    const [showLeftShadow, setShowLeftShadow] = useState(false)
    const [showRightShadow, setShowRightShadow] = useState(false)
    const tableClass = classNames(
        Component === 'table' ? 'table-default' : 'table-flex',
        hoverable && 'table-hover',
        compact && 'table-compact',
        borderlessRow && 'borderless-row',
        className
    )

    useEffect(() => {
        const handleScroll = () => {
            if (tableRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = tableRef.current
                setShowLeftShadow(scrollLeft > 0)
                setShowRightShadow(scrollLeft < scrollWidth - clientWidth)
            }
        }

        const tableElement = tableRef.current
        if (tableElement) {
            tableElement.addEventListener('scroll', handleScroll)
            handleScroll() // Initial check
        }

        return () => {
            if (tableElement) {
                tableElement.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    const wrapperClass = classNames(
        'relative',
        overflow && 'overflow-x-auto overflow-y-auto max-h-[350px] ref={tableRef}'
    )

    const stickyColumnStyles = `
        .sticky-column {
            position: sticky;
            background: #ffffff;
            // z-index: 10;
        }
        .sticky-left {
                left: 0;
        }
        .sticky-right {
            right: 0;
        }
        .sticky-header {
            position: sticky;
            // z-index: 10;
            background: #f9fafb;
        }
        .table-row:hover .sticky-column {
                        background-color: #f9fafb; 
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
        .sticky-left.show-shadow {
            box-shadow: 5px 0 5px -5px rgba(0,0,0,0.1);
        }
        .sticky-right.show-shadow {
            box-shadow: -5px 0 5px -5px rgba(0,0,0,0.1);
        }
        
    `

    const addStickyClass = (element: ReactElement, index: number, totalColumns: number): ReactElement => {
        const isFirstColumn = index === 0;
        const isLastColumn = index === totalColumns - 1;
        const isTopHeader = index === 0 && 1 && 2 && 3 && 4 && 5 && 7 && 8 && 9 && 10 && 11;
        const stickyClass = classNames({
            'sticky-header': (isFirstColumn && stickyFirstColumn) || (isLastColumn && stickyLastColumn),
            'sticky-column': (isFirstColumn && stickyFirstColumn) || (isLastColumn && stickyLastColumn),
            'sticky-left': isFirstColumn && stickyFirstColumn,
            'sticky-right': isLastColumn && stickyLastColumn,
            'show-shadow': (isFirstColumn && showLeftShadow) || (isLastColumn && showRightShadow),
        });

        return cloneElement(element, {
            className: classNames(element.props.className, stickyClass)
        });
    }

    const processRow = (row: ReactElement, isHeader: boolean): ReactElement => {
        const cells = React.Children.toArray(row.props.children);
        const processedCells = cells.map((cell, index) => 
            isValidElement(cell) ? addStickyClass(cell, index, cells.length) : cell
        );

        return cloneElement(row, {
            className: classNames(row.props.className)
        }, ...processedCells);
    }

    const processChildren = (children: ReactNode): ReactNode => {
        return React.Children.map(children, child => {
            if (!isValidElement(child)) return child;

            if (child.type === 'thead') {
                const rows = React.Children.toArray(child.props.children);
                const processedRows = rows.map(row => 
                    isValidElement(row) ? processRow(row, true) : row
                );

                return cloneElement(child, {}, ...processedRows);
            }

            if (child.type === 'tbody') {
                const rows = React.Children.toArray(child.props.children);
                const processedRows = rows.map(row => 
                    isValidElement(row) ? processRow(row, false) : row
                );

                return cloneElement(child, {}, ...processedRows);
            }

            return child;
        });
    }

    return (
        <div className={wrapperClass}>
            <style>{stickyColumnStyles}</style>
            <Component className={tableClass} {...rest} ref={ref}>
                {processChildren(children)}
            </Component>
        </div>
    )
})

Table.displayName = 'Table'

export default Table