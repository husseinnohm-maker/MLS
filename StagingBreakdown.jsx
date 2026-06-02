import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import moment from "moment";

export default function ExportButton({ entries }) {
  const exportCSV = () => {
    const headers = [
      "Date", "Region", "Warehouse", "Room", "Temp Zone", "Division",
      "Staging Total", "Not Received", "Damage (Staging)", "Invoiced & Waiting",
      "Returned", "Picked & Waiting", "Damage Pallets", "POSM Pallets", "Notes"
    ];

    const rows = entries.map((e) => [
      e.entry_date,
      e.region,
      e.warehouse,
      e.room,
      e.temp_zone,
      e.division,
      e.staging_total || 0,
      e.staging_not_received || 0,
      e.staging_damage || 0,
      e.staging_invoiced_waiting || 0,
      e.staging_returned || 0,
      e.staging_picked_waiting || 0,
      e.damage_pallets || 0,
      e.posm_pallets || 0,
      `"${(e.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PCR_Export_${moment().format("YYYY-MM-DD")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={exportCSV} disabled={entries.length === 0}>
      <Download className="h-4 w-4 mr-2" /> Export CSV
    </Button>
  );
}