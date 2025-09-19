"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditHostDialog({ host, onHostUpdated, children }) {
    const [name, setName] = useState("");
    const [ip, setIp] = useState("");
    const [mask, setMask] = useState("");
    const [mac, setMac] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (host) {
            setName(host.name || "");
            setIp(host.ip || "");
            setMask(host.mask || "");
            setMac(host.mac || "");
        }
    }, [host]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch("/api/hosts", {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    id: host.id,
                    name,
                    ip,
                    mask,
                    mac,
                }),
            });

            setIsOpen(false);

            // Notify parent component to refresh the list
            if (onHostUpdated) {
                onHostUpdated();
            }
        } catch (error) {
            console.error("Failed to update host:", error);
            alert("Failed to update host. Please try again.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {/* This allows a custom button or element to trigger the dialog */}
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Host</DialogTitle>
                    <DialogDescription>
                        Update the details for this host.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="">
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
                        <Label htmlFor="ip" className="">
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
                        <Label htmlFor="mask" className="">
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
                        <Label htmlFor="mac" className="">
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
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}