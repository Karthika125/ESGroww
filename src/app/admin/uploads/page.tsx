'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface UploadEntry {
  id: string;
  fileName: string;
  category: string;
  month: string;
  year: number;
  uploadDate: string;
  status: string;
  hospitalName: string;
}

interface CategorySummary {
  category: string;
  totalFiles: number;
  completeness: number;
  status: string;
}

export default function UploadsPage() {
  const [uploads, setUploads] = useState<UploadEntry[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchUploads();
  }, []);

  async function fetchUploads() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/uploads');
      if (!response.ok) throw new Error('Failed to fetch uploads');
      const data = await response.json();
      setUploads(data.uploads || []);
      setCategories(data.categories || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setUploads([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Uploaded':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'Processing':
        return <Clock className="w-4 h-4 text-amber-400 animate-spin" />;
      case 'Error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Electricity: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      Water: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Waste: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      Fuel: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Refrigerant: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      Transport: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    };
    return colors[category] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getStatus = (completeness: number) => {
    if (completeness === 100) return 'Complete';
    if (completeness >= 50) return 'Partial';
    if (completeness >= 25) return 'Low Data';
    return 'Insufficient';
  };

  const getStatusColorBg = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Partial':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Low Data':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Insufficient':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const filteredUploads =
    selectedCategory === 'all'
      ? uploads
      : uploads.filter(u => u.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Upload Management</h1>
          <p className="text-slate-400">
            Track operational datasets by category, month, completeness % and validation status
          </p>
        </div>

        {/* Category Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Category Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 rounded-lg border border-slate-700/50 p-5 cursor-pointer hover:border-slate-600/50 transition-all"
                onClick={() => setSelectedCategory(cat.category)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-200">{cat.category}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold border ${getCategoryColor(cat.category)}`}
                  >
                    {cat.totalFiles} files
                  </span>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Completeness</span>
                    <span className="text-xs font-semibold text-slate-200">{cat.completeness}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${cat.completeness}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColorBg(cat.status)}`}>
                  {cat.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Uploads Table */}
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            Recent Uploads
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin">
                <div className="w-8 h-8 border-3 border-slate-700 border-t-emerald-500 rounded-full"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
              Error: {error}
            </div>
          ) : filteredUploads.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No uploads found</p>
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/50">
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">File Name</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">Category</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">Month / Year</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">Organization</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">Upload Date</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {filteredUploads.map(upload => (
                      <tr key={upload.id} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-3 text-slate-200 font-medium truncate">{upload.fileName}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${getCategoryColor(upload.category)}`}>
                            {upload.category}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-300">
                          {upload.month} / {upload.year}
                        </td>
                        <td className="px-6 py-3 text-slate-300">{upload.hospitalName}</td>
                        <td className="px-6 py-3 text-slate-400 text-xs">
                          {new Date(upload.uploadDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(upload.status)}
                            <span className="text-xs font-medium text-slate-300">{upload.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
