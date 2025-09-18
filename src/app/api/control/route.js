import { Client } from "ssh2"


function runSSH(host, username, password, command) {
return new Promise((resolve, reject) => {
const conn = new Client()
conn
.on("ready", () => {
conn.exec(command, (err, stream) => {
if (err) {
conn.end()
return reject(err)
}
let out = ""
stream
.on("close", (code) => {
conn.end()
resolve({ code, out })
})
.on("data", (d) => {
out += d.toString()
})
})
})
.on("error", reject)
.connect({ host, port: 22, username, password })
})
}


export async function POST(req) {
const { host, username, password, action } = await req.json()
if (!host || !username || !password || !action)
return Response.json({ error: "missing fields" }, { status: 400 })


try {
let cmd = ""
if (action === "reboot") cmd = "shutdown /r /t 0"
else if (action === "shutdown") cmd = "shutdown /s /t 0"
else return Response.json({ error: "invalid action" }, { status: 400 })


const r = await runSSH(host, username, password, cmd)
return Response.json({ ok: true, r })
} catch (err) {
return Response.json({ error: String(err) }, { status: 500 })
}
}