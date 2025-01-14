// src/components/PatientDetailModal.tsx
import React from 'react';
import { Patient, SurgeryRequirements } from '../types/PatientTypes';
import { 
    XMarkIcon, 
    UserCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    DocumentArrowDownIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import DocumentRequestGenerator from './DocumentRequestGenerator';

interface PatientDetailModalProps {
    patient: Patient;
    onClose: () => void;
    onUpdateStatus: (status: string) => void;
}

const RequirementStatus: React.FC<{ requirement: SurgeryRequirements }> = ({ requirement }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${
        requirement.met ? 'bg-green-50' : 'bg-red-50'
    }`}>
        <div>
            <p className="font-medium text-gray-900">{requirement.name}</p>
            <p className="text-sm text-gray-500">
                Current: {requirement.value} (Required: {requirement.required})
            </p>
        </div>
        {requirement.met ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
        ) : (
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
        )}
    </div>
);

const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
};

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose, onUpdateStatus }) => {
    if (!patient) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start overflow-y-auto z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl relative my-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white sticky top-0 z-10">
                    <button
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                        onClick={onClose}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                    <div className="flex items-start gap-4">
                        <UserCircleIcon className="h-16 w-16" />
                        <div>
                            <h2 className="text-2xl font-bold">{patient.name}</h2>
                            <div className="flex gap-4 mt-2 text-white/80">
                                <span>Age: {patient.age}</span>
                                <span>•</span>
                                <span>Gender: {patient.gender}</span>
                                <span>•</span>
                                <span>BMI: {patient.bmi}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                    {/* Main Content - 8 columns */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Top Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Surgery Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-md font-semibold text-gray-900 mb-2">Surgery</h3>
                                <p className="text-sm text-gray-600">Type: <span className="font-medium text-gray-900">{patient.surgeryType}</span></p>
                                <p className="text-sm text-gray-600">Reason: <span className="font-medium text-gray-900">{patient.reason}</span></p>
                            </div>
                            {/* Provider Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-md font-semibold text-gray-900 mb-2">Providers</h3>
                                <p className="text-sm text-gray-600">Assigned: <span className="font-medium text-gray-900">{patient.assignedTo}</span></p>
                                <p className="text-sm text-gray-600">Referring: <span className="font-medium text-gray-900">{patient.referringProvider}</span></p>
                            </div>
                        </div>

                        {/* Medical Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-md font-semibold text-gray-900">Medical Information</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Conditions</h4>
                                    <ul className="space-y-1">
                                        {patient.medicalHistory.map((condition, index) => (
                                            <li key={index} className="text-sm flex items-center text-gray-900">
                                                <span className="h-1 w-1 rounded-full bg-blue-500 mr-2" />
                                                {condition}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Medications</h4>
                                    <ul className="space-y-1">
                                        {patient.medications.map((medication, index) => (
                                            <li key={index} className="text-sm flex items-center text-gray-900">
                                                <span className="h-1 w-1 rounded-full bg-blue-500 mr-2" />
                                                {medication}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Clinical Notes */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-md font-semibold text-gray-900">Clinical Notes</h3>
                                <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                                    <PlusCircleIcon className="h-4 w-4" />
                                    Add Note
                                </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {patient.notes.map((note, index) => (
                                    <div key={index} className="bg-white p-2 rounded-md border border-gray-200 text-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                note.type === 'surgical' ? 'bg-blue-100 text-blue-700' :
                                                note.type === 'medical' ? 'bg-green-100 text-green-700' :
                                                note.type === 'requirement' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {note.type}
                                            </span>
                                            <span className="text-xs text-gray-500">{formatDate(note.timestamp)}</span>
                                        </div>
                                        <p className="text-gray-900">{note.content}</p>
                                        <p className="text-xs text-gray-500">By {note.author}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - 4 columns */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Candidacy Status */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-md font-semibold text-gray-900 mb-3">Surgery Requirements</h3>
                            <div className={`mb-3 flex items-center p-2 rounded-lg ${
                                patient.isCandidate 
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-red-50 text-red-700'
                            }`}>
                                {patient.isCandidate ? (
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                ) : (
                                    <ExclamationCircleIcon className="h-4 w-4 mr-2" />
                                )}
                                <span className="text-sm font-medium">
                                    {patient.isCandidate ? 'Eligible Candidate' : 'Not a Candidate'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {patient.surgeryRequirements.map((req, index) => (
                                    <RequirementStatus key={index} requirement={req} />
                                ))}
                            </div>
                        </div>

                        {/* Required Documents */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-md font-semibold text-gray-900 mb-3">Required Documents</h3>
                            <div className="space-y-2">
                                {patient.requiredDocuments.map((doc, index) => (
                                    <div key={index} className="bg-white p-2 rounded-md border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-900">{doc.type}</span>
                                            <div className="flex items-center gap-2">
                                                {doc.received && doc.url && (
                                                    <button
                                                        onClick={() => window.open(doc.url, '_blank')}
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        <DocumentArrowDownIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                                {doc.received ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
                                                )}
                                            </div>
                                        </div>
                                        {doc.received && doc.dateReceived && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Received: {formatDate(doc.dateReceived)}
                                            </p>
                                        )}
                                        {!doc.received && (
                                            <DocumentRequestGenerator
                                                patientName={patient.name}
                                                documentType={doc.type}
                                                referringProvider={patient.referringProvider}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 p-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onUpdateStatus(patient.needsReview ? 'reviewed' : 'needs-review')}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                        Mark as {patient.needsReview ? 'Reviewed' : 'Needs Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailModal;
