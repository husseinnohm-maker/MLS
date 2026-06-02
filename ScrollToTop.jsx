const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { REGIONS, WAREHOUSES, ROOMS, TEMP_ZONES, DIVISIONS } from "@/lib/warehouseHierarchy";
import StagingBreakdown from "./StagingBreakdown";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function DataEntryForm({ user }) {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    entry_date: today,
    region: user?.assigned_region || "",
    warehouse: user?.assigned_warehouse || "",
    room: "",
    temp_zone: "",
    division: "",
    staging_total: 0,
    staging_not_received: 0,
    staging_damage: 0,
    staging_invoiced_waiting: 0,
    staging_returned: 0,
    staging_picked_waiting: 0,
    damage_pallets: 0,
    posm_pallets: 0,
    notes: "",
  });

  const warehouses = useMemo(() => WAREHOUSES[form.region] || [], [form.region]);
  const rooms = useMemo(() => ROOMS[form.warehouse] || [], [form.warehouse]);

  const breakdownSum =
    (form.staging_not_received || 0) +
    (form.staging_damage || 0) +
    (form.staging_invoiced_waiting || 0) +
    (form.staging_returned || 0) +
    (form.staging_picked_waiting || 0);

  const stagingValid = form.staging_total === 0 || breakdownSum === form.staging_total;
  const canSubmit =
    form.region && form.warehouse && form.room && form.temp_zone && form.division && stagingValid;

  const createEntry = useMutation({
    mutationFn: (data) => db.entities.PalletEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pallet-entries"] });
      toast.success("Entry recorded successfully!");
      setForm((prev) => ({
        ...prev,
        room: "",
        temp_zone: "",
        division: "",
        staging_total: 0,
        staging_not_received: 0,
        staging_damage: 0,
        staging_invoiced_waiting: 0,
        staging_returned: 0,
        staging_picked_waiting: 0,
        damage_pallets: 0,
        posm_pallets: 0,
        notes: "",
      }));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    createEntry.mutate(form);
  };

  const updateField = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "region") {
        next.warehouse = "";
        next.room = "";
      }
      if (field === "warehouse") {
        next.room = "";
      }
      return next;
    });
  };

  const isWarehouseUser = user?.role === "warehouse_user";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date */}
      <div>
        <Label className="text-sm font-medium text-muted-foreground">Date</Label>
        <Input
          type="date"
          value={form.entry_date}
          onChange={(e) => updateField("entry_date", e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Cascading Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Region</Label>
          <Select value={form.region} onValueChange={(v) => updateField("region", v)} disabled={isWarehouseUser && user?.assigned_region}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select Region" /></SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground">Warehouse</Label>
          <Select value={form.warehouse} onValueChange={(v) => updateField("warehouse", v)} disabled={!form.region || (isWarehouseUser && user?.assigned_warehouse)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select Warehouse" /></SelectTrigger>
            <SelectContent>
              {warehouses.map((w) => (
                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground">Room</Label>
          <Select value={form.room} onValueChange={(v) => updateField("room", v)} disabled={!form.warehouse}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select Room" /></SelectTrigger>
            <SelectContent>
              {rooms.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground">Temperature Zone</Label>
          <Select value={form.temp_zone} onValueChange={(v) => updateField("temp_zone", v)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select Temp Zone" /></SelectTrigger>
            <SelectContent>
              {TEMP_ZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <Label className="text-sm font-medium text-muted-foreground">Division / Client</Label>
          <Select value={form.division} onValueChange={(v) => updateField("division", v)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select Division" /></SelectTrigger>
            <SelectContent>
              {DIVISIONS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pallet Counts */}
      <div className="border-t pt-6 space-y-4">
        <h3 className="font-heading font-semibold text-lg">Pallet Counts</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Total Staging Pallets</Label>
            <Input
              type="number"
              min="0"
              value={form.staging_total}
              onChange={(e) => updateField("staging_total", parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Damage Pallets</Label>
            <Input
              type="number"
              min="0"
              value={form.damage_pallets}
              onChange={(e) => updateField("damage_pallets", parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">POSM Pallets</Label>
            <Input
              type="number"
              min="0"
              value={form.posm_pallets}
              onChange={(e) => updateField("posm_pallets", parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Staging Breakdown */}
      {form.staging_total > 0 && (
        <StagingBreakdown
          form={form}
          updateField={updateField}
          breakdownSum={breakdownSum}
          stagingValid={stagingValid}
        />
      )}

      {/* Notes */}
      <div>
        <Label className="text-sm font-medium text-muted-foreground">Notes (optional)</Label>
        <Textarea
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Any additional notes..."
          className="mt-1"
          rows={2}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!canSubmit || createEntry.isPending}
        className="w-full h-12 text-base font-semibold"
      >
        {createEntry.isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...</>
        ) : (
          <><CheckCircle2 className="h-4 w-4 mr-2" /> Submit Entry</>
        )}
      </Button>
    </form>
  );
}