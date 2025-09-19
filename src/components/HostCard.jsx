import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Check, LucideTrash, PencilIcon, Trash, Trash2, Trash2Icon, TrashIcon } from "lucide-react"
import { EllipsisVertical } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { Separator } from "@/components/ui/separator"
import { EditHostDialog } from "./EditHostDialog"


export default function HostCard({ host, deleteHost, wake, check, fetchHosts }) {
    const [status, setStatus] = useState({ alive: false, time: 0 })
    const [pulse, setPulse] = useState(false)

    const pingHost = async () => {
        if (!host.ip) return
        try {
            const res = await fetch("/api/status?ip=" + encodeURIComponent(host.ip))
                .then(r => r.json())
            setStatus({ alive: res.alive, time: res.time || 0 })
            // Trigger pulse animation
            setPulse(true)
            setTimeout(() => setPulse(false), 300)
        } catch (err) {
            setStatus({ alive: false, time: 0 })
            setPulse(true)
            setTimeout(() => setPulse(false), 300)
        }
    }

    // Ping every 10s
    useEffect(() => {
        pingHost()
        const interval = setInterval(pingHost, 10000)
        return () => clearInterval(interval)
    }, [host.ip])

    // Determine badge color
    let color = "bg-red-500"
    if (status.alive && status.time <= 100) color = "bg-green-500"
    else if (status.alive && status.time > 100) color = "bg-orange-500"

    return (
        <Card className="rounded-2xl shadow-md">
            <CardHeader>
                <CardTitle>
                    <div className="w-full flex flex-row justify-between items-center">
                        <div className="flex items-center gap-2">
                            {/* Status Badge */}
                            <span
                                className={`w-3 h-3 rounded-full ${color} ${pulse ? "animate-ping" : ""
                                    }`}
                            ></span>
                            {host.name}
                        </div>
                        <Popover>
                            <PopoverTrigger>
                                <EllipsisVertical />

                            </PopoverTrigger>
                            <PopoverContent className="space-y-2">
                                <h4 className="font-semibold">Actions</h4>
                                <Separator orientation="horizontal" />
                                <div className="flex flex-row gap-2">
                                    <EditHostDialog host={host} onHostUpdated={fetchHosts}>
                                        <Button
                                            onClick={() => console.log("edit?")}
                                            variant=""
                                            size="sm">
                                            <PencilIcon />
                                            Edit
                                        </Button>
                                    </EditHostDialog>


                                    <Button
                                        onClick={() => deleteHost(host.id)}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2Icon />
                                        Delete
                                    </Button>
                                </div>

                            </PopoverContent>
                        </Popover>

                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>IP: {host.ip}</div>
                <div>Subnet Mask: {host.mask}</div>
                <div>MAC: {host.mac ?? "N/A"}</div>
                <div className="flex gap-2 pt-2">
                    {!host.mac ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <Button size="sm" disabled>
                                        Wake
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>MAC-Address required for Wake-on-LAN</p>
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Button size="sm" onClick={() => wake(host)}>
                            Wake
                        </Button>
                    )}


                    <Button
                        size="sm"
                        disabled={!host.ip}
                        variant="secondary"
                        onClick={async () => {
                            try {
                                const res = await fetch("/api/status?ip=" + encodeURIComponent(host.ip)).then(r => r.json())

                                toast(`${host.name} is ${res.alive ? `Online (${res.time} ms)` : "Offline"}`, {
                                    // optional styling
                                    position: "top-center",
                                    duration: 2000,
                                    icon: <Check />
                                })
                            } catch (err) {
                                toast.error(`Failed to ping ${host.name}`)
                            }
                        }}
                    >
                        Check
                    </Button>

                </div>
            </CardContent>
        </Card>
    )
}
