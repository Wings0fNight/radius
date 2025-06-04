import React, { useMemo, useState, useCallback, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { importSites,addSites,delSites,updateSites,} from "../../services/networks/ActionNetworks";
import { VirtualizedTable } from "@/app/components/tables/VirtualizedTable";
import { TableActionBar } from "@/app/components/tables/TableActionBar";
import { CrudDialog } from "@/app/components/tables/CrudDialog";
import { TableFooter } from "@/app/components/tables/TableFooter";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { TableSheetMenu } from '@/app/components/tables/TableSheetMenu';

const Site = () => {
    const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const [sites, setSites] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [visibleCount, setVisibleCount] = useState(0);

    const fetchData = useCallback(async (signal) => {
		try {
			const response = await importSites(userData.token, { signal });
			if (response.data.auth === true) {
				setSites(response.data.res || []);
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

    const handleDeleteSites = useCallback(async (deleteSitesData) => {
        try {
            const response = await delSites(userData.token, deleteSitesData);
            if (response.data.deleted === true) {
                toast.success(`Sites ${deleteSitesData.name} is Deleted`);
                fetchData();
            } else {
                toast.error(`Sites ${deleteSitesData.name} is not Deleted`);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate('/auth');
            }
        }
    }, [fetchData, navigate, userData.token]);
    
    const handleUpdateSites = useCallback(async (editedSitesData) => {
        try {
            const response = await updateSites(userData.token, editedSitesData);
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
		if (!searchValue) return sites;
		return sites.filter((sites) =>
			sites.address.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [sites, searchValue]);

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
                        { name: "short_name", label: "Short Name", required: true },
                    ]}
                    initialData={row.original}
                    onDelete={() => handleDeleteSites(row.original)}
                    onSubmit={(data) => handleUpdateSites(data)}
                />
            )
        },
        { header: "Short Name", accessorKey: "short_name" },
        { header: "Descriptions", accessorKey: "description" }
    ], [handleDeleteSites, handleUpdateSites]);

    if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

    const handleAddTrustIp = async (newTrustIpData) => {
        try {
			const response = await addSites(userData.token, newTrustIpData);
			if (response.data.added === true) {
				setIsAddDialogOpen(false);
				toast.success(`Trusted ip ${newTrustIpData.address} is Added`);
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

    return (
        <div className="relative w-[99%] h-[calc(100vh-100px)] p-6 bg-card border border-border rounded-lg shadow-md mt-5 mb-8 m-auto flex flex-col">
            <div className="flex justify-between mb-5">
                <div className="grid grid-cols-2 items-center">
                    <label htmlFor="" className="text-left ml-2 font-medium">
                        Поиск sites:{" "}
                    </label>
                    <input
                        type="text"
                        placeholder="address"
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
                title="Add New Trusted Ip"
                fields={[
                    { label: "Name", name: "name" },
                    { label: "Short name", name: "short_name" }
                    ]}
                onSubmit={handleAddTrustIp}
                onCancel={() => setIsAddDialogOpen(false)}

            />

            <VirtualizedTable
                columns={columns}
                data={filteredSites}
                columnPercentages={["10%", "30%", "30%", "30%"]}
                onVisibleRowsChange={setVisibleCount}
                rowHeight={50}
                visibleCount={25}
            />

            <TableFooter
                visibleCount={visibleCount}
                totalCount={sites.length}
            />

            <Toaster richColors position="bottom-right" />
        </div>
    )
}

export default Site;