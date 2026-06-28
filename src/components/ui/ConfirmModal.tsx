"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";

export function ConfirmModal({
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  isPending = false,
}: {
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
  return (
    <Modal onClose={onCancel} className="max-w-sm">
      <h2 className="text-lg font-medium mb-2">{title}</h2>
      <p className="text-sm text-muted-dark mb-6">{message}</p>
      <div className="flex gap-2 justify-start">
        <Button variant="danger" onClick={onConfirm} disabled={isPending}>
          {confirmLabel}
        </Button>
        <Button onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
