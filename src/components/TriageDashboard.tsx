// TriageDashboard.tsx
import React, { useState, useEffect } from 'react';
import PatientList from './PatientList';
import PatientDetailModal from './PatientDetailModal';
import { fetchPatients, updatePatientStatus } from '../services/api';
import { Patient } from '../types/PatientTypes';
import { 
    FunnelIcon, 
    ArrowPathIcon, 
    ChartBarIcon,
    UserGroupIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const TriageDashboard: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        reviewStatus: 'all', // 'all' | 'needs-review' | 'reviewed'
        surgeryType: 'all',
        provider: 'all'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    const loadPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPatients();
            setPatients(data);
        } catch (error) {
            console.error('Error loading patients:', error);
            setError(error instanceof Error ? error.message : 'Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
        const interval = setInterval(loadPatients, 3000000);
        return () => clearInterval(interval);
    }, []);

    const handlePatientSelect = (patient: Patient) => {
        console.log('Selected patient:', patient);
        setSelectedPatient(patient);
    };

    const handleStatusUpdate = async (status: string) => {
        if (!selectedPatient) return;
        try {
            await updatePatientStatus(selectedPatient.id, status);
            await loadPatients();
            setSelectedPatient(null);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // Get unique values for filters
    const surgeryTypes = [...new Set(patients.map(p => p.surgeryType))];
    const providers = [...new Set(patients.map(p => p.assignedTo))];

    // Apply filters and search
    const filteredPatients = patients.filter(patient => {
        const matchesReviewStatus = 
            filters.reviewStatus === 'all' ? true :
            filters.reviewStatus === 'needs-review' ? patient.needsReview :
            !patient.needsReview;

        const matchesSurgeryType = 
            filters.surgeryType === 'all' || patient.surgeryType === filters.surgeryType;

        const matchesProvider = 
            filters.provider === 'all' || patient.assignedTo === filters.provider;

        const matchesSearch = 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.surgeryType.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesReviewStatus && matchesSurgeryType && matchesProvider && matchesSearch;
    });

    // Calculate statistics
    const stats = {
        total: patients.length,
        needsReview: patients.filter(p => p.needsReview).length,
        reviewed: patients.filter(p => !p.needsReview).length
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Patient Triage Dashboard</h1>
                        <button 
                            onClick={loadPatients}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            disabled={loading}
                        >
                            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <UserGroupIcon className="h-12 w-12 text-blue-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Patients</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <ClockIcon className="h-12 w-12 text-yellow-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Needs Review</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.needsReview}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <ChartBarIcon className="h-12 w-12 text-green-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Reviewed</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.reviewed}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search patients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Review Status</label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={filters.reviewStatus}
                                    onChange={(e) => setFilters({...filters, reviewStatus: e.target.value})}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="needs-review">Needs Review</option>
                                    <option value="reviewed">Reviewed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Surgery Type</label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={filters.surgeryType}
                                    onChange={(e) => setFilters({...filters, surgeryType: e.target.value})}
                                >
                                    <option value="all">All Types</option>
                                    {surgeryTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={filters.provider}
                                    onChange={(e) => setFilters({...filters, provider: e.target.value})}
                                >
                                    <option value="all">All Providers</option>
                                    {providers.map(provider => (
                                        <option key={provider} value={provider}>{provider}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient List */}
                {loading ? (
                    <div className="text-center py-4">Loading patients...</div>
                ) : error ? (
                    <div className="text-center py-4 text-red-600">Error loading patients: {error}</div>
                ) : patients.length === 0 ? (
                    <div className="text-center py-4">No patients found</div>
                ) : (
                    <PatientList patients={filteredPatients} onPatientSelect={handlePatientSelect} />
                )}
            </div>

            {/* Modal */}
            {selectedPatient && (
                <PatientDetailModal 
                    patient={selectedPatient}
                    onClose={() => {
                        console.log('Closing modal');
                        setSelectedPatient(null);
                    }}
                    onUpdateStatus={handleStatusUpdate}
                />
            )}
        </div>
    );
};

export default TriageDashboard;

