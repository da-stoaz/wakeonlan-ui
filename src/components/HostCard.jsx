import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button"

export default function HostCard({ host, deleteHost, wake, check }) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>
          <div className="w-full flex flex-row justify-between items-center">
            {host.name}
            <Button
              onClick={() => deleteHost(host.id)}
              variant="destructive"
              size="sm"
            >
              Delete
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>IP: {host.ip}</div>
        <div>MAC: {host.mac}</div>
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => wake(host)}>Wake</Button>
          <Button size="sm" variant="secondary" onClick={() => check(host)}>Check</Button>
        </div>
      </CardContent>
    </Card>
  )
}
