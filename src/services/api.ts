// src/services/api.ts
import { Patient } from '../types/PatientTypes';

const API_URL = '/api';  // Make this explicit for now

export const fetchPatients = async (): Promise<Patient[]> => {
    try {
        console.log('🔍 Attempting to fetch patients...');
        const fullUrl = `${API_URL}/patients`;
        console.log('📍 Fetching from:', fullUrl);

        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'  // Add this explicitly
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Error response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log('✅ Fetched patients:', data.length);
        return data;
    } catch (error) {
        console.error('❌ Error in fetchPatients:', error);
        throw error;
    }
};

export const updatePatientStatus = async (patientId: string, status: string): Promise<void> => {
    try {
        // TODO: Replace with actual API call
        console.log(`Updating patient ${patientId} status to ${status}`);
        return Promise.resolve();
    } catch (error) {
        console.error('Error updating patient status:', error);
        throw error;
    }
};

export const generateDocumentRequest = async (
    patientName: string,
    documentType: string,
    referringProvider: string
): Promise<string> => {
    const prompt = `Generate a professional, concise email to request medical documents.
    Context:
    - Patient Name: ${patientName}
    - Document Needed: ${documentType}
    - Referring Provider: ${referringProvider}
    
    The email should:
    1. Be professional and courteous
    2. Clearly state which document is needed
    3. Reference the patient by name
    4. Include a polite urgency
    5. Thank the provider
    
    Email:`;

    // TODO: Replace with your actual LLM API call
    return Promise.resolve(
        `Dear ${referringProvider},\n\nI hope this email finds you well...`
    );

};


export const getChatCompletion = async (chat: string, patient: Patient): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/chat-completion`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat, patient }),
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}