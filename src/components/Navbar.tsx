// src/components/Navbar.tsx
import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold">Corvus Surgical Triage</h1>
            <div className="space-x-6">
                <a href="#" className="hover:text-blue-200">Dashboard</a>
                <a href="#" className="hover:text-blue-200">Patients</a>
                <a href="#" className="hover:text-blue-200">Reports</a>
            </div>
        </nav>
    );
};

export default Navbar;
