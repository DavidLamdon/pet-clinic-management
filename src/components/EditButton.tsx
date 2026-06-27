import { Patient } from "@/lib/types";
import { Pencil } from "lucide-react";

export function EditButton({
  onEdit,
  patient,
}: {
  onEdit: (p: Patient) => void;
  patient: Patient;
}) {
  return (
    <button
      type="button"
      onClick={() => onEdit(patient)}
      aria-label="Edit patient"
      className="text-muted-dark hover:text-gray-900"
    >
      <Pencil size={16} />
    </button>
  );
}
