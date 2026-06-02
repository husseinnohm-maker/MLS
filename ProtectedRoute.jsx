const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import moment from "moment";

export default function DashboardTable({ entries, isAdmin }) {
  const queryClient = useQueryClient();

  const deleteEntry = useMutation({
    mutationFn: (id) => db.entities.PalletEntry.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pallet-entries"] });
      toast.success("Entry deleted");
    },
  });

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-heading">No entries yet</p>
        <p className="text-sm mt-1">Data will appear here once submissions are made.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold">Region</TableHead>
              <TableHead className="text-xs font-semibold">Warehouse</TableHead>
              <TableHead className="text-xs font-semibold">Room</TableHead>
              <TableHead className="text-xs font-semibold">Temp Zone</TableHead>
              <TableHead className="text-xs font-semibold">Division</TableHead>
              <TableHead className="text-xs font-semibold text-right">Staging</TableHead>
              <TableHead className="text-xs font-semibold text-right">Damage</TableHead>
              <TableHead className="text-xs font-semibold text-right">POSM</TableHead>
              {isAdmin && <TableHead className="text-xs font-semibold w-16"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-muted/30">
                <TableCell className="text-sm">{moment(entry.entry_date).format("DD MMM")}</TableCell>
                <TableCell className="text-sm">{entry.region}</TableCell>
                <TableCell className="text-sm font-medium">{entry.warehouse}</TableCell>
                <TableCell className="text-sm">{entry.room}</TableCell>
                <TableCell className="text-sm">{entry.temp_zone}</TableCell>
                <TableCell className="text-sm">{entry.division}</TableCell>
                <TableCell className="text-sm text-right font-mono">{entry.staging_total || 0}</TableCell>
                <TableCell className="text-sm text-right font-mono">{entry.damage_pallets || 0}</TableCell>
                <TableCell className="text-sm text-right font-mono">{entry.posm_pallets || 0}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteEntry.mutate(entry.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}