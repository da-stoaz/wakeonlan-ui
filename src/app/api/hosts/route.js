import db from "@/lib/db"
import { randomUUID } from "crypto"


export async function GET() {
    const rows = db.prepare("SELECT * FROM hosts").all()
    return Response.json({ hosts: rows })
}


export async function POST(req) {
    const { name, mac, ip, mask, ssh } = await req.json()
    if (!name) return Response.json({ error: "name required" }, { status: 400 })


    const id = randomUUID()
    db.prepare("INSERT INTO hosts (id, name, mask, mac, ip, ssh) VALUES (?, ?, ?, ?, ?, ?)").run(
        id,
        name,
        mask || null,
        mac || null,
        ip || null,
        ssh || null
    )


    const row = db.prepare("SELECT * FROM hosts WHERE id = ?").get(id)
    return Response.json(row, { status: 201 })
}

export async function PATCH(req) {
    const { id, name, ip, mask, mac, ssh } = await req.json();

    if (!id) {
        return Response.json({ error: "Host ID required" }, { status: 400 });
    }

    // Build the SET clause for the SQL query
    const updates = [];
    const params = [];

    if (name !== undefined) {
        updates.push("name = ?");
        params.push(name);
    }
    if (ip !== undefined) {
        updates.push("ip = ?");
        params.push(ip);
    }
    if (mask !== undefined) {
        updates.push("mask = ?");
        params.push(mask);
    }
    if (mac !== undefined) {
        updates.push("mac = ?");
        params.push(mac);
    }
    if (ssh !== undefined) {
        updates.push("ssh = ?");
        params.push(ssh);
    }

    if (updates.length === 0) {
        return Response.json({ error: "No fields to update" }, { status: 304 });
    }

    const query = `UPDATE hosts SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    try {
        const result = db.prepare(query).run(...params);
        if (result.changes === 0) {
            return Response.json({ error: "Host not found or no changes made" }, { status: 404 });
        }
        const updatedRow = db.prepare("SELECT * FROM hosts WHERE id = ?").get(id);
        return Response.json(updatedRow);
    } catch (error) {
        console.error("Database error:", error);
        return Response.json({ error: "Failed to update host" }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return Response.json({ error: "id required" }, { status: 400 })


    db.prepare("DELETE FROM hosts WHERE id = ?").run(id)
    return Response.json({ ok: true })
}