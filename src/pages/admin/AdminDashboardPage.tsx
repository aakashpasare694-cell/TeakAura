import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Package,
  FolderTree,
  MessageSquareQuote,
  ArrowRight,
  TrendingUp,
  Download,
  Plus,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { EnquiryStatusBadge } from '../../components/admin/EnquiryStatusBadge';
import { Enquiry } from '../../types';
import { adminGetEnquiries, getProducts, getCategories } from '../../utils/api';
import { formatDate } from '../../utils/formatters';

export function AdminDashboardPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [enqRes, prodRes, catRes] = await Promise.all([
          adminGetEnquiries({}),
          getProducts({}),
          getCategories(),
        ]);
        setEnquiries(enqRes.enquiries.slice(0, 5));
        setCounts(enqRes.counts);
        setProductCount(prodRes.total);
        setCategoryCount(catRes.length);
      } catch (err) {
        console.error('Error loading dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return (
    <AdminLayout
      title="Workshop Dashboard"
      subtitle="Live lead pipeline, made-to-order requests, and furniture catalog"
      actions={
        <div className="flex items-center gap-3">
          <a
            href="/api/enquiries/export"
            download
            className="inline-flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Export Leads CSV</span>
          </a>

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teak-900 text-cream-50 rounded-xl text-xs font-semibold hover:bg-teak-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-gold-400" />
            <span>Manage Products</span>
          </Link>
        </div>
      }
    >
      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: New Leads */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-warm-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              New / Pending Leads
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900">
            {counts.New || 0}
          </div>
          <div className="text-xs text-stone-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Requires craftsman contact</span>
          </div>
        </div>

        {/* Card 2: Total Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-warm-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Total Enquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900">
            {counts.Total || enquiries.length}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            <span>Product, custom & contact leads</span>
          </div>
        </div>

        {/* Card 3: Products */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-warm-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Catalog Products
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900">
            {productCount}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            <span>Stored in Cloudflare D1</span>
          </div>
        </div>

        {/* Card 4: Categories */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-warm-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Active Categories
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900">
            {categoryCount}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            <span>Beds, Dining, Sofas, etc.</span>
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-warm-sm overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Recent Lead Submissions
            </h3>
            <p className="text-xs text-stone-500">
              Latest client enquiries from website and Meta ads
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-teak-900 hover:text-gold-700 flex items-center gap-1"
          >
            <span>View All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Phone / City</th>
                <th className="p-4">Subject / Item</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {enquiries.length > 0 ? (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-4 whitespace-nowrap text-stone-500">
                      {formatDate(enq.created_at)}
                    </td>
                    <td className="p-4 font-semibold text-stone-900">
                      {enq.name}
                    </td>
                    <td className="p-4">
                      <div>{enq.phone}</div>
                      <div className="text-[11px] text-stone-500">{enq.city}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-medium text-stone-900 truncate">
                        {enq.product_name || enq.custom_item_type || 'General Consultation'}
                      </div>
                      {enq.message && (
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          {enq.message}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <EnquiryStatusBadge status={enq.status} />
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to="/admin/enquiries"
                        className="text-gold-700 hover:underline font-semibold"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    No lead submissions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
