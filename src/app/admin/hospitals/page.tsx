'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, MapPin, Users, SquareFeet, Building2, Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface HospitalWithData {
  id: string;
  hospitalName: string;
  sectorCode: string;
  accountStatus: string;
  country: string;
  state: string;
  builtUpArea: number;
  numberOfBeds: number;
  numberOfEmployees: number;
  averageDailyOccupancy: number;
  operatingHours: number;
  yearEstablished: number;
  esgScores: Array<{ overallScore: number }>;
  uploads: Array<{ id: string }>;
  _count: { uploads: number };
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<HospitalWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchHospitals();
  }, []);

  async function fetchHospitals() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/hospitals');
      if (!response.ok) throw new Error('Failed to fetch hospitals');
      const data = await response.json();
      setHospitals(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch =
      hospital.hospitalName.toLowerCase().includes(search.toLowerCase()) ||
      hospital.sectorCode.includes(search);
    const matchesStatus = statusFilter === 'all' || hospital.accountStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Pending Verification':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Locked':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getSectorLabel = (code: string) => {
    const sectors: { [key: string]: string } = {
      HOSP: 'Healthcare',
      BLDG: 'Building',
      MFGR: 'Manufacturing',
      TEXT: 'Textiles',
      ELEC: 'Electronics',
      FOOD: 'Food & Beverage',
      LOGI: 'Logistics',
      EDUC: 'Education',
      NGO: 'NGO',
      GEN: 'General',
    };
    return sectors[code] || code;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-slate-900">Organizations</h1>
            <p className="text-slate-600 mt-2">Manage hospitals and facilities across all sectors</p>
          </div>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Add Organization
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or sector..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending Verification">Pending</option>
            <option value="Locked">Locked</option>
          </select>
        </div>

        {/* Status Message */}
        <div className="mb-6 text-sm text-slate-400">
          Showing {filteredHospitals.length} of {hospitals.length} organizations
        </div>

        {/* Table */}
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
        ) : filteredHospitals.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No organizations found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHospitals.map(hospital => (
              <div
                key={hospital.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
                  {/* Left Column: Name and Status */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">{hospital.hospitalName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(hospital.accountStatus)}`}>
                        {hospital.accountStatus}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        {getSectorLabel(hospital.sectorCode)}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {hospital.state}, {hospital.country}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">ESG Score</p>
                      <p className="text-xl font-bold text-emerald-600">
                        {hospital.esgScores[0]?.overallScore?.toFixed(0) || '-'}%
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Uploads</p>
                      <p className="text-xl font-bold text-cyan-600">{hospital._count.uploads}</p>
                    </div>
                  </div>

                  {/* Right Column: Infrastructure */}
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-200">
                      <p className="text-slate-500 mb-1">Built-up Area</p>
                      <p className="font-semibold text-slate-900">{hospital.builtUpArea.toLocaleString()} sqft</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-200">
                      <p className="text-slate-500 mb-1">Beds</p>
                      <p className="font-semibold text-slate-900">{hospital.numberOfBeds}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-200">
                      <p className="text-slate-500 mb-1">Employees</p>
                      <p className="font-semibold text-slate-900">{hospital.numberOfEmployees}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Info Row */}
                <div className="grid grid-cols-4 gap-4 text-xs border-t border-slate-200/80 pt-4">
                  <div>
                    <p className="text-slate-500 mb-1">Daily Occupancy</p>
                    <p className="font-semibold text-slate-900">{hospital.averageDailyOccupancy}%</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Operating Hours</p>
                    <p className="font-semibold text-slate-200">{hospital.operatingHours}h/day</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Year Established</p>
                    <p className="font-semibold text-slate-200">{hospital.yearEstablished}</p>
                  </div>
                  <div className="flex items-end justify-end gap-2">
                    <button className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-xs font-medium transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-slate-700/20 hover:bg-slate-700/40 text-slate-400 rounded-lg text-xs font-medium transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}