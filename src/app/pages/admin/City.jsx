import React, { useMemo, useState, useCallback, useEffect } from "react";
import {importCity,addCity,updateCity,delCity,} from "../../services/city/ActionCity";
import { VirtualizedTable } from "@/app/components/tables/VirtualizedTable";
import { TableActionBar } from "@/app/components/tables/TableActionBar";
import { TableSheetMenu } from "@/app/components/tables/TableSheetMenu";
import { CrudDialog } from "@/app/components/tables/CrudDialog";
import { TableFooter } from "@/app/components/tables/TableFooter";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ArrowUpDown } from "lucide-react";

const City = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const [cities, setCities] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [visibleCount, setVisibleCount] = useState(0);

	const fetchData = useCallback(
		async (signal) => {
			try {
				const response = await importCity(userData.token, { signal });
				if (response.data.auth === true) {
					setCities(response.data.res || []);
				} else {
					localStorage.clear();
					navigate("/auth");
				}
			} catch (error) {
				if (error.name === "AbortError") {
					setError(error);
				}
			} finally {
				setIsLoading(false);
			}
		},
		[navigate, userData.token]
	);

	const handleDeleteCity = useCallback(async (deleteCityData) => {
		const newdeleteCityData = {
			id: deleteCityData.id,
			name: deleteCityData.name,
		};
		try {
			const response = await delCity(userData.token, newdeleteCityData);
			if (response.data.deleted === true) {
				toast.success(`Город ${deleteCityData.name} успешно удален`);
				setTimeout(() => {
					window.location.reload();
				}, 500);
			} else {
				toast.error("Удаление города не удалось");
			}
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.clear();
				navigate("/auth");
			}
		}
	}, [navigate, userData.token]);

	const handleEditCity = useCallback(async (editCityData) => {
		try {
			console.log("Updating city:", editCityData);
			const response = await updateCity(userData.token, editCityData);
			if (response.data.updated === true) {
				toast.success(`City ${editCityData.name} is Updated`);
				fetchData();
			} else {
				toast.error("Error updating network");
			}
		} catch (error) {
			console.error("Error updating network:", error);
			toast.error("Error updating network");
		}
	}, [userData.token, fetchData]);


	useEffect(() => {
		const controller = new AbortController();
		fetchData(controller.signal);
		return () => controller.abort();
	}, [fetchData]);

	const filteredCity = useMemo(() => {
		if (!searchValue) return cities;
		return cities.filter((city) =>
			city.name.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [cities, searchValue]);

	const columns = useMemo(() => [
		{ header: "ID", accessorKey: "id" },
		{ accessorKey: "name",
			header: ({ column }) => (
				<button className="flex items-center gap-2 hover:text-primary transition-colors w-full uppercase" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Name
					<ArrowUpDown size={17} />
				</button>
			),
			cell: ({ row }) => (
				<TableSheetMenu 
					triggerChildren={<span className="cursor-context-menu">{row.original.name}</span>}
					menuItems={[
						{ name: "name", label: "Name", required: true },
						{ name: "short_name", label: "Short name", required: true },
					]}
					initialData={row.original}
					onDelete={() => handleDeleteCity(row.original)}
					onSubmit={(data) => handleEditCity(data)}
				/>
			),
			sortingFn: (a, b) => { return a.original.name.localeCompare(b.original.name, undefined, { sensitivity: "base" } )},
			enableSorting: true
		},
		{ accessorKey: "short_name", header: "Short name" },
	], [handleDeleteCity, handleEditCity]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const handleAddCity = async (newCityData) => {
		try {
			const response = await addCity(userData.token, newCityData);
			if (response.data.added === true) {
				setIsAddDialogOpen(false);
				toast.success(`Город ${newCityData.name} успешно добавлен`);
				fetchData();
			} else {
				toast.error("Добавление города не удалось");
			}
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.clear();
				navigate("/auth");
			}
		}
	};

	return (
		<div className="relative w-[99%] h-screen max-h-[95%] p-6 bg-card border border-border rounded-lg shadow-md mt-5 mb-8 m-auto flex flex-col">
			<div className="flex justify-between mb-5">
				<div className="grid grid-cols-2 items-center">
					<label htmlFor="" className="text-left ml-2 font-medium">
						Поиск города:{" "}
					</label>
					<input
						type="text"
						placeholder="name"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="block px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-secondary-foreground border-border focus:border-accent focus:outline-none focus:ring-0 peer"
					/>
				</div>
				<div>
					<TableActionBar onAdd={() => setIsAddDialogOpen(true)} />
				</div>
			</div>

			<VirtualizedTable
				columns={columns}
				data={filteredCity}
				columnPercentages={["6%", "47%", "47%"]}
				onVisibleRowsChange={setVisibleCount}
				rowHeight={50}
				visibleCount={25}
			/>

			<CrudDialog
				isOpen={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
				title="Add New City"
				fields={[
					{ name: "name", label: "Name", placeholder:"Пермь", required: true },
					{ name: "short_name", label: "Short name", placeholder:"perm", required: true },
				]}
				onSubmit={handleAddCity}
				onCancel={() => setIsAddDialogOpen(false)}
			/>

			<TableFooter
				// selectedCount={selectedRows.length}
				totalCount={filteredCity.length}
				visibleCount={visibleCount}
			/>
			<Toaster richColors position="bottom-right" />
		</div>
	);
};

export default City;
