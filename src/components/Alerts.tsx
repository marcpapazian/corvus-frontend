// src/components/Alerts.tsx
import React from 'react';

interface AlertProps {
    message: string;
    type: 'success' | 'warning' | 'error';
}

const Alerts: React.FC<AlertProps> = ({ message, type }) => {
    const color = type === 'success' ? 'bg-green-100 text-green-700' :
                  type === 'warning' ? 'bg-orange-100 text-orange-700' : 
                  'bg-red-100 text-red-700';

    return (
        <div className={`p-4 rounded-md ${color}`}>
            {message}
        </div>
    );
};

export default Alerts;
