import React, { useMemo, useState, useCallback, useEffect } from "react";
import { importNetworks,getNetwork,updateNetworks,delNetworks,addNetworks,importResponsibilities,importSites,} from "../../services/networks/ActionNetworks";
import { importCity } from "../../services/city/ActionCity";
import { VirtualizedTable } from "@/app/components/tables/VirtualizedTable";
import { TableActionBar } from "@/app/components/tables/TableActionBar";
import { CrudDialog } from "@/app/components/tables/CrudDialog";
import { TableFooter } from "@/app/components/tables/TableFooter";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command,CommandEmpty,CommandInput,CommandItem,CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Address4 } from "ip-address";
import { TableSheetMenu } from "@/app/components/tables/TableSheetMenu";

const Networks = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const [networks, setNetworks] = useState([]);
	const [cities, setCities] = useState([]);
	const [respons, setRespons] = useState([]);
	const [sites, setSites] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isOpenSelectCity, setIsOpenSelectCity] = useState(false);
	const [isOpenSelectNetName, setIsOpenSelectNetName] = useState(false);
	const [isOpenSelectResponsibility, setIsOpenSelectResponsibility] = useState(false);
	const [valueCity, setValueCity] = useState("");
	const [valueNetName, setValueNetName] = useState("");
	const [valueResponsibility, setValueResponsibility] = useState("");
	const [visibleCount, setVisibleCount] = useState(0);

	const fetchData = useCallback(
		async (signal) => {
			try {
				const responseNet = await importNetworks(userData.token, {signal,});
				const responseRes = await importResponsibilities(userData.token, {signal,});
				const responseSites = await importSites(userData.token, {signal,});
				const responseCity = await importCity(userData.token, { signal });
				const preparedNetworks = responseNet.data.res.map((network) => {
					const responsibility = responseRes.data.res.find((res) => res.id === network.responsibility_id);
					const site = responseSites.data.res.find((site) => site.id === network.site_id);
					const city = responseCity.data.res.find((city) => city.id === network.city_id);
					return {
						...network,
						subnet: `${network.network}/${network.mask}`,
						responsibility: responsibility ? responsibility.name : "",
						site: site ? site.name : "",
						city: city ? city.name : "",
					}
				});
				setNetworks(preparedNetworks);
				setRespons(responseRes.data.res || []);
				setSites(responseSites.data.res || []);
				setCities(responseCity.data.res || []);
			} catch (error) {
				if (error.name === "AbortError") {
					setError(error);
				}
			} finally {
				setIsLoading(false);
			}
		}, [userData.token, ]
	);

	const handleDeleteNetwork = useCallback(async (deletedNetworkData) => {
		const newDeleteNetworkData = {
			id: deletedNetworkData.id,
			network: deletedNetworkData.network,
			mask: deletedNetworkData.mask,
			description: deletedNetworkData.description,
		};
		try {
			console.log("Deleting network:", newDeleteNetworkData);
			const response = await delNetworks(userData.token, newDeleteNetworkData);
			if (response.data.deleted === true) {
				toast.success(`Network ${newDeleteNetworkData.network}/${newDeleteNetworkData.mask} is Deleted`);
				fetchData();
			} else {
				toast.error("Error deleting network");
			}
		} catch (error) {
			console.error("Error deleting network:", error);
			toast.error("Error deleting network");
		}	
	}, [userData.token, fetchData]);

	const handleUpdateNetwork = useCallback(async (updatedNetworkData) => {
		const newUpdatedNetworkData = {
			id: updatedNetworkData.id,
			network: updatedNetworkData.network,
			mask: updatedNetworkData.mask,
			description: updatedNetworkData.description,
			responsibility_id: updatedNetworkData.responsibility_id,
			site_id: updatedNetworkData.site_id,
			city_id: updatedNetworkData.city_id,
		};
		try {
			console.log("Updating network:", newUpdatedNetworkData);
			const response = await updateNetworks(userData.token, newUpdatedNetworkData);
			if (response.data.updated === true) {
				toast.success(`Network ${newUpdatedNetworkData.network}/${newUpdatedNetworkData.mask} is Updated`);
				fetchData();
			} else {
				toast.error("Error updating network");
			}
		} catch (error) {
			console.error("Error updating network:", error);
			toast.error("Error updating network");
		}
	}, [userData.token, fetchData]);

	const handleAddNetwork = async (newNetworkData) => {
		try {
			const response = await addNetworks(userData.token, newNetworkData);
			console.log("Adding network:", newNetworkData);
			if (response.data.added === true) {
				setIsAddDialogOpen(false);
				toast.success(`Network ${newNetworkData.network}/${newNetworkData.mask} is Added`);
				fetchData(); 
			} else {
				toast.error(`Network ${newNetworkData.network}/${newNetworkData.mask} is not Added`);
			}
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.clear();
				navigate('/auth');
			}
		}
	};

	useEffect(() => {
		setIsLoading(false);
		const controller = new AbortController();
		fetchData(controller.signal);
		return () => controller.abort();
	}, [fetchData]);

	const filteredNetworks = useMemo(() => {
		let filtered = networks;

		if (searchValue) {
			const searchTerm = searchValue.trim().toLowerCase();
			const isIPSearch = Address4.isValid(searchTerm);

			if (isIPSearch) {
				try {
					const searchIP = new Address4(searchTerm);
					filtered = filtered.filter((net) => {
						try {
							const network = new Address4(net.subnet);
							return searchIP.isInSubnet(network);
						} catch {
							return false;
						}
					});
				} catch {
					return false;
				}
			} else {
				filtered = filtered.filter(
					(net) =>
						net.subnet.toLowerCase().includes(searchTerm) || 
						net.description.toLowerCase().includes(searchTerm) ||
						net.responsibility.toLowerCase().includes(searchTerm) ||
						net.city.toLowerCase().includes(searchTerm)
				);
			}
		}

		if (valueCity) {
			filtered = filtered.filter((net) => net.city_name.trim().toLowerCase() === valueCity.trim().toLowerCase());
		}
		if (valueNetName) {
			filtered = filtered.filter((net) => net.description === valueNetName);
		}
		if (valueResponsibility) {
			filtered = filtered.filter((net) => net.responsibility_name === valueResponsibility);
		}

		return filtered;
	}, [networks, searchValue, valueCity, valueNetName, valueResponsibility]);

	const uniqueCity = useMemo(() => {
		const cities = [...new Set(networks.map(network => network.city_name))];
		return cities;
	}, [networks]);
	const uniqueNetName = useMemo(() => {
		const netName = [
			...new Set(networks.map((network) => network.description)),
		];
		return netName;
	}, [networks]);
	const uniqueResponsibility = useMemo(() => {
		const responsibility = [
			...new Set(networks.map((network) => network.responsibility_name)),
		];
		return responsibility;
	}, [networks]);

	const CityFilterHeader = React.memo(({ isOpen,onOpenChange,valueCity,setValueCity,uniqueCity}) => (
		<div className="flex items-center gap-2">
			<span>City</span>
			<Popover open={isOpen} onOpenChange={onOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant="select"
						role="combobox"
						aria-expanded={isOpen}
						className="w-[200px] justify-between"
					>
						{valueCity || ""}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search city..." />
						<CommandList>
							<CommandEmpty>No city found.</CommandEmpty>
							{uniqueCity.map((city) => (
								<CommandItem
									key={city}
									value={city}
									onSelect={() => {
										setValueCity((prev) =>
											prev === city ? "" : city
										);
										onOpenChange(false);
									}}
								>
									{city}
									<Check className={cn( "ml-auto h-4 w-4", valueCity === city ? "opacity-100" : "opacity-0" )}/>
								</CommandItem>
							))}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	));

	const ResponsibilityFilterHeader = React.memo(({isOpen,onOpenChange,valueResponsibility,setValueResponsibility,uniqueResponsibility,}) => (
		<div className="flex items-center gap-2">
			<span>Responsibility</span>
			<Popover open={isOpen} onOpenChange={onOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant="select"
						role="combobox"
						aria-expanded={isOpen}
						className="w-[100px] justify-between"
					>
						{valueResponsibility || ""}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search responibility..." />
						<CommandList>
							<CommandEmpty>No responsibilities found.</CommandEmpty>
							{uniqueResponsibility.map((respons) => (
								<CommandItem
									key={respons}
									value={respons}
									onSelect={() => {
										setValueResponsibility((prev) =>
											prev === respons ? "" : respons
										);
										onOpenChange(false);
									}}
								>
									{respons}
									<Check className={cn( "ml-auto h-4 w-4", valueResponsibility === respons ? "opacity-100" : "opacity-0")}/>
								</CommandItem>
							))}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	));

	const NetNameFilteredHeader = React.memo(({isOpen,onOpenChange,valueNetName,setValueNetName,uniqueNetName,}) => (
		<div className="flex items-center gap-2">
			<span>Net_Name</span>
			<Popover open={isOpen} onOpenChange={onOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant="select"
						role="combobox"
						aria-expanded={isOpen}
						className="w-[200px] justify-between"
					>
						{valueNetName || ""}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search net name..." />
						<CommandList>
							<CommandEmpty>No net name found.</CommandEmpty>
							{uniqueNetName.map((net_name) => (
								<CommandItem
									key={net_name}
									value={net_name}
									onSelect={() => {
										setValueNetName((prev) =>
											prev === net_name
												? ""
												: net_name
										);
										onOpenChange(false);
									}}
								>
									{net_name}
									<Check className={cn("ml-auto h-4 w-4",valueNetName === net_name ? "opacity-100" : "opacity-0")} />
								</CommandItem>
							))}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	));

	const columns = useMemo(
		() => [
			{ accessorKey: "id", header: "ID" },
			{ header: "subnet", accessorKey: "subnet",
				cell: ({ row }) => {
					const originalData = row.original;
					const currentCity = cities.find(city => city.name === originalData.city_name);
					const currentResponsibility = respons.find(res => res.name === originalData.responsibility_name);
					const currentSite = sites.find(site => site.name === originalData.site_name);
					return (
						<TableSheetMenu 
							triggerChildren={<span className="cursor-context-menu">{row.original.subnet}</span>}
							menuItems={[
								{ name: "network", label: "Network", required: true },
								{ name: "mask", label: "Mask", required: true },
								{ name: "description", label: "Net Name", placeholder:"Test Network", required: false },
								{ name: "secret", label: "Secret", required: true},
								{ name: "responsibility_id", label: "Responsibility", type: "select", required: true,
									content: respons.map(res => ({
										id: res.id,
										name: res.name
									})),
									currentValue: currentResponsibility?.id || ""
								},
								{ name: "city_id", label: "City", type: "select", required: true,
									content: cities.map(city => ({
										id: city.id,
										name: city.name
									})),
									currentValue: currentCity?.id || ""
								},
								{ name: "site_id", label: "Site", type: "select", required: true,
									content: sites.map(site => ({
										id: site.id,
										name: site.name
									})),
									currentValue: currentSite?.id || ""
								}
							]}
							initialData={{...originalData, responsibility_id: currentResponsibility?.id, city_id: currentCity?.id, site_id: currentSite?.id}}
							onDelete={() => handleDeleteNetwork(row.original)}
							onSubmit={(data) => handleUpdateNetwork(data)}
							// fetchData={(id) => getNetwork(userData.token, id)}
						/>
					)
				}
			},
			{ accessorKey: "description",
				header: () => (
					<NetNameFilteredHeader
						isOpen={isOpenSelectNetName}
						onOpenChange={setIsOpenSelectNetName}
						valueNetName={valueNetName}
						setValueNetName={setValueNetName}
						uniqueNetName={uniqueNetName}
					/>
				),
			},
			{ accessorKey: "responsibility_name",
				header: () => (
					<ResponsibilityFilterHeader
						isOpen={isOpenSelectResponsibility}
						onOpenChange={setIsOpenSelectResponsibility}
						valueResponsibility={valueResponsibility}
						setValueResponsibility={setValueResponsibility}
						uniqueResponsibility={uniqueResponsibility}
					/>
				)
			},
			{ accessorKey: "city_name",
				header: () => (
					<CityFilterHeader
						isOpen={isOpenSelectCity}
						onOpenChange={setIsOpenSelectCity}
						valueCity={valueCity}
						setValueCity={setValueCity}
						uniqueCity={uniqueCity}
					/>
				),
			},
			{ header: "Zone", accessorKey: "site_name", },
		],
		[ isOpenSelectCity, valueCity, uniqueCity, isOpenSelectNetName, valueNetName, uniqueNetName, isOpenSelectResponsibility, valueResponsibility, uniqueResponsibility, handleDeleteNetwork, handleUpdateNetwork, cities, respons, sites, ]
	);

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
						Поиск зоны:{" "}
					</label>
					<input
						type="text"
						placeholder="network"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="block px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-secondary-foreground border-border focus:primary focus:outline-none focus:ring-0 peer"
					/>
				</div>
				<div>
					<TableActionBar onAdd={() => setIsAddDialogOpen(true)} />
				</div>
			</div>
			<VirtualizedTable
				columns={columns}
				data={filteredNetworks}
				columnPercentages={["5%", "19%", "19%", "19%", "19%", "19%"]}
				onVisibleRowsChange={setVisibleCount}
				rowHeight={50}
				visibleCount={25}
			/>

			<CrudDialog
				isOpen={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
				title="Add New Net"
				fields={[
					{ name: "network", label: "Network", required: true },
					{ name: "description", label: "Net Name", placeholder:"Test Network", required: true },
					{ name: "secret", label: "Secret", placeholder:"Secret", required: true },
					{ name: "responsibility_id", label: "Responsibility", type: "select", required: true,
						content: respons.map(res => ({
							id: res.id,
							name: res.name
						})),
					},
					{ name: "city_id", label: "City", type: "select", required: true,
						content: cities.map(city => ({
							id: city.id,
							name: city.name
						})),
					},
					{ name: "site_id", label: "Site", type: "select", required: true,
						content: sites.map(site => ({
							id: site.id,
							name: site.name
						})),
					}
				]}
				onSubmit={handleAddNetwork}
				onCancel={() => setIsAddDialogOpen(false)}
			/>

			<TableFooter
				// selectedCount={selectedRows.length}
				totalCount={filteredNetworks.length}
				visibleCount={visibleCount}
			/>
			<Toaster richColors position="bottom-right" />
		</div>
	);
};

export default Networks;
