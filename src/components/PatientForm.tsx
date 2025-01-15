// src/components/PatientForm.tsx
import React, { useState } from 'react';
import { Patient } from '../types/PatientTypes';

interface PatientFormProps {
    onAddPatient: (newPatient: Patient) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onAddPatient }) => {
    const initialState: Patient = {
        id: String(Date.now()),
        name: '',
        age: 0,
        gender: 'male',
        bmi: 0,
        reason: '',
        needsReview: true,
        isCandidate: false,
        assignedTo: '',
        referringProvider: '',
        referralNotes: '',
        surgeryType: '',
        surgeryRequirements: [],
        medicalHistory: [],
        medications: [],
        requiredDocuments: [],
        lastUpdated: new Date(),
        notes: []
    };

    const [formData, setFormData] = useState<Patient>(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPatient: Patient = {
            id: String(Date.now()),  // temporary ID
            name: "New Patient",
            age: 30,
            gender: "male",
            bmi: 25,
            reason: "Initial consultation",
            needsReview: true,
            isCandidate: false,  // Add this
            assignedTo: "Dr. Smith",
            referringProvider: "Dr. Jones",
            referralNotes: "Initial referral",
            surgeryType: "General",
            surgeryRequirements: [],  // Add this
            medicalHistory: [],
            medications: [],
            requiredDocuments: [],
            lastUpdated: new Date(),
            notes: []
            // Remove 'received' property as it's not in the Patient type
        };
        onAddPatient(newPatient);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Add New Patient</h2>

            <input name="name" onChange={handleChange} placeholder="Full Name" required className="w-full border p-2 rounded-lg" />
            <input name="age" type="number" onChange={handleChange} placeholder="Age" required className="w-full border p-2 rounded-lg" />
            
            {/* Needs Review Checkbox */}
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.needsReview}
                    onChange={() => setFormData({ ...formData, needsReview: !formData.needsReview })}
                />
                Mark as needing review
            </label>

            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                Add Patient
            </button>
        </form>
    );
};

export default PatientForm;
