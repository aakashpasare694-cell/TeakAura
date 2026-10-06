import { useState, useEffect } from 'react';
import { Download, Search, Trash2, Phone, MapPin, Eye, ExternalLink, MessageSquare, Check, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { EnquiryStatusBadge } from '../../components/admin/EnquiryStatusBadge';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Enquiry, EnquiryStatus } from '../../types';
import { adminGetEnquiries, adminUpdateEnquiry, adminDeleteEnquiry } from '../../utils/api';
import { formatDateTime } from '../../utils/formatters';
import { BRAND } from '../../config/brand';

const statusTabs = ['All', 'New', 'Contacted', 'Quoted', 'Won', 'Lost'];

export function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Notes inline editing state
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // Image modal state
  const [previewImages, setPreviewImages] = useState<string[] | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await adminGetEnquiries({
        status: activeTab !== 'All' ? activeTab : undefined,
        search: search || undefined,
      });
      setEnquiries(res.enquiries);
      setCounts(res.counts);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [activeTab, search]);

  const handleStatusChange = async (enquiryId: number, newStatus: EnquiryStatus) => {
    await adminUpdateEnquiry(enquiryId, { status: newStatus });
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
    );
  };

  const handleSaveNotes = async (enquiryId: number) => {
    await adminUpdateEnquiry(enquiryId, { admin_notes: notesDraft });
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, admin_notes: notesDraft } : e))
    );
    setEditingNotesId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteEnquiry(deleteTarget.id);
      setEnquiries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete enquiry error:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Enquiries & Lead Pipeline"
      subtitle="Direct CRM of customer enquiries, WhatsApp follow-ups, and custom orders"
      actions={
        <a
          href="/api/enquiries/export"
          download
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-stone-600" />
          <span>Export All Leads (CSV)</span>
        </a>
      }
    >
      {/* Top Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-warm-sm mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Status Tabs with Counters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = activeTab === tab;
            const count = counts[tab] !== undefined ? counts[tab] : (tab === 'All' ? counts.Total || enquiries.length : 0);

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-teak-900 text-cream-50 shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-gold-500 text-charcoal-950 font-bold' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-warm-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Lead ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Requirement / Product</th>
                <th className="p-4">Images</th>
                <th className="p-4">Status</th>
                <th className="p-4">Workshop Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {enquiries.length > 0 ? (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* ID & Date */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-mono text-stone-400 font-semibold">#{enq.id}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {formatDateTime(enq.created_at)}
                      </div>
                      <span className="inline-block mt-1 uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                        {enq.enquiry_type}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="p-4">
                      <div className="font-bold text-stone-900 text-sm">{enq.name}</div>
                      <div className="flex items-center gap-1.5 text-stone-600 mt-1">
                        <Phone className="w-3 h-3 text-gold-600" />
                        <a
                          href={`tel:${enq.phone}`}
                          className="hover:underline font-mono text-[11px]"
                        >
                          {enq.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500 mt-0.5 text-[11px]">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{enq.city}</span>
                      </div>
                    </td>

                    {/* Requirement details */}
                    <td className="p-4 max-w-xs">
                      {enq.product_name && (
                        <div className="font-semibold text-teak-950 truncate">
                          {enq.product_name}
                        </div>
                      )}
                      {enq.custom_item_type && (
                        <div className="font-semibold text-teak-950 truncate">
                          Custom: {enq.custom_item_type}
                        </div>
                      )}
                      {enq.approximate_size && (
                        <div className="text-[11px] text-stone-500">
                          Size: {enq.approximate_size}
                        </div>
                      )}
                      {enq.budget_range && (
                        <div className="text-[11px] text-gold-700 font-medium">
                          Budget: {enq.budget_range}
                        </div>
                      )}
                      {enq.message && (
                        <p className="text-[11px] text-stone-600 mt-1 line-clamp-2 italic bg-stone-50 p-1.5 rounded">
                          "{enq.message}"
                        </p>
                      )}
                    </td>

                    {/* Reference Images */}
                    <td className="p-4">
                      {enq.reference_images && enq.reference_images.length > 0 ? (
                        <button
                          onClick={() => setPreviewImages(enq.reference_images || [])}
                          className="flex items-center gap-1 text-[11px] text-teak-900 font-semibold bg-cream-100 hover:bg-cream-200 px-2 py-1 rounded-lg border border-teak-200"
                        >
                          <Eye className="w-3.5 h-3.5 text-gold-600" />
                          <span>{enq.reference_images.length} Photo(s)</span>
                        </button>
                      ) : (
                        <span className="text-stone-400 text-[11px]">None</span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4 whitespace-nowrap">
                      <EnquiryStatusBadge
                        status={enq.status}
                        onChangeStatus={(newSt) => handleStatusChange(enq.id, newSt)}
                      />
                    </td>

                    {/* Workshop Notes inline editor */}
                    <td className="p-4 max-w-xs">
                      {editingNotesId === enq.id ? (
                        <div className="space-y-1.5">
                          <textarea
                            rows={2}
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            placeholder="Add internal notes e.g. Sent sample photos..."
                            className="w-full text-xs p-1.5 border border-gold-400 rounded-lg focus:outline-none"
                          />
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="p-1 text-stone-400 hover:text-stone-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleSaveNotes(enq.id)}
                              className="p-1 bg-teak-900 text-white rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNotesId(enq.id);
                            setNotesDraft(enq.admin_notes || '');
                          }}
                          className="cursor-pointer group p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                          title="Click to edit internal note"
                        >
                          {enq.admin_notes ? (
                            <span className="text-stone-700 text-[11px]">{enq.admin_notes}</span>
                          ) : (
                            <span className="text-stone-400 text-[11px] italic group-hover:text-stone-600">
                              + Add workshop note
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Instant WhatsApp Action */}
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${enq.name}! We received your enquiry for ${enq.product_name || enq.custom_item_type || 'teakwood furniture'} at ${BRAND.name}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-[#25D366]/10 text-[#1EBE5D] hover:bg-[#25D366] hover:text-white rounded-lg transition-colors"
                          title="Message on WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {/* Delete button */}
                        <button
                          onClick={() => setDeleteTarget(enq)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    No enquiries found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reference Images Preview Modal */}
      {previewImages && (
        <div
          className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImages(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Uploaded Reference Photos
              </h3>
              <button
                onClick={() => setPreviewImages(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previewImages.map((url, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-stone-200 relative group aspect-square">
                  <img src={url} alt={`Reference photo ${i + 1}`} className="w-full h-full object-cover" />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-charcoal-950/80 text-white p-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    <span>Enlarge</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Lead Enquiry?"
        message={`Are you sure you want to permanently delete the enquiry from "${deleteTarget?.name}"?`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
