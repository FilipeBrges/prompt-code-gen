import React from 'react'
import { Check } from 'lucide-react'

interface Step {
  id: string
  title: string
  completed: boolean
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: string
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.completed
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200
                    ${isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`
                    ml-3 text-sm font-medium transition-colors duration-200
                    ${isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : isCompleted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {step.title}
                </span>
              </div>
              
              {!isLast && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-colors duration-200
                    ${isCompleted
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                    }
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}