// src/components/PatientDetailModal.tsx
import React, { useState } from 'react';
import { Patient, SurgeryRequirements } from '../types/PatientTypes';
import { 
    XMarkIcon, 
    UserCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    DocumentArrowDownIcon,
    PlusCircleIcon,
    ArrowTopRightOnSquareIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import DocumentRequestGenerator from './DocumentRequestGenerator';
import SchedulingModal from './SchedulingModal';
import ReviewStepper from './ReviewStepper';
import {AIChat} from "./AIChatComponent";

interface PatientDetailModalProps {
    patient: Patient;
    onClose: () => void;
    onUpdateStatus: (status: string) => void;
}

interface TimeSlot {
    id: string;
    date: Date;
    provider: string;
    available: boolean;
}

interface RequirementStatus {
    label: string;
    met: boolean;
    critical: boolean;
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
    const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    const openEHR = () => {
        if (!patient?.ehrId) return;
        const ehrBaseUrl = 'https://ehr.example.com/patient/';
        window.open(`${ehrBaseUrl}${patient.ehrId}`, '_blank');
    };

    if (!patient) return null;

    const getReferralTypeDisplay = (type: 'self' | 'external' | 'internal') => {
        const displays = {
            'self': 'Self',
            'external': 'External',
            'internal': 'Internal'
        };
        return displays[type] || 'Unknown';
    };

    const getReferralTypeStyles = (type: 'self' | 'external' | 'internal') => {
        const styles = {
            'internal': 'bg-blue-100 text-blue-800',
            'external': 'bg-purple-100 text-purple-800',
            'self': 'bg-green-100 text-green-800'
        };
        return styles[type] || 'bg-gray-100 text-gray-800';
    };

    const referralTypeDisplay = patient.referralType
        ? patient.referralType.charAt(0).toUpperCase() + patient.referralType.slice(1)
        : 'Unknown';

    const scheduledDateDisplay = patient.scheduledDate
        ? new Date(patient.scheduledDate).toLocaleDateString()
        : 'Not scheduled';

    const reviewedDateDisplay = patient.reviewedAt
        ? new Date(patient.reviewedAt).toLocaleDateString()
        : 'Not reviewed';

    const handleScheduleConfirm = (slot: TimeSlot) => {
        console.log('Scheduling appointment:', {
            patientId: patient.id,
            slot
        });
        setIsSchedulingOpen(false);
        setSelectedSlot(null);
    };

    const getReviewSteps = () => {
        return [
            {
                label: 'Documents Received',
                completed: patient.requiredDocuments.every(doc => doc.received),
                critical: true
            },
            {
                label: 'Medical Requirements Met',
                completed: patient.surgeryRequirements.every(req => req.met),
                critical: true
            },
            {
                label: 'Provider Assigned',
                completed: !!patient.assignedTo,
                critical: false
            },
            {
                label: 'Initial Assessment',
                completed: patient.notes.some(note => note.type === 'medical'),
                critical: false
            }
        ];
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start overflow-y-auto z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl relative my-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-xl">
                    <div className="flex justify-between items-start">
                        {/* Patient Info */}
                        <div className="flex items-start gap-4">
                            <UserCircleIcon className="h-16 w-16 text-white" />
                            <div className="text-white">
                                <h2 className="text-2xl font-bold">{patient.name}</h2>
                                <div className="mt-1 space-x-4 text-blue-100">
                                    <span>Age: {patient.age}</span>
                                    <span>•</span>
                                    <span>Gender: {patient.gender}</span>
                                    <span>•</span>
                                    <span>BMI: {patient.bmi}</span>
                                </div>
                                <div className="mt-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white`}>
                                        {patient.surgeryType}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={openEHR}
                                className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-sm text-white"
                            >
                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                Open EHR
                            </button>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-12 gap-6 p-6">
                    {/* Left Column - Medical Info */}
                    <div className="col-span-8 space-y-6">
                        {/* Review Progress */}
                        <ReviewStepper steps={getReviewSteps()} />

                        {/* Key Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Referral Details</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Type:</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getReferralTypeStyles(patient.referralType)}`}>
                                            {getReferralTypeDisplay(patient.referralType)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">From:</span>
                                        <span className="font-medium">{patient.referringProvider}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Assigned To:</span>
                                        <span className="font-medium">{patient.assignedTo || 'Unassigned'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Status</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Consultation:</span>
                                        <span className="font-medium">{formatDate(patient.consultDate)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Review Status:</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            patient.needsReview ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {patient.needsReview ? 'Needs Review' : 'Reviewed'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Surgery Date:</span>
                                        <span className="font-medium">{scheduledDateDisplay}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medical History & Notes */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Medical History */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Medical History</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Conditions</h4>
                                        <ul className="space-y-1">
                                            {patient.medicalHistory.map((condition, index) => (
                                                <li key={index} className="text-sm flex items-center">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2" />
                                                    {condition}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Medications</h4>
                                        <ul className="space-y-1">
                                            {patient.medications.map((medication, index) => (
                                                <li key={index} className="text-sm flex items-center">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2" />
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
                                    <h3 className="font-medium text-gray-900">Clinical Notes</h3>
                                    <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                        <PlusCircleIcon className="h-4 w-4" />
                                        Add Note
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {patient.notes.map((note, index) => (
                                        <div key={index} className="bg-white p-2 rounded border border-gray-200 text-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                    note.type === 'surgical' ? 'bg-blue-100 text-blue-700' :
                                                    note.type === 'medical' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {note.type}
                                                </span>
                                                <span className="text-xs text-gray-500">{formatDate(note.timestamp)}</span>
                                            </div>
                                            <p className="text-gray-900">{note.content}</p>
                                            <p className="text-xs text-gray-500 mt-1">By {note.author}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                          {/* Chat Component */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-md font-semibold text-gray-900">AI Assistant</h3>
                            </div>
                            <AIChat />
                          </div>
                        </div>

                    </div>

                    {/* Right Column - Requirements & Documents */}
                    <div className="col-span-4 space-y-6">
                        {/* Surgery Requirements */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Surgery Requirements</h3>
                            <div className={`mb-3 p-2 rounded-lg ${
                                patient.isCandidate ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                                {patient.isCandidate ? (
                                    <div className="flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        <span className="font-medium">Eligible for Surgery</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                                        <span className="font-medium">Not Eligible</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                {patient.surgeryRequirements.map((req, index) => (
                                    <RequirementStatus key={index} requirement={req} />
                                ))}
                            </div>
                        </div>

                        {/* Required Documents */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Required Documents</h3>
                            <div className="space-y-2">
                                {patient.requiredDocuments.map((doc, index) => (
                                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">{doc.type}</span>
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
                <div className="border-t bg-gray-50 p-4 rounded-b-xl flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Last updated: {formatDate(patient.lastUpdated)}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                            Close
                        </button>
                        {patient.needsReview && (
                            <button
                                onClick={() => setIsSchedulingOpen(true)}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                                <CalendarIcon className="w-5 h-5 mr-2" />
                                Schedule Consultation
                            </button>
                        )}
                        <button
                            onClick={() => onUpdateStatus(patient.needsReview ? 'reviewed' : 'needs-review')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Mark as {patient.needsReview ? 'Reviewed' : 'Needs Review'}
                        </button>
                    </div>
                </div>
            </div>

            <SchedulingModal
                isOpen={isSchedulingOpen}
                onClose={() => setIsSchedulingOpen(false)}
                onConfirm={handleScheduleConfirm}
                patientName={patient.name}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
            />
        </div>
    );
};

export default PatientDetailModal;
