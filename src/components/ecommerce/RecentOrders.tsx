import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useAuth } from "../../context/AuthContext";
import { TaskIcon, AlertIcon, DocsIcon, UserIcon, PencilIcon, FileIcon, BoxIcon, ShootingStarIcon, PageIcon, LockIcon, GroupIcon } from "../../icons";

// Define the TypeScript interface for the table rows
interface RowItem {
  id: number;
  title: string;
  sub: string;
  meta: string;
  status: string;
}

// Role-specific configuration
const configByRole = {
  student: {
    title: "Recent Assignments",
    col2: "Course",
    col3: "Due Date",
    icons: [TaskIcon, PencilIcon, FileIcon],
    statusColor: (s: string) => (s === "Completed" ? "success" : s === "Pending" ? "warning" : "error" as const),
    rows: [
      { id: 1, title: "DSA Homework 3", sub: "CS201", meta: "Sep 20, 2025", status: "Completed" },
      { id: 2, title: "Physics Lab Report", sub: "PH102", meta: "Sep 18, 2025", status: "Pending" },
      { id: 3, title: "Operating Systems Quiz", sub: "CS301", meta: "Sep 22, 2025", status: "Completed" },
      { id: 4, title: "Linear Algebra Assignment", sub: "MA202", meta: "Sep 25, 2025", status: "Overdue" },
      { id: 5, title: "English Essay", sub: "EN101", meta: "Sep 19, 2025", status: "Completed" },
    ] as RowItem[],
  },
  "hostel-warden": {
    title: "Recent Complaints",
    col2: "Block/Room",
    col3: "Filed On",
    icons: [AlertIcon, BoxIcon, ShootingStarIcon],
    statusColor: (s: string) => (s === "Resolved" ? "success" : s === "Pending" ? "warning" : "error" as const),
    rows: [
      { id: 1, title: "Water leakage", sub: "B-204", meta: "Sep 12, 2025", status: "Resolved" },
      { id: 2, title: "WiFi not working", sub: "C-105", meta: "Sep 11, 2025", status: "Pending" },
      { id: 3, title: "Mess food quality", sub: "Mess Hall", meta: "Sep 10, 2025", status: "Open" },
      { id: 4, title: "Broken window", sub: "A-318", meta: "Sep 09, 2025", status: "Resolved" },
      { id: 5, title: "Noise after hours", sub: "D-110", meta: "Sep 08, 2025", status: "Pending" },
    ] as RowItem[],
  },
  clerk: {
    title: "Recent Applications",
    col2: "Type",
    col3: "Submitted",
    icons: [FileIcon, DocsIcon, PageIcon],
    statusColor: (s: string) => (s === "Approved" ? "success" : s === "Pending" ? "warning" : "error" as const),
    rows: [
      { id: 1, title: "Bonafide Certificate", sub: "Document", meta: "Sep 10, 2025", status: "Approved" },
      { id: 2, title: "Fee Refund", sub: "Finance", meta: "Sep 12, 2025", status: "Pending" },
      { id: 3, title: "ID Card Reissue", sub: "Admin", meta: "Sep 05, 2025", status: "Rejected" },
      { id: 4, title: "Transcript Request", sub: "Records", meta: "Sep 14, 2025", status: "Approved" },
      { id: 5, title: "Hostel Fee Receipt", sub: "Finance", meta: "Sep 13, 2025", status: "Pending" },
    ] as RowItem[],
  },
  admin: {
    title: "Recent User Activity",
    col2: "Role",
    col3: "Time",
    icons: [UserIcon, LockIcon, GroupIcon],
    statusColor: (s: string) => (s === "Success" ? "success" : s === "Warning" ? "warning" : "error" as const),
    rows: [
      { id: 1, title: "User created", sub: "clerk", meta: "10:12 AM", status: "Success" },
      { id: 2, title: "Policy updated", sub: "admin", meta: "9:30 AM", status: "Success" },
      { id: 3, title: "Failed login", sub: "student", meta: "9:12 AM", status: "Warning" },
      { id: 4, title: "Module error", sub: "system", meta: "8:50 AM", status: "Error" },
      { id: 5, title: "Password reset", sub: "student", meta: "Yesterday", status: "Success" },
    ] as RowItem[],
  },
};

export default function RecentOrders() {
  const { user } = useAuth();
  const role = user?.role ?? "student";
  const cfg = (configByRole as any)[role] ?? configByRole.student;
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {cfg.title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Items
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {cfg.col2}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {cfg.col3}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {cfg.rows.map((row: RowItem, index: number) => {
              const IconComponent = cfg.icons[index % cfg.icons.length];
              return (
                <TableRow key={row.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                        <IconComponent className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {row.title}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {row.sub}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {row.sub}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {row.meta}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={cfg.statusColor(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
