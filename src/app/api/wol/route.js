import wol from "wol"


export async function POST(req) {
const { mac, ip } = await req.json()
if (!mac) return Response.json({ error: "mac required" }, { status: 400 })


try {
await new Promise((resolve, reject) => {
wol.wake(mac, { address: ip }, (err) => (err ? reject(err) : resolve()))
})
return Response.json({ ok: true })
} catch (err) {
return Response.json({ error: String(err) }, { status: 500 })
}
}