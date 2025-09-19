"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import HostCard from "@/components/HostCard"
import AddHostDialog from "@/components/AddHostDialog"
import { toast } from "sonner"

export default function Home() {
  const [hosts, setHosts] = useState([])

  const fetchHosts = () => {
    fetch("/api/hosts")
      .then(r => r.json())
      .then(d => setHosts(d.hosts || []))
  }

  useEffect(() => {
    fetchHosts()
  }, [])


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
    toast("Magic packet sent.")
  }

  const check = async (h) => {
    const j = await fetch("/api/status?ip=" + encodeURIComponent(h.ip)).then(r => r.json())
    toast(j.alive ? "online" : "offline")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Wake-On-LAN Dashboard</h1>
          <h6 className="text-xs">by stoaz & Gemini</h6>
        </div>
        <AddHostDialog onHostAdded={fetchHosts} />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {hosts.map((h) => (
          <HostCard
            key={h.id}
            host={h}
            deleteHost={deleteHost}
            wake={wake}
            fetchHosts={fetchHosts}
            check={check}
          />
        ))}
      </div>
    </div>
  )
}
