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
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
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
            console.log('🔄 Loading patients...');
            const data = await fetchPatients();
            console.log('📊 Loaded patients:', data.length);
            setPatients(data);
        } catch (error) {
            console.error('❌ Error in loadPatients:', error);
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

    // Separate patients by review status
    const needsReviewPatients = filteredPatients
        .filter(p => p.needsReview && p.isCandidate)
        .sort((a, b) => b.priorityScore - a.priorityScore);
    const reviewedPatients = filteredPatients
        .filter(p => !p.needsReview && p.isCandidate)
        .sort((a, b) => {
            // Ensure both have valid scheduled dates
            if (!a.scheduledDate || !b.scheduledDate) return 0;
            // Sort by earliest scheduled date first
            return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
        });
    const rejectedPatients = filteredPatients
        .filter(p => !p.needsReview && !p.isCandidate)
        .sort((a, b) => new Date(b.reviewedAt!).getTime() - new Date(a.reviewedAt!).getTime());

    const formatScheduledDate = (dateString: string | Date) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading patients...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-xl font-semibold mb-2">Error loading patients</p>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={loadPatients}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Corvus
                                <span className="text-blue-200 ml-2 text-xl font-normal">
                                    Patient Triage Dashboard
                                </span>
                            </h1>
                        </div>
                        <button 
                            onClick={loadPatients}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
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

                {/* Needs Review Section - Make it more prominent */}
                <div className="mb-12">
                    <div className="bg-white rounded-lg shadow-lg border-2 border-blue-200 p-6">
                        <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                            <ClockIcon className="h-8 w-8 text-blue-500 mr-2" />
                            Needs Review ({needsReviewPatients.length})
                        </h2>
                        <PatientList 
                            patients={needsReviewPatients}
                            onPatientSelect={handlePatientSelect}
                            highlight={true}
                        />
                    </div>
                </div>

                {/* Reviewed Sections - Grid layout for Scheduled and Rejected */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Reviewed & Scheduled Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                            Reviewed & Scheduled ({reviewedPatients.length})
                        </h2>
                        <div className="space-y-4">
                            {reviewedPatients.map(patient => (
                                <div 
                                    key={patient.id}
                                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handlePatientSelect(patient)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{patient.name}</h3>
                                            <p className="text-sm text-gray-500">{patient.surgeryType}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-green-600">
                                                Scheduled: {patient.scheduledDate ? formatScheduledDate(patient.scheduledDate) : 'Not Scheduled'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Reviewed: {new Date(patient.reviewedAt!).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rejected Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
                            Not Eligible ({rejectedPatients.length})
                        </h2>
                        <div className="space-y-4">
                            {rejectedPatients.map(patient => (
                                <div 
                                    key={patient.id}
                                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handlePatientSelect(patient)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{patient.name}</h3>
                                            <p className="text-sm text-gray-500">{patient.surgeryType}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">
                                                Reviewed: {new Date(patient.reviewedAt!).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-red-500">
                                                Not eligible for surgery
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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

