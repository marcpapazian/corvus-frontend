export interface Patient {
    name: string;
    age: number;
    gender: string;
    bmi: number;
    reason: string;
    needsReview: boolean;
    assignedTo: string;
    received: string;
    referringProvider: string;
    referralNotes: string;
    surgeryType: string;
    medicalHistory: string[];
    medications: string[];
    requiredDocuments: { type: string; received: boolean }[];
    lastUpdated: Date;
    notes: string[];
}