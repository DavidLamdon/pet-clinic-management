"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPatient,
  updatePatient,
  deletePatient,
} from "@/lib/api/patients";

export function usePatientMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["patients"] });

  const create = useMutation({
    mutationFn: createPatient,
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: updatePatient,
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: deletePatient,
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
