"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPatient,
  updatePatient,
  deletePatient,
} from "@/lib/api/patients";
import { PATIENTS_QUERY_KEY } from "../constants";

export function usePatientMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [PATIENTS_QUERY_KEY] });

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
