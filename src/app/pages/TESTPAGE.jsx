import React, { useState } from 'react';
import {
	  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Sheet,SheetContent,SheetDescription,SheetFooter,SheetHeader,SheetTitle,SheetTrigger,SheetClose,} from "@/components/ui/sheet"

import { ContextMenu, ContextMenuContent, ContextMenuTrigger, ContextMenuItem, ContextMenuLabel } from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";

const TESTPAGE = () => {
	const [isOpen, setIsOpen] = useState(false);


	return (
		<>
		<ContextMenu>
			<ContextMenuTrigger className="border-2" >Right click2</ContextMenuTrigger>
			<ContextMenuContent>
				<Sheet>
					<SheetTrigger asChild>
						<ContextMenuItem className="flex items-center gap-2">
							Сменить пароль
						</ContextMenuItem>
					</SheetTrigger>
					<SheetContent className='bg-card border-accent-foreground'>
						<SheetHeader>
							<SheetTitle>Изменить пользователя</SheetTitle>
							<SheetDescription></SheetDescription>
						</SheetHeader>
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">New Password</label>
							<input
							type="password"
							className="col-span-3 p-2 border rounded"
							required
							/>
						</div>
						<SheetFooter className="mt-4">
							<SheetClose asChild>
								<Button>AA</Button>
							</SheetClose>
						</SheetFooter>
					</SheetContent>
				</Sheet>
				<ContextMenuItem>Download</ContextMenuItem>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<ContextMenuItem onSelect={(e) => e.preventDefault()}>
						Delete
					</ContextMenuItem>
				</DialogTrigger>
				<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>ss</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button variant="destructive">Continue</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
				</Dialog>
			</ContextMenuContent>	
		</ContextMenu>
		</>
	);
};


export default TESTPAGE;