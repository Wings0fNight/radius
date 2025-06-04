import React, { useMemo, useState, useCallback, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { importTrustedIps, addTrustedIps, delTrustedIps, updateTrustedIps,} from "../../services/networks/ActionNetworks";
import { VirtualizedTable } from "@/app/components/tables/VirtualizedTable";
import { TableActionBar } from "@/app/components/tables/TableActionBar";
import { CrudDialog } from "@/app/components/tables/CrudDialog";
import { TableFooter } from "@/app/components/tables/TableFooter";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { TableSheetMenu } from '@/app/components/tables/TableSheetMenu';

const TrustedIps = () => {
    const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const [trustedIps, setTrustedIps] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [visibleCount, setVisibleCount] = useState(0);

    const fetchData = useCallback(async (signal) => {
		try {
			const response = await importTrustedIps(userData.token, { signal });
			if (response.data.auth === true) {
				setTrustedIps(response.data.res || []);
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

    const handleDeleteTrust = useCallback(async (deleteTrustData) => {
        try {
            const response = await delTrustedIps(userData.token, deleteTrustData);
            if (response.data.deleted === true) {
                toast.success(`Responsibility ${deleteTrustData.name} is Deleted`);
                fetchData();
            } else {
                toast.error(`Responsibility ${deleteTrustData.name} is not Deleted`);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate('/auth');
            }
        }
    }, [fetchData, navigate, userData.token]);
    
    const handleUpdateTrust = useCallback(async (editedTrustData) => {
        try {
            const response = await updateTrustedIps(userData.token, editedTrustData);
            if (response.data.updated === true) {
                toast.success(`Responsibility ${editedTrustData.name} is Updated`);
                fetchData();
            } else {
                toast.error(`Responsibility ${editedTrustData.name} is not Updated`);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate('/auth');
            }
        }
    }, [fetchData, navigate, userData.token]);

    const filteredTrustedIps = useMemo(() => {
		if (!searchValue) return trustedIps;
		return trustedIps.filter((trustedIp) =>
			trustedIp.address.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [trustedIps, searchValue]);

    useEffect(() => {
		const controller = new AbortController();
		fetchData(controller.signal);
		return () =>{ controller.abort();}
	}, [fetchData]);

    const columns = useMemo(() => [
        { header: "ID", accessorKey: "id" },
        { header: "Address", accessorKey: "address",
            cell: ({ row }) => (
                <TableSheetMenu 
                    triggerChildren={<span className="cursor-context-menu">{row.original.address}</span>}
                    menuItems={[
                        { name: "address", label: "Address", required: true, disabled: true },
                        { name: "description", label: "Description", required: true },
                    ]}
                    initialData={row.original}
                    onDelete={() => handleDeleteTrust(row.original)}
                    onSubmit={(data) => handleUpdateTrust(data)}
                />
            )
        },
        { header: "Description", accessorKey: "description" }
    ], [handleDeleteTrust, handleUpdateTrust]);

    if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

    const handleAddTrustIp = async (newTrustIpData) => {
        try {
			const response = await addTrustedIps(userData.token, newTrustIpData);
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
                        Поиск IP адреса:{" "}
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
                    { label: "Address", name: "address" },
                    { label: "Description", name: "description" }
                    ]}
                onSubmit={handleAddTrustIp}
                onCancel={() => setIsAddDialogOpen(false)}

            />

            <VirtualizedTable
                columns={columns}
                data={filteredTrustedIps}
                columnPercentages={["10%", "45%", "45%"]}
                onVisibleRowsChange={setVisibleCount}
                rowHeight={50}
                visibleCount={25}
            />

            <TableFooter
                visibleCount={visibleCount}
                totalCount={trustedIps.length}
            />

            <Toaster richColors position="bottom-right" />
        </div>
    )
}

export default TrustedIps;