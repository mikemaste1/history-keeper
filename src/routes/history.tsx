import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — History Logger" },
      { name: "description", content: "All saved text entries." },
    ],
  }),
  component: HistoryPage,
});

type Log = { id: string; text: string; created_at: string };

function HistoryPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["history_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("history_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Log[];
    },
  });

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
          <Link to="/">
            <Button variant="outline" size="sm">← Back</Button>
          </Link>
        </div>

        {isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
        {error && <p className="text-destructive text-sm">{(error as Error).message}</p>}

        {data && data.length === 0 && (
          <p className="text-muted-foreground text-sm">No entries yet.</p>
        )}

        <ul className="space-y-2">
          {data?.map((log) => (
            <li
              key={log.id}
              className="rounded-md border border-border bg-card p-4 text-card-foreground"
            >
              <p className="text-sm">{log.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}