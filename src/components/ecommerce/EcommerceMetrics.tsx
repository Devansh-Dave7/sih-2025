import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useAuth } from "../../context/AuthContext";

export default function EcommerceMetrics() {
  const { user } = useAuth();

  // Define role-specific metrics (two tiles per role)
  const role = user?.role ?? "student";

  const metricsByRole: Record<
    string,
    {
      label: string;
      value: string;
      trend: string;
      trendDirection: "up" | "down";
      Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    }[]
  > = {
    student: [
      {
        label: "Assignments Assigned",
        value: "8",
        trend: "+5.0%",
        trendDirection: "up",
        Icon: GroupIcon,
      },
      {
        label: "Assignments Completed",
        value: "6",
        trend: "+12.3%",
        trendDirection: "up",
        Icon: BoxIconLine,
      },
    ],
    "hostel-warden": [
      {
        label: "Complaints Received",
        value: "24",
        trend: "+3.1%",
        trendDirection: "up",
        Icon: GroupIcon,
      },
      {
        label: "Complaints Resolved",
        value: "19",
        trend: "+9.8%",
        trendDirection: "up",
        Icon: BoxIconLine,
      },
    ],
    clerk: [
      {
        label: "Applications Pending",
        value: "42",
        trend: "-4.5%",
        trendDirection: "down",
        Icon: GroupIcon,
      },
      {
        label: "Applications Processed",
        value: "67",
        trend: "+7.2%",
        trendDirection: "up",
        Icon: BoxIconLine,
      },
    ],
    admin: [
      {
        label: "Active Users",
        value: "1,284",
        trend: "+2.4%",
        trendDirection: "up",
        Icon: GroupIcon,
      },
      {
        label: "Modules Online",
        value: "12",
        trend: "-1.2%",
        trendDirection: "down",
        Icon: BoxIconLine,
      },
    ],
  };

  const metrics = metricsByRole[role] ?? metricsByRole["student"];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <m.Icon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {m.label}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {m.value}
              </h4>
            </div>
            <Badge color={m.trendDirection === "up" ? "success" : "error"}>
              {m.trendDirection === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {m.trend}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
