'use client'

import { useState } from 'react'
import RequesterDetails from '../implementation-plan/ImplementationPlanRequesterDetails'
import TaskList from '../implementation-plan/ImplementationPlanTaskList'
import FileUpload from '../implementation-plan/ImplementationPlanFileUpload'
import AdditionalDetails from '../implementation-plan/ImplementationPlanAdditionalDetails'

export default function ImplementationPlanForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Add form submission logic here
    setTimeout(() => setIsLoading(false), 2000) // Simulate loading
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg sm:rounded-md xsm:rounded-xsm border-2 border-gray-300 shadow-xl overflow-y-auto h-screen mx-auto">
      <div className="p-5 bg-indigo-dark text-white flex items-center">
        <h1
          id="create-implementation-plan-title"
          className="text-lg sm:text-xl font-semibold text-center xsm:text-left w-full"
        >
          Create Implementation Plan
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex flex-col">
        {/* Requester Details Section */}
        <div className="space-y-4">
          <RequesterDetails />
        </div>
        {/* Task List Section */}
        <div className="space-y-4">
          <TaskList />
        </div>
        {/* File Upload Section */}
        <div className="space-y-4">
          <FileUpload />
        </div>
        {/* Additional Details Section */}
        <div className="space-y-4">
          <AdditionalDetails />
        </div>
        {/* Submit Button */}
        <div className="flex justify-end flex-shrink-0">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-indigo-dark text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
