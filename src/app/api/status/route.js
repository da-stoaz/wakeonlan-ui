import ping from "ping"


export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const ip = searchParams.get("ip")
    if (!ip) return Response.json({ error: "ip query required" }, { status: 400 })


    try {
        const resPing = await ping.promise.probe(ip, { timeout: 2 })
        return Response.json({ alive: resPing.alive, time: resPing.time })
    } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 })
    }
}