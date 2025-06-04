import React, { useMemo, useState, useCallback, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { importTacacsGroups, updateTacacsGroups, delTacacsGroups, addTacacsGroups } from "../../services/permisions/ActionTacacsGroup";
import { VirtualizedTable } from "@/app/components/tables/VirtualizedTable";
import { TableActionBar } from "@/app/components/tables/TableActionBar";
import { CrudDialog } from "@/app/components/tables/CrudDialog";
import { TableFooter } from "@/app/components/tables/TableFooter";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { TableSheetMenu } from '@/app/components/tables/TableSheetMenu';

const TacacsGroups = () => {
    const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const [ tacacsGroups, setTacacsGroups] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [visibleCount, setVisibleCount] = useState(0);

    const fetchData = useCallback(async (signal) => {
		try {
			const response = await importTacacsGroups(userData.token, { signal });
			if (response.data.auth === true) {
				setTacacsGroups(response.data.res || []);
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

    const handleDeleteTacacsGroups = useCallback(async (deleteTacacsGroupData) => {
        try {
            const response = await delTacacsGroups(userData.token, deleteTacacsGroupData);
            if (response.data.deleted === true) {
                toast.success(`Tacacs group ${deleteTacacsGroupData.name} is Deleted`);
                fetchData();
            } else {
                toast.error(`Tacacs group ${deleteTacacsGroupData.name} is not Deleted`);
            }
        } catch {
            console.log("Error deleting Tacacs group");
        }
    }, [fetchData, userData.token]);
    
    const handleUpdateTacacsGroups = useCallback(async (editedSitesData) => {
        try {
            const response = await updateTacacsGroups(userData.token, editedSitesData);
            if (response.data.updated === true) {
                toast.success(`Sites ${editedSitesData.name} is Updated`);
                fetchData();
            } else {
                toast.error(`Sites ${editedSitesData.name} is not Updated`);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate('/auth');
            }
        }
    }, [fetchData, navigate, userData.token]);

    const filteredSites = useMemo(() => {
		if (!searchValue) return tacacsGroups;
		return tacacsGroups.filter((sites) =>
			sites.address.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [tacacsGroups, searchValue]);

    useEffect(() => {
		const controller = new AbortController();
		fetchData(controller.signal);
		return () =>{ controller.abort();}
	}, [fetchData]);

    const columns = useMemo(() => [
        { header: "ID", accessorKey: "id" },
        { header: "Name", accessorKey: "name",
            cell: ({ row }) => (
                <TableSheetMenu 
                    triggerChildren={<span className="cursor-context-menu">{row.original.name}</span>}
                    menuItems={[
                        { name: "name", label: "Name", required: true},
                        { name: "description", label: "Description", required: false},
                        { name: "code", label: "Code", required: false, type: "code"},
                    ]}
                    initialData={row.original}
                    onDelete={() => handleDeleteTacacsGroups(row.original)}
                    onSubmit={(data) => handleUpdateTacacsGroups(data)}
                />
            )
        },
        { header: "Description", accessorKey: "description" }
    ], [handleDeleteTacacsGroups, handleUpdateTacacsGroups]);

    if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

    const handleAddTacacsGroup = async (newTrustIpData) => {
        try {
			const response = await addTacacsGroups(userData.token, newTrustIpData);
			if (response.data.added === true) {
				setIsAddDialogOpen(false);
				toast.success(`Tacacs Group ${newTrustIpData.address} is Added`);
				fetchData();
			} else {
				toast.error("Error adding tacacs group");
			}
		} catch {
			toast.error("Error adding tacacs group");
		}
    };

    return (
        <div className="relative w-[99%] h-[calc(100vh-100px)] p-6 bg-card border border-border rounded-lg shadow-md mt-5 mb-8 m-auto flex flex-col">
            <div className="flex justify-between mb-5">
                <div className="grid grid-cols-2 items-center">
                    <label htmlFor="" className="text-left ml-2 font-medium">
                        Поиск группы:{" "}
                    </label>
                    <input
                        type="text"
                        placeholder="group name"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="block px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-secondary-foreground border-border focus:border-accent focus:outline-none focus:ring-0 peer"
                    />
                </div>
                <div>
                    <TableActionBar onAdd={() => setIsAddDialogOpen(true)} />
                </div>
            </div>

            <CrudDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                title="Add New Tacacs Group"
                fields={[
                    { label: "Name", name: "name" },
                    { label: "Description", name: "description" },
                    { label: "Code", name: "code" },
                    ]}
                onSubmit={handleAddTacacsGroup}
                onCancel={() => setIsAddDialogOpen(false)}

            />

            <VirtualizedTable
                columns={columns}
                data={filteredSites}
                columnPercentages={["10%", "45%", "45%"]}
                onVisibleRowsChange={setVisibleCount}
                rowHeight={50}
                visibleCount={25}
            />

            <TableFooter
                visibleCount={visibleCount}
                totalCount={tacacsGroups.length}
            />

            <Toaster richColors position="bottom-right" />
        </div>
    )
}

export default TacacsGroups;