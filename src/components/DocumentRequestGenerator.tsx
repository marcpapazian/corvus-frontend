import React, { useState } from 'react';
import { EnvelopeIcon, CloudArrowDownIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';

interface DocumentRequestGeneratorProps {
    patientName: string;
    documentType: string;
    referringProvider: string;
}

interface HIESource {
    id: string;
    name: string;
    type: 'HIE' | 'EHR' | 'Registry';
    available: boolean;
}

const DocumentRequestGenerator: React.FC<DocumentRequestGeneratorProps> = ({
    patientName,
    documentType,
    referringProvider
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSources, setShowSources] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailData, setEmailData] = useState({
        to: '',
        subject: `Request for ${documentType} - Patient: ${patientName}`,
        body: `Dear ${referringProvider},

We are requesting ${documentType} for patient ${patientName}. This document is required for their upcoming surgical evaluation.

Could you please send this document at your earliest convenience? If you have any questions, please don't hesitate to reach out.

Thank you for your assistance.

Best regards,
Corvus Medical Center`
    });

    // Simulate available HIE sources
    const availableSources: HIESource[] = [
        { id: '1', name: 'CommonWell Health Alliance', type: 'HIE', available: true },
        { id: '2', name: 'Carequality', type: 'HIE', available: true },
        { id: '3', name: 'State Health Information Network', type: 'HIE', available: false },
        { id: '4', name: 'Regional Medical Records', type: 'EHR', available: true },
        { id: '5', name: 'National Patient Registry', type: 'Registry', available: true },
    ];

    const handleEmailSend = async () => {
        setIsLoading(true);
        try {
            // Here you would integrate with your email service
            // Example: AWS SES, SendGrid, or your organization's SMTP server
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            alert('Email sent successfully!');
            setShowEmailModal(false);
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHIERequest = async (source: HIESource) => {
        setIsLoading(true);
        try {
            // Simulate API call to HIE
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`Requesting ${documentType} from ${source.name} for ${patientName}`);
            // Here you would typically make an actual API call to the HIE
            
            // Show success message
            alert(`Successfully requested ${documentType} from ${source.name}`);
        } catch (error) {
            console.error('Error requesting from HIE:', error);
            alert('Failed to fetch records. Please try email request.');
        } finally {
            setIsLoading(false);
            setShowSources(false);
        }
    };

    return (
        <div className="mt-2">
            <div className="flex gap-2">
                <button
                    onClick={() => setShowEmailModal(true)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded"
                >
                    <EnvelopeIcon className="h-4 w-4" />
                    Request via Email
                </button>

                <button
                    onClick={() => setShowSources(true)}
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 bg-green-50 px-2 py-1 rounded"
                >
                    <CloudArrowDownIcon className="h-4 w-4" />
                    Request from HIE
                </button>
            </div>

            {/* Email Composition Modal */}
            <Dialog 
                open={showEmailModal} 
                onClose={() => setShowEmailModal(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-lg bg-white p-6">
                        <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                Request Document via Email
                            </Dialog.Title>
                            <button 
                                onClick={() => setShowEmailModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To
                                </label>
                                <input
                                    type="email"
                                    value={emailData.to}
                                    onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="recipient@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={emailData.subject}
                                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    value={emailData.body}
                                    onChange={(e) => setEmailData({...emailData, body: e.target.value})}
                                    rows={8}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEmailSend}
                                disabled={isLoading || !emailData.to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
                                    isLoading || !emailData.to
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                <PaperAirplaneIcon className="h-4 w-4" />
                                {isLoading ? 'Sending...' : 'Send Email'}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* HIE Sources Dropdown */}
            {showSources && (
                <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm">
                    <div className="p-2 border-b bg-gray-50">
                        <h4 className="text-xs font-medium text-gray-700">Select Data Source</h4>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {availableSources.map(source => (
                            <button
                                key={source.id}
                                onClick={() => source.available && handleHIERequest(source)}
                                disabled={!source.available || isLoading}
                                className={`w-full text-left px-3 py-2 text-xs border-b last:border-b-0 flex items-center justify-between
                                    ${source.available 
                                        ? 'hover:bg-gray-50 cursor-pointer' 
                                        : 'bg-gray-50 cursor-not-allowed'
                                    }
                                    ${isLoading ? 'opacity-50' : ''}
                                `}
                            >
                                <div>
                                    <span className="font-medium text-gray-900">{source.name}</span>
                                    <span className={`ml-2 px-1.5 py-0.5 rounded text-xs
                                        ${source.type === 'HIE' ? 'bg-blue-100 text-blue-700' :
                                          source.type === 'EHR' ? 'bg-green-100 text-green-700' :
                                          'bg-purple-100 text-purple-700'}
                                    `}>
                                        {source.type}
                                    </span>
                                </div>
                                {!source.available && (
                                    <span className="text-xs text-red-500">Unavailable</span>
                                )}
                            </button>
                        ))}
                    </div>
                    {isLoading && (
                        <div className="p-2 text-center text-xs text-gray-500">
                            Requesting records...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentRequestGenerator; 