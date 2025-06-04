import React from "react";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger, ContextMenuItem, ContextMenuLabel } from "@/components/ui/context-menu";
import {Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const TableContextMenu = ({ 
	triggerChildren,
	menuItems = [],
}) => { 
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<ContextMenu>
			<ContextMenuTrigger>{triggerChildren}</ContextMenuTrigger>
			<ContextMenuContent className="w-48">
				<ContextMenuLabel className="text-sm">Действия с <span className="text-ring font-bold">{triggerChildren}</span></ContextMenuLabel>
				{menuItems.map((item, index) => (
					<React.Fragment key={index}>
						{item.type === "delete" ? (
							<Dialog open={isOpen} onOpenChange={setIsOpen} >
								<DialogTrigger asChild>
									<ContextMenuItem key={index} className={item.className} onSelect={(e) => e.preventDefault()}>
										{item.icon}
										{item.label}
									</ContextMenuItem>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Удалить?</DialogTitle>
										<DialogDescription>Вы уверены, что хотите удалить <span className="font-bold">{triggerChildren}</span>?</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline">Cancel</Button>
										</DialogClose>
										<DialogClose asChild>
											<Button variant="destructive" onClick={item.onSelect}>Delete</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						) : (
							<ContextMenuItem
								onSelect={(e) => {
									e.preventDefault();
									item.onSelect(item.user);
								}}
								className={item.className}
							>
								<span className="flex items-center gap-2">
									{item.icon}
									{item.label}
								</span>
							</ContextMenuItem>
						)}
					</React.Fragment>
				))}
			</ContextMenuContent>
		</ContextMenu>
	);
}