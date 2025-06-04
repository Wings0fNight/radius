import React, { useMemo, useState, useCallback, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { importPermisions, updatePermisions, delPermisions, addPermisions } from "../../services/permisions/ActionPermisions";
import { importResponsibilities} from "../../services/networks/ActionNetworks";
import { importTacacsGroups } from '@/app/services/permisions/ActionTacacsGroup';
import { VirtualizedTable } from "@/app/components/tables/VirtualizedTable";
import { TableActionBar } from "@/app/components/tables/TableActionBar";
import { CrudDialog } from "@/app/components/tables/CrudDialog";
import { TableFooter } from "@/app/components/tables/TableFooter";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { TableSheetMenu } from '@/app/components/tables/TableSheetMenu';

const Permisions = () => {
    const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const [permisions, setPermisions] = useState([]);
    const [respons, setRespons] = useState([]);
    const [tacacsGroup, setTacacsGroup] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [visibleCount, setVisibleCount] = useState(0);

    const fetchData = useCallback(async (signal) => {
		try {
			const responsePermision = await importPermisions(userData.token, { signal });
            const responseResponsibilities = await importResponsibilities(userData.token, { signal });
            const responseTacacsGroup = await importTacacsGroups(userData.token, { signal });
            const preparedPermisions = responsePermision.data.res.map((permision) => {
                const responsibility = responseResponsibilities.data.res.find((res) => res.id === permision.responsibility_id);
                const tacacsGroup = responseTacacsGroup.data.res.find((tacacsGroup) => tacacsGroup.id === permision.tacacsgroup_id);
                return {
                    ...permision,
                    responsibility: responsibility ? responsibility.name : "",
                    tacacsGroup: tacacsGroup ? tacacsGroup.name : "None",                    
                };
            });
            setPermisions(preparedPermisions);
            setRespons(responseResponsibilities.data.res || []);
            setTacacsGroup(responseTacacsGroup.data.res || []);
		} catch (error) {
			if (error.name === 'AbortError') {
				setError(error);
			}
		} finally {
			setIsLoading(false);
		}
	}, [userData.token]);

    const handleDeletePermision = useCallback(async (deletePermisionData) => {
        const newDeletePermisionData = {
            id: deletePermisionData.id,
            name: deletePermisionData.name,
            description: deletePermisionData.description,
            responsibility_id: deletePermisionData.responsibility_id,
            tacacsgroup_id: deletePermisionData.tacacsgroup_id,
        };
        try {
            console.log(newDeletePermisionData);
            const response = await delPermisions(userData.token, newDeletePermisionData);
            if (response.data.deleted === true) {
                toast.success(`Permision ${newDeletePermisionData.name} is Deleted`);
                fetchData();
            } else {
                toast.error(`Permision ${newDeletePermisionData.name} is not Deleted`);
            }
        } catch {
            console.log("Error deleting Permision");
        }
    }, [fetchData, userData.token]);
    
    const handleUpdatePermision = useCallback(async (editedSitesData) => {
        try {
            const response = await updatePermisions(userData.token, editedSitesData);
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

    const filteredPermision = useMemo(() => {
		if (!searchValue) return permisions;
		return permisions.filter((permision) =>
			permision.name.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [permisions, searchValue]);

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
                        { name: "level", label: "Level", required: true},
                        { name: "responsibility_id", label: "Responsibility", required: true, type: "select",
                            content: respons.map(res => ({
                                id: res.id,
                                name: res.name
						    })),
                        },
                        { name: "tacacsgroup_id", label: "Tacacs Group", required: true, type: "select",
                            content: tacacsGroup.map(tacacs => ({
                                id: tacacs.id,
                                name: tacacs.name
                            }))
                        },
                    ]}
                    initialData={row.original}
                    onDelete={() => handleDeletePermision(row.original)}
                    onSubmit={(data) => handleUpdatePermision(data)}
                />
            )
        },
        { header: "Descriprion", accessorKey: "description" },
        { header: "Level", accessorKey: "level" },
        { header: "Responsibility", accessorKey: "responsibility" },
        { header: "Tacacs Group", accessorKey: "tacacsGroup" },
    ], [handleDeletePermision, handleUpdatePermision, respons]);

    if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

    const handleAddTacacsGroup = async (newGroupData) => {
        try {
            console.log(newGroupData);
			const response = await addPermisions(userData.token, newGroupData);
			if (response.data.added === true) {
				setIsAddDialogOpen(false);
				toast.success(`Tacacs Group ${newGroupData.address} is Added`);
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
                title="Add New Permision level"
                fields={[
                    { label: "Name", name: "name", required: true },
                    { label: "Description", name: "description" },
                    { label: "Level", name: "level" },
                    { label: "Responsibility", name: "responsibility_id", type: "select",
                        content: respons.map(res => ({
							id: res.id,
							name: res.name
						})),
                    },
                    { label: "Tacacs Group", name: "tacacsgroup_id", type: "select",
                        content: tacacsGroup.map(tacacs => ({
							id: tacacs.id,
							name: tacacs.name
						}))
                    },
                ]}
                onSubmit={handleAddTacacsGroup}
                onCancel={() => setIsAddDialogOpen(false)}

            />

            <VirtualizedTable
                columns={columns}
                data={filteredPermision}
                columnPercentages={["8%", "20%", "20%", "12%", "20%", "20%"]}
                onVisibleRowsChange={setVisibleCount}
                rowHeight={50}
                visibleCount={25}
            />

            <TableFooter
                visibleCount={visibleCount}
                totalCount={permisions.length}
            />

            <Toaster richColors position="bottom-right" />
        </div>
    )
}

export default Permisions;