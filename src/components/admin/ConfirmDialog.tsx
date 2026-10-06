import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-warm-xl border border-teak-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">{title}</h3>
            <p className="text-xs text-stone-500 mt-0.5">Please confirm this action</p>
          </div>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors flex items-center gap-2 ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-teak-900 hover:bg-teak-800'
            }`}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
