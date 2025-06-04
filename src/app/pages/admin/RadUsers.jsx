import React, { useMemo, useState, useCallback, useEffect} from 'react';
import { importUsers, addUser, updateStatusUser, deleteUser } from '../../services/users/ActionsRadUsers';
import { VirtualizedTable } from '@/app/components/tables/VirtualizedTable';
import { TableSheetMenu } from "@/app/components/tables/TableSheetMenu";
import { TableActionBar } from '@/app/components/tables/TableActionBar';
import { CrudDialog } from '@/app/components/tables/CrudDialog';
import { TableFooter } from '@/app/components/tables/TableFooter';
import { useNavigate } from 'react-router-dom';
import { Trash, ArrowUpDown, CircleMinus, CircleCheck, Plus, ArrowDown } from 'lucide-react'
import {Sheet,SheetContent,SheetDescription,SheetFooter,SheetHeader,SheetTitle} from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const RadUsers = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const [users, setUsers] = useState([]);
	const [rowSelection, setRowSelection] = useState({});
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [visibleCount, setVisibleCount] = useState(0);
	const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
	
	const feachData = useCallback(async (signal) => {
		try {
			const response = await importUsers(userData.token, { signal });
			if (response.data.auth === true) {
				setUsers(prev => [...(response.data.res || [])]);
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

	const filteredUsers = useMemo(() => {
		if (!searchValue) return users;
		return users.filter(user => 
		  user.name.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [users, searchValue]);

	useEffect(() => {
		const controller = new AbortController();
		feachData(controller.signal);
		return () =>{ controller.abort();}
	}, [feachData]);

	const handleToggleStatus = useCallback(async (user) => {
		const updateData = {
			id: user.id,
			name: user.name,
			enabled: user.enabled,
			dt_lastlogin: user.dt_lastlogin
		};

		try {
			console.log('API: updateData received:', updateData);
			const response = await updateStatusUser(userData.token, updateData);
			if (response.data.updated === true) {
				toast.success(`Пользователь ${user.name} ${updateData.enabled === 'True' ? 'включен' : 'выключен'}`);
				feachData();
			} else {
				toast.error("User update failed");
			}
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.clear();
				navigate('/auth');
			}
		}
	}, [navigate, userData.token, feachData]);

	const handleDeleteUser = useCallback(async (deleteUserData) => {
		try {
			const newDeleteUserData = {
				id: deleteUserData.id,
				name: deleteUserData.name
			}
			const response = await deleteUser(userData.token, newDeleteUserData);
			if (response.data.deleted === true) {
				toast.success(`Пользователь ${deleteUserData.name} успешно удален`);
				setTimeout(() => {
					window.location.reload();
				}, 500);
			} else {
				toast.error("Удаление пользователя не удалось");
			}
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Ошибка при удалении пользователя");
		}
	}, [userData.token]);

	const handlePasswordChange = useCallback(async(data) => {

		console.log('Password change initiated for user:', data.name );
		// if (newPassword && editingUser) {
		//   // Здесь должна быть логика обновления пароля
		toast.success(`Password ${data.name} updated successfully`);
		//   setIsPasswordDialogOpen(false);
		//   setNewPassword('');
		// }
	}, []);

	const getRowId = useCallback((row) => row.id.toString(), []);

	const columns = useMemo(() => [
		{
			accessorKey: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllRowsSelected()}
					indeterminate={table.getIsSomeRowsSelected()}
					onCheckedChange={table.toggleAllRowsSelected}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={row.toggleSelected}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false
		},
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
						{name: "name", label: "Name", required: true, disabled: true},
						{name: "email", label: "Email", required: true, disabled: false},
						{type: "switch", label: "Status", name: "enabled", required: true,},
						{
							type: "button",
							label: "Change password user",
							name: "changePassword",
							descr: "Change",
							onClick: handlePasswordChange
						},
					]}
					initialData={row.original}
					onSubmit={(data) => {handleToggleStatus(data);}}
					onDelete={() => handleDeleteUser(row.original)}
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
			accessorKey: 'email',
			header: 'Email'
		},
		{
			accessorKey: 'dt_lastlogin',
			header: 'Last Login'
		},
		{
			accessorKey: 'enabled',
			header: 'Status',
			cell: ({ row }) => {
				if (row.original.enabled === "True") {
					return (
						<div className="flex items-center gap-2">
							<CircleCheck color='green' size={17}/>
							<span>Enabled</span>
						</div>
					)
				} else {
					return (
						<div className="flex items-center gap-2">
							<CircleMinus color='red' size={17}/>
							<span>Disabled</span>
						</div>
					)
				}
			}
		},
	], [handleToggleStatus, handleDeleteUser, handlePasswordChange]);

	const selectedUsers = useMemo(() => {
		return filteredUsers.filter(user => rowSelection[user.id]);
	}, [filteredUsers, rowSelection]);
	
	const majorityStatus = useMemo(() => {
		if (selectedUsers.length === 0) {
			return 'enable';
		}

		const enabledCount = selectedUsers.filter(user => user.enabled === 'True').length;

		return enabledCount > selectedUsers.length / 2 ? 'disable' : 'enable';
	}, [selectedUsers]);

	const handleBulkStatusChange = useCallback(async () => {
		const newStatus = majorityStatus === 'enable' ? 'True' : 'False';
	  
		try {
			const updatePromises = selectedUsers.map(user => {
				const updateData = {
					id: user.id,
					name: user.name,
					enabled: newStatus,
					dt_lastlogin: user.dt_lastlogin
				};
				
				console.log('API bulk updateData:', updateData);
				
				return updateStatusUser(userData.token, updateData);
			});
	  
			const responses = await Promise.all(updatePromises);

			const successfulUpdates = responses.filter(
				response => response.data.updated === true
			).length;
		
			if (successfulUpdates > 0) {
				toast.success(`Обновлено ${successfulUpdates}/${selectedUsers.length} пользователей`);
				feachData();
				setRowSelection({});
			}
		setIsActionMenuOpen(false);
	  
		} catch (error) {
			console.error('Ошибка массового обновления:', error);
			toast.error(`Ошибка при обновлении: ${error.message}`);
		}
	}, [selectedUsers, majorityStatus, userData.token, feachData]);

	const handleBulkDelete = useCallback(async () => {
		try {
			const updatePromises = selectedUsers.map(user => {
				const updateData = {
					id: user.id,
					name: user.name,
				};
				
				console.log('API bulk updateData:', updateData);
				
				return deleteUser(userData.token, updateData);
			});
	  
			const responses = await Promise.all(updatePromises);

			const successfulDeletes = responses.filter(
				response => response.data.deleted === true
			).length;
		
			if (successfulDeletes > 0) {
				toast.success(`Удалено ${successfulDeletes}/${selectedUsers.length} пользователей`);
				feachData();
				setRowSelection({});
			}
		setIsActionMenuOpen(false);
	  
		} catch (error) {
			console.error('Ошибка массового удаления:', error);
			toast.error(`Ошибка при удалении: ${error.message}`);
		}
	}, [selectedUsers, userData.token, feachData]);

	
	if (isLoading) {
		return <div>Loading...</div>;
	}
	
	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const handleAddUser = async (newUserData) => {
		const newUser = {
		  ...newUserData,
		  enabled: true
		};
		console.log('New user:', newUser);
		
		try {
			const response = await addUser(userData.token, newUser);
			if (response.data.added === true) {
				setIsAddDialogOpen(false);
				toast.success(`Пользователь ${newUser.name} успешно добавлен`);
				feachData();
			} else {
				toast.error("Добавление пользователя не удалось");
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
			<Sheet open={isActionMenuOpen} onOpenChange={setIsActionMenuOpen}>
				<SheetContent className="bg-card border-accent-foreground">
					<SheetHeader>
						<SheetTitle>Массовые операции</SheetTitle>
						<SheetDescription>Выбано {selectedUsers.length} пользователея(ей)</SheetDescription>
					</SheetHeader>
					<div className='grid grid-cols-2 gap-4 py-4 m-2'>
						<Button
							variant={
								majorityStatus === 'enable' ? 'accept' : 'remove'
							}
							onClick={handleBulkStatusChange}
							className='flex gap-2'
						>
							{majorityStatus === 'enable' ? (
								<>
									<CircleCheck color='white' size={17}/>
									<span>Включить</span>
								</>
							) : (
								<>
									<CircleMinus color='white' size={17}/>
									<span>Выключить</span>
								</>
							)}
						</Button>
						<Button
							variant='remove'
							onClick={handleBulkDelete}
							className='flex gap-2'
						>
							<Trash color='white' size={17}/>
							<span>Удалить</span>
						</Button>
					</div>
					<SheetFooter>
						<Button onClick={() => setIsActionMenuOpen(false)} className='text-white'>Отмена</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
			<div className='flex justify-between mb-5'>
				<div className='grid grid-cols-2 items-center'>
 					<label htmlFor="" className='text-left ml-2 font-medium'>Поиск пользователя: </label>
 					<input  
						type="text" 
						placeholder="username"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="ml-2 block px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-secondary-foreground border-border focus:border-accent  focus:outline-none focus:ring-0 peer" 
					/>
 				</div>
				<div>
					<TableActionBar
						onAdd={() => selectedUsers.length > 1 ? setIsActionMenuOpen(true) : setIsAddDialogOpen(true)}
						addButtonLabel={
							selectedUsers.length > 1 ? <span className='flex items-center'>Action <ArrowDown /></span> : <span className='flex items-center'><Plus className='mr-1'/>User</span>
						}
					/>
				</div>
			</div>

			<VirtualizedTable
				rowSelection={rowSelection}
				onRowSelectionChange={setRowSelection}
				getRowId={getRowId}
				columns={columns}
				data={filteredUsers}
				columnPercentages={['4%', '5%', '26%', '30%', '25%', '10%']}
				onVisibleRowsChange={setVisibleCount}
				rowHeight={50}
				visibleCount={25}
			/>

			<CrudDialog
				isOpen={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
				title="Add New User"
				fields={[
					{ name: 'name', label: 'Name', placeholder:"ivanov.ii", required: true },
					{ name: 'email', label: 'Email', type: 'email', placeholder:"ivan.ivanov@dom.ru", required: true },
					{ name: 'password', label: 'Password', type: 'password', required: true },
				]}
				onSubmit={handleAddUser}
				onCancel={() => setIsAddDialogOpen(false)}
			/>

			<TableFooter 
				selectedCount={Object.keys(rowSelection).length}
				totalCount={filteredUsers.length}
				visibleCount={visibleCount}
			/>
			<Toaster richColors position="bottom-right" />
		</div>
	);		
};

export default RadUsers;
