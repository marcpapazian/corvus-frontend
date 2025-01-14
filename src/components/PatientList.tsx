// PatientList.tsx
import React from 'react';
import { Patient } from '../types/PatientTypes';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface PatientListProps {
    patients: Patient[];
    onPatientSelect: (patient: Patient) => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onPatientSelect }) => {
    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => (
                <button
                    key={patient.id}
                    onClick={() => onPatientSelect(patient)}
                    className="text-left bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                                <p className="text-sm text-gray-500">{patient.surgeryType}</p>
                            </div>
                            {patient.needsReview ? (
                                <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    Review Needed
                                </span>
                            ) : (
                                <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                    Reviewed
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="w-20">Age:</span>
                                <span className="font-medium text-gray-900">{patient.age}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="w-20">Provider:</span>
                                <span className="font-medium text-gray-900">{patient.assignedTo}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="w-20">Referring:</span>
                                <span className="font-medium text-gray-900">{patient.referringProvider}</span>
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default PatientList;
