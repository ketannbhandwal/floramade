import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized - admin only" }, { status: 401 });
    }

    const body = await req.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ message: "Invalid orderedIds array" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Update each product's sortOrder in Supabase in parallel
    await Promise.all(
      orderedIds.map(async (id, index) => {
        const { data: row, error: fetchErr } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (fetchErr) {
          console.error(`Error fetching product ${id}:`, fetchErr);
          return;
        }

        if (row) {
          const updatedData = {
            ...row.data,
            sortOrder: index,
            order: index,
          };

          const { error: updateErr } = await supabase
            .from("products")
            .update({
              data: updatedData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", id);

          if (updateErr) {
            console.error(`Error updating product order for ${id}:`, updateErr);
          }
        }
      })
    );

    try {
      revalidateTag("products");
      revalidatePath("/");
      revalidatePath("/collection");
    } catch {}

    return NextResponse.json({ 
      success: true, 
      message: "Products reordered successfully" 
    });
  } catch (error) {
    console.error("Failed to reorder products:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

