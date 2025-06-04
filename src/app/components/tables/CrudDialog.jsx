import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {Command,CommandEmpty,CommandGroup,CommandInput,CommandItem,CommandList,} from "@/components/ui/command"
import {Select,SelectContent,SelectGroup,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const CrudDialog = ({ isOpen,onOpenChange,title,initialData,fields,onSubmit,onCancel,}) => {
	const [formData, setFormData] = React.useState(initialData || {});
	const [networkParts, setNetworkParts] = React.useState({address: '', mask: ''});
	const handleSubmit = (e) => {
		e.preventDefault();
		if (networkParts.address && networkParts.mask) {
			onSubmit({
				...formData,
				network: networkParts.address,
				mask: `${networkParts.mask}`,
			})
		} else {onSubmit(formData);}
		setFormData({});
		setNetworkParts({address: '', mask: ''});
	};
	const handleFieldChange = (name, value) => {
		setFormData(prev => ({...prev,[name]: value}));
	};
	const handleNetworkPartsChange = (name, value) => {
		setNetworkParts(prev => ({...prev,[name]: value}));
	};
	const maskOptions = Array.from({ length: 33 }, (_, i) => i );
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="bg-card border-accent-foreground">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogDescription className='w-0 h-0'></DialogDescription>
				<form  onSubmit={handleSubmit} >
					{fields.map((field) => {
						if (field.name === 'network') {
							return (
								<div key='network' className='flex gap-4 mt-1'>
									<label  className=" text-left mt-2 w-[25%] text-sm font-medium">Network</label>
									<div className='flex gap-2 w-full'>
										<input
											type="text"
											placeholder="192.168.1.0"
											value={networkParts.address}
											onChange={(e) => handleNetworkPartsChange('address', e.target.value)}
											className="pl-2 block w-3/4 mt-1 border-0 border-b-2 appearance-none border-border focus:border-primary focus:outline-none focus:ring-0 peer"
											required={field.required}
										/>
										<Select
											value={networkParts.mask.toString()}
											onValueChange={(value) => handleNetworkPartsChange('mask', parseInt(value))}
										>
											<SelectTrigger className="w-[100px]">
												<SelectValue placeholder="Mask" />
											</SelectTrigger>
											<SelectContent className='h-100'>
												<SelectGroup>
													{maskOptions.map((mask) => (
														<SelectItem key={mask} value={mask.toString()}>
															{mask}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								</div>
							);
						}
						if (field.name === 'code') {
							return (
								<div key='code' className='flex gap-4 mt-1'>
									<label  className=" text-left mt-2 w-[25%] text-sm font-medium">Code</label>
									<div className='flex gap-2 w-full'>
										<Textarea 
											placeholder="Enter code"
											value={formData[field.name] || ''}
											onChange={(e) => handleFieldChange(field.name, e.target.value)}
											className="pl-2 block w-full mt-1 border-0 border-b-2 appearance-none border-border focus:border-primary focus:outline-none focus:ring-0 peer"
										/>
									</div>
								</div>
							);
						}
						return field.type === 'select' ? (
							<div key={field.id} className='flex gap-4 mt-1'>
								<label htmlFor={field.id} className=" text-left mt-2 w-[25%] text-sm font-medium">{field.label}</label>
								<Command className='max-h-45 border border-border'>
									<CommandInput 
										placeholder={`Search ${field.label}`}
									/>
									<CommandList>
										<CommandEmpty>No result found.</CommandEmpty>
										<CommandGroup>
											<ScrollArea>
												{field.content.map((item) => (
													<CommandItem
														key={item.id}
														value={item.name}
														onSelect={() => {
															handleFieldChange(field.name, item.id);
														}}
														className='h-7'
													>
														{item.name}
														<Check
															className={cn(
																"ml-auto h-4 w-4",
																formData[field.name] === item.id 
																? "opacity-100" 
																: "opacity-0"
															)}
														/>
													</CommandItem>
												))}
											</ScrollArea>
										</CommandGroup>
									</CommandList>
								</Command>
							</div>
						) : (
							<div key={field.id} className='flex gap-4 mt-1'>
								<label htmlFor={field.id} className=" text-left mt-2 w-[25%] text-sm font-medium">{field.label}</label>
								<input
									type={field.type || "text"}
									value={formData[field.name] || ""}
									onChange={(e) => handleFieldChange(field.name, e.target.value)}
									className="pl-2 block w-full mt-1 border-0 border-b-2 appearance-none border-border focus:border-primary focus:outline-none focus:ring-0 peer"
									placeholder={field.placeholder}
									required={field.required}
								/>
							</div>
						)
 					})}
					<DialogFooter className="mt-4">
						<Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
						<Button type="submit" variant="accept" className="p-2 rounded-md">Submit</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
 }