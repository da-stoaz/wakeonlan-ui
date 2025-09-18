import Database from "better-sqlite3"
import { join } from "path"
import { mkdirSync } from "fs"


mkdirSync(join(process.cwd(), "data"), { recursive: true })
const db = new Database(join(process.cwd(), "data", "db.sqlite"))


// Initialize tables
// Hosts: store PCs/devices
// Pings: store uptime samples


db.prepare(`CREATE TABLE IF NOT EXISTS hosts (
id TEXT PRIMARY KEY,
name TEXT,
mac TEXT,
ip TEXT,
ssh TEXT
)`).run()


db.prepare(`CREATE TABLE IF NOT EXISTS pings (
id TEXT PRIMARY KEY,
hostId TEXT,
time INTEGER,
alive INTEGER
)`).run()


export default db