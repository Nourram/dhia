// src/components/settings/SettingsLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaEdit, FaLock, FaTrash } from 'react-icons/fa';

const SettingsLayout = () => {
  return (
    <div className="space-y-6">
    
      <Outlet />
    </div>
  );
};

export default SettingsLayout;
