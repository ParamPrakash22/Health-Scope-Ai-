
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-sky-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">HealthScope AI</h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
