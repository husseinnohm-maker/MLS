import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { REGIONS, DIVISIONS, TEMP_ZONES } from "@/lib/warehouseHierarchy";
import { RotateCcw } from "lucide-react";

export default function DashboardFilters({ filters, setFilters }) {
  const reset = () =>
    setFilters({ region: "", division: "", temp_zone: "", date_from: "", date_to: "" });

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="min-w-[140px]">
        <Select value={filters.region} onValueChange={(v) => setFilters((p) => ({ ...p, region: v }))}>
          <SelectTrigger className="h-9"><SelectValue placeholder="All Regions" /></SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[140px]">
        <Select value={filters.division} onValueChange={(v) => setFilters((p) => ({ ...p, division: v }))}>
          <SelectTrigger className="h-9"><SelectValue placeholder="All Divisions" /></SelectTrigger>
          <SelectContent>
            {DIVISIONS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[140px]">
        <Select value={filters.temp_zone} onValueChange={(v) => setFilters((p) => ({ ...p, temp_zone: v }))}>
          <SelectTrigger className="h-9"><SelectValue placeholder="All Temp Zones" /></SelectTrigger>
          <SelectContent>
            {TEMP_ZONES.map((tz) => (
              <SelectItem key={tz} value={tz}>{tz}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input
        type="date"
        value={filters.date_from}
        onChange={(e) => setFilters((p) => ({ ...p, date_from: e.target.value }))}
        className="h-9 w-[150px]"
        placeholder="From"
      />
      <Input
        type="date"
        value={filters.date_to}
        onChange={(e) => setFilters((p) => ({ ...p, date_to: e.target.value }))}
        className="h-9 w-[150px]"
        placeholder="To"
      />

      <Button variant="ghost" size="sm" onClick={reset} className="h-9">
        <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
      </Button>
    </div>
  );
}