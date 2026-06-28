"use client";

import { Modal } from "./Modal";

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
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="px-4 py-2 bg-danger hover:bg-danger-hover text-white rounded disabled:opacity-50"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
