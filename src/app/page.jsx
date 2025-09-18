"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import HostCard from "@/components/HostCard"

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
    const mac = prompt("mac (optional)")
    if (!name) return
    await fetch("/api/hosts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, ip, mac }),
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
    await fetch("/api/wol", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mac: h.mac, ip: h.ip }),
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
        <h1 className="text-2xl font-bold">Mini WOL Dashboard</h1>
        <Button onClick={addHost}>Add host</Button>
      </div>

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
