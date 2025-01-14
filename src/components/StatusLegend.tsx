// src/components/StatusLegend.tsx
import React from 'react';

const StatusLegend: React.FC = () => {
    return (
        <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500"></div>
                <span>Green: Meets all criteria</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500"></div>
                <span>Orange: Missing auxiliary data</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500"></div>
                <span>Red: Critical data missing</span>
            </div>
        </div>
    );
};

export default StatusLegend;
