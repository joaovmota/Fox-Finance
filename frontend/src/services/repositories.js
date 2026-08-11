import { supabase } from "@/lib/supabaseClient";

async function currentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Authentication required");
  return data.user.id;
}

export async function getProfile() { const userId = await currentUserId(); return supabase.from("profiles").select("*").eq("user_id", userId).single(); }
export async function listAccounts() { const userId = await currentUserId(); return supabase.from("accounts").select("*").eq("user_id", userId).order("created_at"); }
export async function listTransactions({ from, to } = {}) { const userId = await currentUserId(); let query = supabase.from("transactions").select("*").eq("user_id", userId).order("transaction_date", { ascending: false }); if (from) query = query.gte("transaction_date", from); if (to) query = query.lte("transaction_date", to); return query; }