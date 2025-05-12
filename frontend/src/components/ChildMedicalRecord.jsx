import React from 'react';

const ChildMedicalRecord = () => {
  return (
    <div className="p-6 bg-white rounded shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Child Medical Record</h2>
      <p className="text-gray-700 dark:text-gray-300">
        This section will display detailed medical records of the selected child.
      </p>
      {/* Add form or display components for medical records here */}
    </div>
  );
};

export default ChildMedicalRecord;
