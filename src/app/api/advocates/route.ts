import db from "../../../db";
import { advocates } from "../../../db/schema";

// Quick win for caching
export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
  try {
    const data = await db.select().from(advocates);

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error getting advocates", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
