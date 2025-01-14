// src/components/PatientFilter.tsx
import React from 'react';

interface PatientFilterProps {
    onFilterChange: (filter: string) => void;
}

const PatientFilter: React.FC<PatientFilterProps> = ({ onFilterChange }) => {
    return (
        <div className="flex gap-4 mb-4">
            <select
                onChange={(e) => onFilterChange(e.target.value)}
                className="p-2 border rounded-lg"
            >
                <option value="all">All Patients</option>
                <option value="needsReview">Needs Review</option>
                <option value="reviewed">Reviewed</option>
            </select>
        </div>
    );
};

export default PatientFilter;
