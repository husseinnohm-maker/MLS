import { Package, AlertTriangle, ShoppingBag, ClipboardList } from "lucide-react";

export default function DashboardStats({ entries }) {
  const totalStaging = entries.reduce((s, e) => s + (e.staging_total || 0), 0);
  const totalDamage = entries.reduce((s, e) => s + (e.damage_pallets || 0), 0);
  const totalPosm = entries.reduce((s, e) => s + (e.posm_pallets || 0), 0);
  const totalEntries = entries.length;

  const stats = [
    { label: "Total Entries", value: totalEntries, icon: ClipboardList, color: "text-blue-600 bg-blue-50" },
    { label: "Staging Pallets", value: totalStaging, icon: Package, color: "text-amber-600 bg-amber-50" },
    { label: "Damage Pallets", value: totalDamage, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
    { label: "POSM Pallets", value: totalPosm, icon: ShoppingBag, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card border rounded-xl p-4 flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
            <s.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-heading font-bold">{s.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}