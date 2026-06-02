import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { STAGING_REASONS } from "@/lib/warehouseHierarchy";
import { Progress } from "@/components/ui/progress";

export default function StagingBreakdown({ form, updateField, breakdownSum, stagingValid }) {
  const percentage = form.staging_total > 0 ? Math.min((breakdownSum / form.staging_total) * 100, 100) : 0;
  const remaining = form.staging_total - breakdownSum;

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-semibold text-sm">Staging Reason Breakdown</h4>
        <div className="flex items-center gap-2">
          {stagingValid ? (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Balanced
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-destructive">
              <AlertCircle className="h-3.5 w-3.5" /> {remaining > 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over`}
            </span>
          )}
        </div>
      </div>

      <Progress value={percentage} className="h-2" />

      <p className="text-xs text-muted-foreground">
        Breakdown must equal total staging pallets ({form.staging_total}). Currently: {breakdownSum}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STAGING_REASONS.map((reason) => (
          <div key={reason.id}>
            <Label className="text-xs text-muted-foreground">{reason.label}</Label>
            <Input
              type="number"
              min="0"
              value={form[reason.id]}
              onChange={(e) => updateField(reason.id, parseInt(e.target.value) || 0)}
              className="mt-1 h-9"
            />
          </div>
        ))}
      </div>
    </div>
  );
}