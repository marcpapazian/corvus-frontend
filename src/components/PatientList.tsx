// PatientList.tsx
import React from 'react';
import { Patient } from '../types/PatientTypes';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface PatientListProps {
    patients: Patient[];
    onPatientSelect: (patient: Patient) => void;
    highlight?: boolean;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onPatientSelect, highlight }) => {
    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => (
                <button
                    key={patient.id}
                    onClick={() => onPatientSelect(patient)}
                    className={`text-left bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border ${
                        highlight ? 'border-blue-200 hover:border-blue-300' : 'border-gray-200'
                    }`}
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                                <p className="text-sm text-gray-500">{patient.surgeryType}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    patient.priorityScore >= 75 ? 'bg-red-100 text-red-800' :
                                    patient.priorityScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    Priority: {patient.priorityScore}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    {new Date(patient.consultDate).toLocaleDateString()}
                                </span>
                            </div>
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
