"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";


export default function AddHostDialog({ onHostAdded }) {
    const [name, setName] = useState("");
    const [ip, setIp] = useState("");
    const [mask, setMask] = useState("");
    const [mac, setMac] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast("Host name is required.", {variant: "destructive"});
            return;
        }

        try {
            await fetch("/api/hosts", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name, ip, mask, mac }),
            });

            // Clear form inputs
            setName("");
            setIp("");
            setMask("");
            setMac("");
            setIsOpen(false);

            // Notify parent component to refresh the list
            if (onHostAdded) {
                onHostAdded();
            }
        } catch (error) {
            console.error("Failed to add host:", error);
            toast.error("Failed to add host. Please try again.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant=""><PlusIcon /> Add Host</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Host</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new host. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ip" className="text-right">
                            IP
                        </Label>
                        <Input
                            id="ip"
                            value={ip}
                            required
                            onChange={(e) => setIp(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mask" className="text-right">
                            Subnet Mask
                        </Label>
                        <Input
                            id="mask"
                            value={mask}
                            onChange={(e) => setMask(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mac" className="text-right">
                            MAC (optional)
                        </Label>
                        <Input
                            id="mac"
                            value={mac}
                            onChange={(e) => setMac(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Save Host</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}