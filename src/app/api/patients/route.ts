import { dbConnect } from "@/lib/mongoose";
import { Patient } from "@/models/Patient";
import { patientSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  const patients = await Patient.find().sort({ createdAt: -1 }).lean();
  return Response.json(patients);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const parsed = patientSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const patient = await Patient.create(parsed.data);
  return Response.json(patient, { status: 201 });
}
