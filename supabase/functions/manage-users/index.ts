import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      return json(500, { error: "Missing required environment variables" });
    }

    const authHeader =
      req.headers.get("authorization") ??
      req.headers.get("Authorization") ??
      "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!jwt) {
      return json(401, { error: "Missing Authorization header" });
    }

    const body = await req.json();
    const action = String(body?.action || "").toLowerCase();

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: authUser, error: authError } = await adminClient.auth.getUser(jwt);
    if (authError || !authUser?.user) {
      return json(401, { error: authError?.message || "Unauthorized" });
    }

    const requesterId = authUser.user.id;
    const { data: requesterProfile, error: requesterError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", requesterId)
      .maybeSingle();

    if (requesterError) {
      return json(500, { error: requesterError.message });
    }

    let requesterRole = String(requesterProfile?.role || "").toUpperCase();
    if (!requesterRole) {
      const { data: requesterProfil, error: requesterProfilError } = await adminClient
        .from("profils")
        .select("role")
        .eq("id", requesterId)
        .maybeSingle();

      if (requesterProfilError) {
        return json(500, { error: requesterProfilError.message });
      }

      requesterRole = String(requesterProfil?.role || "").toUpperCase();
    }

    if (requesterRole !== "ADMIN") {
      return json(403, { error: "Access denied: admin only" });
    }

    if (action === "create") {
      const email = String(body?.email || "").trim().toLowerCase();
      const password = String(body?.password || "");
      const fullName = String(body?.full_name || "").trim();
      const role = String(body?.role || "GESTIONNAIRE").toUpperCase();

      if (!email || !password) {
        return json(400, { error: "email and password are required" });
      }

      if (!["ADMIN", "GESTIONNAIRE"].includes(role)) {
        return json(400, { error: "role must be ADMIN or GESTIONNAIRE" });
      }

      const { data: created, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

      if (createError || !created?.user) {
        return json(400, { error: createError?.message || "Unable to create auth user" });
      }

      const userId = created.user.id;

      const { error: profileError } = await adminClient
        .from("profiles")
        .upsert(
          {
            id: userId,
            full_name: fullName || null,
            role,
          },
          { onConflict: "id" }
        );

      if (profileError) {
        await adminClient.auth.admin.deleteUser(userId);
        return json(400, { error: profileError.message });
      }

      await adminClient
        .from("profils")
        .upsert(
          {
            id: userId,
            nom: fullName || email,
            role: role === "ADMIN" ? "admin" : "gestionnaire",
          },
          { onConflict: "id" }
        );

      return json(200, {
        user: {
          id: userId,
          email,
          full_name: fullName || null,
          role,
        },
      });
    }

    if (action === "delete") {
      const userId = String(body?.user_id || "").trim();
      if (!userId) return json(400, { error: "user_id is required" });

      if (userId === requesterId) {
        return json(400, { error: "You cannot delete your own account" });
      }

      await adminClient.from("profils").delete().eq("id", userId);
      await adminClient.from("profiles").delete().eq("id", userId);

      const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
      if (deleteError) {
        return json(400, { error: deleteError.message });
      }

      return json(200, { success: true });
    }

    return json(400, { error: "Invalid action" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json(500, { error: message });
  }
});
