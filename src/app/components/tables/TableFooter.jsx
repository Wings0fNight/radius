import React from "react";

export const TableFooter = ({ 
	selectedCount,
	visibleCount,
	totalCount,
  }) => {

	const selectVisible = (selectedCount) => {
		if (!selectedCount) {
			return null;
		} else {
			return (
				<div>Выбрано: {selectedCount}</div>
			)
		}
	};
	
	return (
	  <div className="flex justify-between items-center mt-4 text-sm">
		<div>
			Показано {visibleCount} из {totalCount} 
		</div>
		{selectVisible(selectedCount)}
	  </div>
	);
  };