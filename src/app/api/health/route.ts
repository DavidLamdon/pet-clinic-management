import { dbConnect } from "@/lib/mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    return Response.json({ ok: true, db: "connected" });
  } catch (err) {
    return Response.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
