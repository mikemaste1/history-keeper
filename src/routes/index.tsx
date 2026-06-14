import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "History Logger" },
      { name: "description", content: "Save text entries and view your history." },
    ],
  }),
  component: Index,
});

function Index() {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (value: string) => {
      const { error } = await supabase.from("history_logs").insert({ text: value });
      if (error) throw error;
    },
    onSuccess: () => {
      setText("");
      toast.success("Saved!");
      queryClient.invalidateQueries({ queryKey: ["history_logs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">History Logger</h1>
          <p className="text-muted-foreground text-sm">Save an entry and view it on the history page.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) saveMutation.mutate(text.trim());
          }}
          className="flex gap-2"
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
            disabled={saveMutation.isPending}
          />
          <Button type="submit" disabled={!text.trim() || saveMutation.isPending}>
            Save
          </Button>
        </form>
        <div className="text-center">
          <Link to="/history" className="text-sm text-primary underline underline-offset-4">
            View history →
          </Link>
        </div>
      </div>
    </div>
  );
}
