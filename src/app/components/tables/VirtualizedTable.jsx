import React, { useRef, useEffect, useState } from "react";
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const VirtualizedTable = ({
	columns,
	data,
	columnPercentages = ["20%", "20%", "20%", "20%", "20%"],
	rowHeight = 50,
	overscan = 10,
	onVisibleRowsChange,
	onRowClick,
	rowSelection,
	onRowSelectionChange,
	getRowId,
}) => {
	const tableContainerRef = useRef(null);
	// const [rowSelection, setRowSelection ] = useState({});

	const table = useReactTable({
		data,
		columns,
		getRowId,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			rowSelection,
		},
		onRowSelectionChange,
	});

	const { rows } = table.getRowModel();

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => tableContainerRef.current,
		estimateSize: () => rowHeight,
		overscan,
	});

	const virtualRows = rowVirtualizer.getVirtualItems();
	const totalHeight = rowVirtualizer.getTotalSize();
	const maxContainerHeight = Math.min(window.innerHeight * 0.8, totalHeight);
	const containerHeight = Math.min(maxContainerHeight, totalHeight);

	const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
	const paddingBottom =
		virtualRows.length > 0
			? totalHeight - (virtualRows[virtualRows.length - 1]?.end || 0)
			: 0;

	useEffect(() => {
		if (onVisibleRowsChange) {
			const visible = virtualRows.length;
			onVisibleRowsChange(visible > 35 ? 35 : visible);
		}
	}, [virtualRows, onVisibleRowsChange]);

	return (
		<div
			ref={tableContainerRef}
			className="flex-1 overflow-auto"
			style={{
				height: `${containerHeight}px`,
				overflowY: "auto",
				position: "relative",
			}}
		>
			<Table className="w-full">
				<TableHeader className="top-0 z-10 bg-muted-foreground [&_tr:hover]:bg-muted-foreground">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow
							key={headerGroup.id}
							className="uppercase text-left"
							style={{
								display: "grid",
								gridTemplateColumns:
									columnPercentages.join(" "),
							}}
						>
							{headerGroup.headers.map((header, index) => (
								<TableHead
									key={header.id}
									className="flex items-center text-popover"
									style={{ width: columnPercentages[index] }}
								>
									{flexRender(
										header.column.columnDef.header,
										header.getContext()
									)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>

				<TableBody
					style={{
						height: `${totalHeight}px`,
						position: "relative",
					}}
				>
					{virtualRows.map((virtualRow) => {
						const row = rows[virtualRow.index];
						return (
							<TableRow
								key={row.id}
								className="w-full"
								style={{
									position: "absolute",
									width: "100%",
									height: `${virtualRow.size}px`,
									transform: `translateY(${virtualRow.start}px)`,
									display: "grid",
									gridTemplateColumns:
										columnPercentages.join(" "),
								}}
								onClick={() =>
									onRowClick && onRowClick(row.original)
								}
							>
								{row.getVisibleCells().map((cell, index) => (
									<TableCell
										key={cell.id}
										className="flex items-center"
										style={{
											width: columnPercentages[index],
										}}
									>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						);
					})}

					{paddingBottom > 0 && (
						<tr style={{ height: `${paddingBottom}px` }} />
					)}
				</TableBody>
			</Table>
		</div>
	);
};
