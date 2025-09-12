import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types/auth";

// Role-based data configuration
interface RoleChartData {
  title: string;
  seriesName: string;
  color: string;
  data: number[];
  tooltipFormatter: (val: number) => string;
  xAxisLabels: string[];
}

const getRoleChartData = (role: UserRole): RoleChartData => {
  switch (role) {
    case 'student':
      return {
        title: 'Weekly Attendance',
        seriesName: 'Days Present',
        color: '#465FFF',
        data: [5, 5.5, 4, 5.5, 5.0, 6, 4, 5, 5.5, 5.5, 5.0, 6],
        tooltipFormatter: (val: number) => `${val.toFixed(1)}/6 days`,
        xAxisLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12']
      };
    case 'admin':
      return {
        title: 'System Performance',
        seriesName: 'Uptime',
        color: '#10B981',
        data: [98.5, 99.2, 97.8, 98.9, 99.1, 98.7, 97.9, 98.8, 99.0, 98.6, 98.3, 99.3],
        tooltipFormatter: (val: number) => `${val}%`,
        xAxisLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      };
    case 'clerk':
      return {
        title: 'Record Processing',
        seriesName: 'Tasks Completed',
        color: '#F59E0B',
        data: [245, 312, 278, 289, 267, 298, 256, 284, 301, 275, 262, 315],
        tooltipFormatter: (val: number) => `${val} tasks`,
        xAxisLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      };
    case 'hostel-warden':
      return {
        title: 'Hostel Occupancy',
        seriesName: 'Occupancy',
        color: '#8B5CF6',
        data: [85.2, 92.1, 88.7, 90.3, 87.9, 91.5, 86.4, 89.8, 93.2, 88.1, 87.3, 94.7],
        tooltipFormatter: (val: number) => `${val}%`,
        xAxisLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      };
    default:
      return {
        title: 'Monthly Sales',
        seriesName: 'Sales',
        color: '#465fff',
        data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
        tooltipFormatter: (val: number) => `${val}`,
        xAxisLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      };
  }
};

export default function MonthlySalesChart() {
  const { user } = useAuth();
  const roleData = getRoleChartData(user?.role || 'student');
  
  const options: ApexOptions = {
    colors: [roleData.color],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: roleData.xAxisLabels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: roleData.tooltipFormatter,
      },
    },
  };
  const series = [
    {
      name: roleData.seriesName,
      data: roleData.data,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {roleData.title}
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
