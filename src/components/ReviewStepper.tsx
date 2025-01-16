import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface Step {
    label: string;
    completed: boolean;
    critical: boolean;
}

interface ReviewStepperProps {
    steps: Step[];
}

const ReviewStepper: React.FC<ReviewStepperProps> = ({ steps }) => {
    const completedSteps = steps.filter(step => step.completed).length;
    const progress = (completedSteps / steps.length) * 100;
    const criticalPending = steps.filter(step => !step.completed && step.critical).length;

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">
                    Review Progress
                </span>
                <span className="text-sm text-gray-600">
                    {completedSteps} of {steps.length} completed
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Steps List */}
            <div className="space-y-2">
                {steps.map((step, index) => (
                    <div 
                        key={index}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            {step.completed ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                                <ExclamationCircleIcon 
                                    className={`h-5 w-5 mr-2 ${
                                        step.critical ? 'text-red-500' : 'text-gray-400'
                                    }`} 
                                />
                            )}
                            <span className={`text-sm ${
                                step.completed 
                                    ? 'text-gray-900' 
                                    : step.critical
                                        ? 'text-red-600'
                                        : 'text-gray-500'
                            }`}>
                                {step.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Critical Warning */}
            {criticalPending > 0 && (
                <div className="mt-4 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {criticalPending} critical {criticalPending === 1 ? 'item' : 'items'} pending
                </div>
            )}
        </div>
    );
};

export default ReviewStepper; 