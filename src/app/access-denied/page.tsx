import React from 'react';

const AccessDeniedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page.
        </p>
        <p className="text-gray-600 text-sm">
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
