import { createClient } from "@/lib/supabase/server";
import { CollectionClient, DBCollectionItem } from "@/components/movie/CollectionClient";
import { redirect } from "next/navigation";

export default async function CollectionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: collectionData, error } = await supabase
    .from("collection_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching collection:", error);
  }

  const initialCollection: DBCollectionItem[] = collectionData || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <CollectionClient initialCollection={initialCollection} />
    </div>
  );
}
