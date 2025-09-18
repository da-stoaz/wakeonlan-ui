import cron from "node-cron"
import ping from "ping"
import db from "@/lib/db"
import { randomUUID } from "crypto"


export function startPoller() {
cron.schedule("* * * * *", async () => {
try {
const hosts = db.prepare("SELECT * FROM hosts").all()
const time = Date.now()


for (const h of hosts) {
if (!h.ip) continue
const res = await ping.promise.probe(h.ip, { timeout: 2 })
db.prepare("INSERT INTO pings (id, hostId, time, alive) VALUES (?, ?, ?, ?) ").run(
randomUUID(),
h.id,
time,
res.alive ? 1 : 0
)
}


const cutoff = Date.now() - 24 * 60 * 60 * 1000
db.prepare("DELETE FROM pings WHERE time < ?").run(cutoff)
} catch (e) {
console.error("poller error", e)
}
})
}