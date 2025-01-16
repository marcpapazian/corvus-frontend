import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { CalendarIcon, UserIcon, CheckIcon } from '@heroicons/react/24/outline';

interface TimeSlot {
    id: string;
    date: Date;
    provider: string;
    available: boolean;
}

interface SchedulingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (slot: TimeSlot) => void;
    patientName: string;
    selectedSlot: TimeSlot | null;
    setSelectedSlot: (slot: TimeSlot | null) => void;
}

const SchedulingModal: React.FC<SchedulingModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    patientName,
    selectedSlot,
    setSelectedSlot
}) => {
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

    // Generate slots only when modal opens
    useEffect(() => {
        if (isOpen) {
            const slots: TimeSlot[] = [];
            const today = new Date();
            const providers = ['Dr. Smith', 'Dr. Johnson', 'Dr. White'];
            
            // Generate next 5 business days slots
            for (let i = 1; i <= 5; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                
                // Skip weekends
                if (date.getDay() === 0 || date.getDay() === 6) {
                    continue;
                }
                
                // Morning and afternoon slots
                const times = [9, 11, 14, 16];
                times.forEach(hour => {
                    const slotDate = new Date(date);
                    slotDate.setHours(hour, 0, 0, 0);
                    
                    slots.push({
                        id: `slot-${slotDate.getTime()}`,
                        date: slotDate,
                        provider: providers[Math.floor(Math.random() * providers.length)],
                        available: true // All slots available for demo
                    });
                });
            }
            
            setAvailableSlots(slots);
        }
    }, [isOpen]);

    // Clear selected slot when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedSlot(null);
        }
    }, [isOpen, setSelectedSlot]);

    const formatDate = (date: Date) => {
        return {
            day: date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
            })
        };
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto w-full max-w-4xl rounded-lg bg-white p-6">
                    <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                        Schedule Consultation for {patientName}
                    </Dialog.Title>
                    
                    <div className="mb-4">
                        <p className="text-sm text-gray-500">
                            ⚡ Available time slots are synced with our scheduling platform in real-time
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {availableSlots.map(slot => {
                            const { day, time } = formatDate(slot.date);
                            return (
                                <button
                                    key={slot.id}
                                    className={`flex items-center justify-between p-4 rounded-lg border ${
                                        selectedSlot?.id === slot.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <CalendarIcon className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">{day}</p>
                                            <p className="text-sm text-gray-600">{time}</p>
                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                                <UserIcon className="h-3 w-3 mr-1" />
                                                {slot.provider}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedSlot?.id === slot.id && (
                                        <CheckIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => selectedSlot && onConfirm(selectedSlot)}
                            disabled={!selectedSlot}
                            className={`px-4 py-2 rounded-md ${
                                selectedSlot
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Confirm Appointment
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default SchedulingModal; 