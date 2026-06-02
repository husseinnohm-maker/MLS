import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#1e40af", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#6366f1", "#0d9488"];

export default function DashboardCharts({ entries }) {
  const byRegion = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      if (!map[e.region]) map[e.region] = { region: e.region, staging: 0, damage: 0, posm: 0 };
      map[e.region].staging += e.staging_total || 0;
      map[e.region].damage += e.damage_pallets || 0;
      map[e.region].posm += e.posm_pallets || 0;
    });
    return Object.values(map);
  }, [entries]);

  const byDivision = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      if (!map[e.division]) map[e.division] = { name: e.division, value: 0 };
      map[e.division].value += (e.staging_total || 0) + (e.damage_pallets || 0) + (e.posm_pallets || 0);
    });
    return Object.values(map).filter((d) => d.value > 0);
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card border rounded-xl p-4">
        <h3 className="font-heading font-semibold text-sm mb-4">Pallets by Region</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={byRegion}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="region" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="staging" name="Staging" fill="#1e40af" radius={[4, 4, 0, 0]} />
            <Bar dataKey="damage" name="Damage" fill="#dc2626" radius={[4, 4, 0, 0]} />
            <Bar dataKey="posm" name="POSM" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border rounded-xl p-4">
        <h3 className="font-heading font-semibold text-sm mb-4">Distribution by Division</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={byDivision} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {byDivision.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}