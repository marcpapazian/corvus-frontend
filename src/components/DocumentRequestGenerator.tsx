import React, { useState } from 'react';
import { PaperAirplaneIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface DocumentRequestGeneratorProps {
    patientName: string;
    documentType: string;
    referringProvider: string;
}

const DocumentRequestGenerator: React.FC<DocumentRequestGeneratorProps> = ({
    patientName,
    documentType,
    referringProvider
}) => {
    const [generatedEmail, setGeneratedEmail] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const generateEmail = async () => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call to your LLM endpoint
            const response = await fetch('your-llm-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientName,
                    documentType,
                    referringProvider
                }),
            });
            
            // For now, using a template email
            const templateEmail = `Dear ${referringProvider},

I hope this email finds you well. I am writing to request the ${documentType} for your patient, ${patientName}. This document is required for their upcoming surgical evaluation.

Could you please send this document at your earliest convenience? If you have any questions, please don't hesitate to reach out.

Thank you for your assistance.

Best regards,
[Your Name]`;
            
            setGeneratedEmail(templateEmail);
        } catch (error) {
            console.error('Error generating email:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedEmail);
    };

    return (
        <div className="mt-2">
            {!generatedEmail ? (
                <button
                    onClick={generateEmail}
                    disabled={loading}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                    <DocumentIcon className="h-4 w-4" />
                    {loading ? 'Generating request...' : 'Generate document request'}
                </button>
            ) : (
                <div className="mt-2">
                    <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded-md border border-gray-200 text-sm whitespace-pre-wrap">
                        {generatedEmail}
                    </div>
                    <div className="mt-1 flex justify-end">
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 px-2 py-1"
                        >
                            <PaperAirplaneIcon className="h-3 w-3" />
                            Copy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentRequestGenerator; 