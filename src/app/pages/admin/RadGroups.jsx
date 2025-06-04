import React, { useMemo, useState, useCallback, useEffect} from 'react';
import { importGroups, addGroups, updateGroups, deleteGroups } from '../../services/users/ActionsRadUsers';
import { VirtualizedTable } from '@/app/components/tables/VirtualizedTable';
import { TableSheetMenu } from "@/app/components/tables/TableSheetMenu";
import { TableActionBar } from '@/app/components/tables/TableActionBar';
import { CrudDialog } from '@/app/components/tables/CrudDialog';
import { TableFooter } from '@/app/components/tables/TableFooter';
import { useNavigate } from 'react-router-dom';
import { Trash, ArrowUpDown, CircleMinus, CircleCheck, Plus, ArrowDown } from 'lucide-react'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

const RadGroups = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const [groups, setGroups ] = useState([]);
	const [rowSelection, setRowSelection] = useState({});
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [visibleCount, setVisibleCount] = useState(0);
	
	const feachData = useCallback(async (signal) => {
		try {
			const response = await importGroups(userData.token, { signal });
			if (response.data.auth === true) {
				setGroups(prev => [...(response.data.res || [])]);
				setRowSelection({});
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

	const filteredGroups = useMemo(() => {
		if (!searchValue) return groups;
		return groups.filter(robot => 
		  robot.name.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [groups, searchValue]);

	useEffect(() => {
		const controller = new AbortController();
		feachData(controller.signal);
		return () =>{ controller.abort();}
	}, [feachData]);

	const handleDeleteGroup = useCallback(async (deleteGroupData) => {
		try {
			const response = await deleteGroups(userData.token, deleteGroupData);
			if (response.data.deleted === true) {
				toast.success(`Группа ${deleteGroupData.name} успешно удалена`);
				feachData();
			} else {
				toast.error("Удаление группы не удалось");
			}
		} catch (error) {
			console.error("Error deleting group:", error);
			toast.error("Ошибка при удалении группы");
		}
	}, [feachData, userData.token]);

    const handleUpdateGroups = useCallback(async (editGroups) => {
        try {
            const response = await updateGroups(userData.token, editGroups);
            if (response.data.updated === true) {
                toast.success(`Group ${editGroups.name} is Updated`);
                feachData();
            } else {
                toast.error(`Group ${editGroups.name} is not Updated`);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate('/auth');
            }
        }
    }, [feachData, navigate, userData.token]);

	const columns = useMemo(() => [
		{
			accessorKey: 'id',
			header: 'ID'
		},
		{
			accessorKey: 'name',
			header: ({column }) => (
				<button className="flex items-center gap-2 hover:text-primary transition-colors w-full uppercase" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
					Name
					<ArrowUpDown size={17} />
				</button>
			),
			cell: ({ row }) => (
				<TableSheetMenu 
				    triggerChildren={<span className="cursor-context-menu">{row.original.name}</span>}
					menuItems={[
						{name: "name", label: "Name", required: true, disabled: false},
                        {name: "description", label: "Description", required: true, disabled: false},
                        {name: "ad_group", label: "AD Group", required: true, disabled: false},
                        {name: "ad_ou", label: "AD OU", required: true, disabled: false},
                        {name: "ad_sync", label: "AD Sync", required: true, disabled: false},
					]}
					initialData={row.original}
					onSubmit={(data) => {handleUpdateGroups(data);}}
					onDelete={() => handleDeleteGroup(row.original)}
				/>
			),
			sortingFn: (a, b) => {
				return a.original.name.localeCompare(
				b.original.name, 
				undefined, 
				{ sensitivity: 'base' }
				);
			},
			enableSorting: true,
		},
		{
			accessorKey: 'description',
			header: 'Description'
		},
		{
            accessorKey: 'ad_group',
            header: 'AD Group',
        },
        {
            accessorKey: 'ad_ou',
            header: 'AD OU',
        },
        {
            accessorKey: 'ad_sync',
            header: 'AD Sync',
        }
	], [handleUpdateGroups, handleDeleteGroup]);
	
	if (isLoading) {
		return <div>Loading...</div>;
	}
	
	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const handleAddGroup = async (newGroupData) => {
		const newUser = {
		  ...newGroupData,
		};
		console.log('New group:', newUser);
		
		try {
			const response = await addGroups(userData.token, newUser);
			if (response.data.added === true) {
				setIsAddDialogOpen(false);
				toast.success(`Робот ${newUser.name} успешно добавлен`);
				feachData();
			} else {
				toast.error("Добавление робота не удалось");
			}
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.clear();
				navigate('/auth');
			}
		}
	};

	return (
		<div className="relative w-[99%] h-[calc(100vh-100px)] p-6 bg-card border border-border rounded-lg shadow-md mb-10 mt-2 m-auto flex flex-col">
			<div className='flex justify-between mb-5'>
				<div className='grid grid-cols-2 items-center'>
 					<label htmlFor="" className='text-left ml-2 font-medium'>Поиск группы: </label>
 					<input  
						type="text" 
						placeholder="group name"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="ml-2 block px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-secondary-foreground border-border focus:border-accent  focus:outline-none focus:ring-0 peer" 
					/>
 				</div>
				<div>
					<TableActionBar
						onAdd={() => setIsAddDialogOpen(true)}
						addButtonLabel={<span className='flex items-center'><Plus className='mr-1'/>Group</span>}
					/>
				</div>
			</div>

			<VirtualizedTable
				rowSelection={rowSelection}
				onRowSelectionChange={setRowSelection}
				columns={columns}
				data={filteredGroups}
				columnPercentages={['5%', '20%', '45%', '10%', '10%', '10%',]}
				onVisibleRowsChange={setVisibleCount}
				rowHeight={50}
				visibleCount={25}
			/>

			<CrudDialog
				isOpen={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
				title="Add New Group"
				fields={[
					{ name: 'name', label: 'Name', placeholder:"robot", required: true },
					{ name: 'description', label: 'Description', placeholder:"description", required: true },
                    { name: 'ad_group', label: 'AD Group', placeholder:"ad_group", required: false },
                    { name: 'ad_ou', label: 'AD OU', placeholder:"ad_ou", required: false },
                    { name: 'ad_sync', label: 'AD Sync', placeholder:"ad_sync", required: false },
				]}
				onSubmit={handleAddGroup}
				onCancel={() => setIsAddDialogOpen(false)}
			/>

			<TableFooter 
				selectedCount={Object.keys(rowSelection).length}
				totalCount={filteredGroups.length}
				visibleCount={visibleCount}
			/>
			<Toaster richColors position="bottom-right" />
		</div>
	);		
};

export default RadGroups;
