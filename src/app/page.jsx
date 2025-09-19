"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import HostCard from "@/components/HostCard"
import CreateHostDialog from "@/components/CreateHostDialog"

export default function Home() {
  const [hosts, setHosts] = useState([])

  useEffect(() => {
    fetch("/api/hosts")
      .then(r => r.json())
      .then(d => setHosts(d.hosts || []))
  }, [])

  const addHost = async () => {
    const name = prompt("name")
    const ip = prompt("ip (optional)")
    const mask = prompt("subnet mask (written out)")
    const mac = prompt("mac (optional)")
    if (!name) return
    await fetch("/api/hosts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, ip, mask, mac }),
    })
    const j = await fetch("/api/hosts").then(r => r.json())
    setHosts(j.hosts)
  }

  const deleteHost = async (hostId) => {
    await fetch(`/api/hosts?id=${hostId}`, { method: "DELETE" })
    const j = await fetch("/api/hosts").then(r => r.json())
    setHosts(j.hosts)
  }

  const wake = async (h) => {
    console.log("mask: " + h.mask)
    await fetch("/api/wol", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mac: h.mac, ip: h.ip, mask: h.mask }),
    })
    alert("sent")
  }

  const check = async (h) => {
    const j = await fetch("/api/status?ip=" + encodeURIComponent(h.ip)).then(r => r.json())
    alert(j.alive ? "online" : "offline")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Wake-On-LAN Dashboard</h1>
          <h6 className="text-xs">by stoaz & ChatGPT</h6>
        </div>
        <Button onClick={addHost}>Add host</Button>
      </div>
      <CreateHostDialog />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {hosts.map((h) => (
          <HostCard
            key={h.id}
            host={h}
            deleteHost={deleteHost}
            wake={wake}
            check={check}
          />
        ))}
      </div>
    </div>
  )
}
