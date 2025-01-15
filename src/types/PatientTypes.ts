// src/types/PatientTypes.ts
export interface SurgeryRequirements {
    name: string;
    value: number | string | boolean;
    met: boolean;
    required: number | string | boolean;
}

export interface Document {
    type: string;
    received: boolean;
    url?: string;
    dateReceived?: Date;
}

export interface Note {
    id: string;
    content: string;
    author: string;
    timestamp: Date;
    type: 'general' | 'surgical' | 'medical' | 'requirement';
}

export type ReferralType = 'self' | 'external' | 'internal';

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'male' | 'female';
    bmi: number;
    reason: string;
    needsReview: boolean;
    isCandidate: boolean;
    assignedTo: string;
    referringProvider: string;
    referralNotes: string;
    surgeryType: string;
    surgeryRequirements: SurgeryRequirements[];
    medicalHistory: string[];
    medications: string[];
    requiredDocuments: Document[];
    lastUpdated: Date;
    notes: Note[];
    consultDate: Date;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    priorityScore: number;
    reviewedAt?: Date;
    scheduledDate?: Date;
    ehrId: string;
    referralType: ReferralType;
}
