import db from "@/lib/db"


export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return Response.json({ error: "id query required" }, { status: 400 })


    const rows = db.prepare("SELECT * FROM pings WHERE hostId = ?").all(id)


    const buckets = {}
    for (const p of rows) {
        const slot = Math.floor(p.time / (5 * 60 * 1000)) * (5 * 60 * 1000)
        if (!buckets[slot]) buckets[slot] = { total: 0, alive: 0 }
        buckets[slot].total += 1
        if (p.alive) buckets[slot].alive += 1
    }


    const series = Object.keys(buckets)
        .sort()
        .map((k) => ({ time: +k, upPct: buckets[k].alive / buckets[k].total }))


    return Response.json({ series })
}