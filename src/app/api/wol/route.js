import wol from "wol"
import ip from "ip"

export async function POST(req) {
    const { mac, ip: hostIp, mask } = await req.json()
    if (!mac) return Response.json({ error: "mac required" }, { status: 400 })

    if (!hostIp || !mask) {
        return Response.json({ error: "ip and mask required" }, { status: 400 })
    }

    try {
        const subnet = ip.subnet(hostIp, mask)
        const broadcast = subnet.broadcastAddress
        console.log(broadcast)


        await new Promise((resolve, reject) => {
            wol.wake(mac, { address: broadcast }, (err) => (err ? reject(err) : resolve()))
        })
        return Response.json({ ok: true, broadcast })
    } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 })
    }
}