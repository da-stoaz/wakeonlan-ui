import db from "@/lib/db"
import { randomUUID } from "crypto"


export async function GET() {
const rows = db.prepare("SELECT * FROM hosts").all()
return Response.json({ hosts: rows })
}


export async function POST(req) {
const { name, mac, ip, ssh } = await req.json()
if (!name) return Response.json({ error: "name required" }, { status: 400 })


const id = randomUUID()
db.prepare("INSERT INTO hosts (id, name, mac, ip, ssh) VALUES (?, ?, ?, ?, ?)").run(
id,
name,
mac || null,
ip || null,
ssh || null
)


const row = db.prepare("SELECT * FROM hosts WHERE id = ?").get(id)
return Response.json(row, { status: 201 })
}


export async function DELETE(req) {
const { searchParams } = new URL(req.url)
const id = searchParams.get("id")
if (!id) return Response.json({ error: "id required" }, { status: 400 })


db.prepare("DELETE FROM hosts WHERE id = ?").run(id)
return Response.json({ ok: true })
}