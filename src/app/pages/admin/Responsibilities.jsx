import React, { useMemo, useState, useCallback, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { importResponsibilities, addResponsibilities, delResponsibilities, updateResponsibilities} from "../../services/networks/ActionNetworks";
import { VirtualizedTable } from "@/app/components/tables/VirtualizedTable";
import { TableActionBar } from "@/app/components/tables/TableActionBar";
import { TableSheetMenu } from "@/app/components/tables/TableSheetMenu";
import { CrudDialog } from "@/app/components/tables/CrudDialog";
import { TableFooter } from "@/app/components/tables/TableFooter";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";


const Responsibilities = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const [responsibilities, setResponsibilities] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [visibleCount, setVisibleCount] = useState(0);

	const fetchData = useCallback(async (signal) => {
		try {
			const response = await importResponsibilities(userData.token, { signal });
			if (response.data.auth === true) {
				setResponsibilities(response.data.res || []);
			} else {
				localStorage.clear();
				navigate('/auth');
			}
		} catch (error) {
			if (error.name === 'AbortError') {
				setError(error);
			}
		} finally {
			setIsLoading(false);
		}
	}, [navigate, userData.token]);

	const handleDeleteResponsibility = useCallback(async (deleteRespData) => {
		try {
			const response = await delResponsibilities(userData.token, deleteRespData);
			if (response.data.deleted === true) {
				toast.success(`Responsibility ${deleteRespData.name} is Deleted`);
				fetchData();
			} else {
				toast.error(`Responsibility ${deleteRespData.name} is not Deleted`);
			}
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.clear();
				navigate('/auth');
			}
		}
	}, [fetchData, navigate, userData.token]);

	const handleUpdateResponsibility = useCallback(async (editedResponsibility) => {
		try {
			const response = await updateResponsibilities(userData.token, editedResponsibility);
			if (response.data.updated === true) {
				toast.success(`Responsibility ${editedResponsibility.name} is Updated`);
				fetchData();
			} else {
				toast.error(`Responsibility ${editedResponsibility.name} is not Updated`);
			}
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.clear();
				navigate('/auth');
			}
		}
	}, [fetchData, navigate, userData.token]);
	
	const handleAddResponsibility = async (newResponsibilityData) => {
		try {
			const response = await addResponsibilities(userData.token, newResponsibilityData);
			if (response.data.added === true) {
				toast.success(`Responsibility ${newResponsibilityData.name} is Added`);
				fetchData();
			} else {
				toast.error("Error adding responsibility");
			}
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.clear();
				navigate("/auth");
			}
			toast.error("Error adding responsibility");
		}
	};

	const filteredResponsibilities = useMemo(() => {
		if (!searchValue) return responsibilities;
		return responsibilities.filter((responsibility) =>
			responsibility.name.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [responsibilities, searchValue]);

	useEffect(() => {
		const controller = new AbortController();
		fetchData(controller.signal);
		return () =>{ controller.abort();}
	}, [fetchData]);

	const columns = useMemo(() => [
		{ accessorKey: "id", header: "ID" },
		{ accessorKey: "name", header: "Name",
			cell: ({row}) => (
				<TableSheetMenu
					triggerChildren={<span className="cursor-context-menu">{row.original.name}</span>}
					menuItems={[
						{ name: "name", label: "Name", placeholder:"Name", required: true },
						{ name: "short_name", label: "Short Name", placeholder:"Short Name", required: true },
					]}
					initialData={row.original}
					onDelete={() => handleDeleteResponsibility(row.original)}
					onSubmit={(data) => handleUpdateResponsibility(data)}
				/>
			),
		},
		{ accessorKey: "short_name", header: "Short Name" }
	], [handleDeleteResponsibility, handleUpdateResponsibility]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="relative w-[99%] h-[calc(100vh-100px)] p-6 bg-card border border-border rounded-lg shadow-md mt-5 mb-8 m-auto flex flex-col">
			<div className="flex justify-between mb-5">
				<div className="grid grid-cols-2 items-center">
					<label htmlFor="" className="text-left ml-2 font-medium">
						Поиск responibility:{" "}
					</label>
					<input
						type="text"
						placeholder="name responsibility"
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
				data={filteredResponsibilities}
				columnPercentages={["10%", "45%", "45%"]}
				onVisibleRowsChange={setVisibleCount}
				rowHeight={50}
				visibleCount={25}
			/>

			<CrudDialog
				isOpen={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
				title="Add New Responsibility"
				fields={[
					{ label: "Name", name: "name" },
					{ label: "Short Name", name: "short_name" }
					]}
				onSubmit={handleAddResponsibility}
				onCancel={() => setIsAddDialogOpen(false)}

			/>

			<TableFooter
				visibleCount={visibleCount}
				totalCount={responsibilities.length}
			/>

			<Toaster richColors position="bottom-right" />
		</div>
	);
};

export default Responsibilities;