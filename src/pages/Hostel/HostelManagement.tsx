import React, { useMemo, useState } from "react";

type RoomStatus = "Vacant" | "Occupied" | "Maintenance";

interface RoomRow {
  id: string;
  block: string;
  roomNo: string;
  capacity: number;
  occupants: number;
  status: RoomStatus;
}

const MOCK_ROOMS: RoomRow[] = [
  { id: "R-1", block: "A", roomNo: "A-101", capacity: 2, occupants: 2, status: "Occupied" },
  { id: "R-2", block: "A", roomNo: "A-102", capacity: 2, occupants: 1, status: "Occupied" },
  { id: "R-3", block: "A", roomNo: "A-103", capacity: 2, occupants: 0, status: "Vacant" },
  { id: "R-4", block: "B", roomNo: "B-201", capacity: 3, occupants: 3, status: "Occupied" },
  { id: "R-5", block: "B", roomNo: "B-202", capacity: 3, occupants: 1, status: "Occupied" },
  { id: "R-6", block: "C", roomNo: "C-301", capacity: 2, occupants: 0, status: "Vacant" },
  { id: "R-7", block: "C", roomNo: "C-302", capacity: 2, occupants: 0, status: "Maintenance" },
];

const HostelManagement: React.FC = () => {
  const [rooms, setRooms] = useState<RoomRow[]>(MOCK_ROOMS);
  const [block, setBlock] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [query, setQuery] = useState<string>("");

  const stats = useMemo(() => {
    const total = rooms.length;
    const occupied = rooms.filter((r) => r.status === "Occupied").length;
    const vacant = rooms.filter((r) => r.status === "Vacant").length;
    const maint = rooms.filter((r) => r.status === "Maintenance").length;
    const capacity = rooms.reduce((a, r) => a + r.capacity, 0);
    const totalOcc = rooms.reduce((a, r) => a + r.occupants, 0);
    const utilization = capacity ? ((totalOcc / capacity) * 100).toFixed(0) : "0";
    return { total, occupied, vacant, maint, capacity, totalOcc, utilization };
  }, [rooms]);

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      const matchBlock = block === "All" || r.block === block;
      const matchStatus = status === "All" || r.status === (status as RoomStatus);
      const q = query.toLowerCase();
      const matchQ = !q || r.roomNo.toLowerCase().includes(q);
      return matchBlock && matchStatus && matchQ;
    });
  }, [rooms, block, status, query]);

  const blocks = ["All", ...Array.from(new Set(rooms.map((r) => r.block)))];

  const allocate = (id: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (r.status !== "Vacant") return r;
        return { ...r, occupants: Math.min(r.capacity, r.occupants + 1), status: r.occupants + 1 >= r.capacity ? "Occupied" : "Occupied" };
      })
    );
  };

  const deallocate = (id: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (r.occupants <= 0) return r;
        const newOcc = Math.max(0, r.occupants - 1);
        return { ...r, occupants: newOcc, status: newOcc === 0 ? "Vacant" : "Occupied" };
      })
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Hostel Management</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
          <p className="text-xs text-gray-500">Total Rooms</p>
          <p className="mt-1 text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
          <p className="text-xs text-gray-500">Occupied</p>
          <p className="mt-1 text-2xl font-semibold">{stats.occupied}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
          <p className="text-xs text-gray-500">Vacant</p>
          <p className="mt-1 text-2xl font-semibold">{stats.vacant}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
          <p className="text-xs text-gray-500">Utilization</p>
          <p className="mt-1 text-2xl font-semibold">{stats.utilization}%</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
          >
            {blocks.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
          >
            {(["All", "Vacant", "Occupied", "Maintenance"] as const).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            placeholder="Search room no (e.g., A-101)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-gray-100 bg-white dark:bg-gray-900 dark:ring-white/10">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Block</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Room</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Capacity</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Occupants</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{r.block}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{r.roomNo}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{r.capacity}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{r.occupants}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{r.status}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => allocate(r.id)}
                      disabled={r.status !== "Vacant"}
                      className="px-3 py-1 rounded-md text-white text-xs bg-green-600 disabled:opacity-50"
                    >
                      Allocate
                    </button>
                    <button
                      onClick={() => deallocate(r.id)}
                      disabled={r.occupants === 0}
                      className="px-3 py-1 rounded-md text-white text-xs bg-rose-600 disabled:opacity-50"
                    >
                      Deallocate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">No rooms found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HostelManagement;
