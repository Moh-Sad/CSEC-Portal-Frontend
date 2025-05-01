import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data
const sessions = [
  { id: 1, date: "July 01, 2023", title: "Weekly session", division: "CPD", totalGroups: 6, status: "Started" },
  { id: 2, date: "July 02, 2023", title: "Contest", division: "CPD", totalGroups: 2, status: "Started" },
  { id: 3, date: "July 03, 2023", title: "Weekly session", division: "CPD", totalGroups: 3, status: "Started" },
  { id: 4, date: "July 04, 2023", title: "Weekly session", division: "CPD", totalGroups: 0, status: "Ended" },
  { id: 5, date: "July 05, 2023", title: "Contest", division: "CPD", totalGroups: 4, status: "Ended" },
  { id: 6, date: "July 06, 2023", title: "Contest", division: "CPD", totalGroups: 2, status: "Planned" },
  { id: 7, date: "July 07, 2023", title: "Contest", division: "CPD", totalGroups: 2, status: "Started" },
  { id: 8, date: "July 08, 2023", title: "Contest", division: "Dev", totalGroups: 2, status: "Ended" },
  { id: 9, date: "July 09, 2023", title: "Weekly session", division: "Dev", totalGroups: 2, status: "Started" },
  { id: 10, date: "July 09, 2023", title: "Weekly session", division: "Dev", totalGroups: 2, status: "Started" },
  { id: 11, date: "July 09, 2023", title: "Weekly session", division: "Dev", totalGroups: 2, status: "Started" },
  { id: 12, date: "July 09, 2023", title: "Weekly session", division: "Dev", totalGroups: 2, status: "Started" },
  { id: 13, date: "July 09, 2023", title: "Weekly session", division: "Dev", totalGroups: 2, status: "Started" },
]

export default function SessionTable() {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Session Title</TableHead>
            <TableHead>Division</TableHead>
            <TableHead>Total groups</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell className="font-medium">{session.date}</TableCell>
              <TableCell>{session.title}</TableCell>
              <TableCell>{session.division}</TableCell>
              <TableCell>{session.totalGroups}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    session.status === "Started"
                      ? "bg-green-50 text-green-500"
                      : session.status === "Ended"
                        ? "bg-red-50 text-red-500"
                        : "bg-yellow-50 text-yellow-500"
                  } hover:bg-opacity-80`}
                >
                  {session.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Showing</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">Showing 1 to 10 out of 50 records</span>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
