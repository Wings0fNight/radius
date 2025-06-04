import React from "react";
import { Button } from "@/components/ui/button";

export const TableActionBar = ({ 
	onAdd,
	addButtonLabel = "Add New",
 }) => {
	return (
		<div className="flex items-center justify-center ">
			<Button className="text-primary-foreground" onClick={onAdd}>{addButtonLabel}</Button>
		</div>
	);
};