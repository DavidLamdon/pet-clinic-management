import { dbConnect } from "@/lib/mongoose";
import { Patient } from "@/models/Patient";
import { patientSchema } from "@/lib/validation";
import { z } from "zod";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const parsed = patientSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }
  const updated = await Patient.findByIdAndUpdate(id, parsed.data, {
    new: true,
  });
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  const { id } = await params;
  const deleted = await Patient.findByIdAndDelete(id);
  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}
