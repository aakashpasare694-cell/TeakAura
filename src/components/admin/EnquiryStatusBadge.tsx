import { EnquiryStatus } from '../../types';

interface EnquiryStatusBadgeProps {
  status: EnquiryStatus;
  onChangeStatus?: (newStatus: EnquiryStatus) => void;
  disabled?: boolean;
}

const statusConfig: Record<EnquiryStatus, { bg: string; text: string; border: string }> = {
  New: {
    bg: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
  },
  Contacted: {
    bg: 'bg-blue-50 text-blue-700',
    border: 'border-blue-300',
    text: 'text-blue-700',
  },
  Quoted: {
    bg: 'bg-amber-50 text-amber-800',
    border: 'border-amber-300',
    text: 'text-amber-800',
  },
  Won: {
    bg: 'bg-purple-50 text-purple-700',
    border: 'border-purple-300',
    text: 'text-purple-700',
  },
  Lost: {
    bg: 'bg-stone-100 text-stone-600',
    border: 'border-stone-300',
    text: 'text-stone-600',
  },
};

export function EnquiryStatusBadge({
  status,
  onChangeStatus,
  disabled = false,
}: EnquiryStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.New;

  if (!onChangeStatus) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.border}`}
      >
        {status}
      </span>
    );
  }

  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(e) => onChangeStatus(e.target.value as EnquiryStatus)}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition-colors ${config.bg} ${config.border}`}
    >
      <option value="New">New</option>
      <option value="Contacted">Contacted</option>
      <option value="Quoted">Quoted</option>
      <option value="Won">Won</option>
      <option value="Lost">Lost</option>
    </select>
  );
}
