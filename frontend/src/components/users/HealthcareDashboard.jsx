/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUsers, FaHeartbeat, FaChartLine, FaExclamationCircle,
  FaSyncAlt, FaUserTimes, FaComments, FaCalculator
} from 'react-icons/fa';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const HealthcareDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('No auth token found. Please login.');
          setLoading(false);
          return;
        }
        const response = await axios.get('/api/healthcare-dashboard/kpis', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setKpis(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load KPIs: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) return <div className="text-center text-lg py-8">🔄 Loading Healthcare Dashboard...</div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

  const kpiItems = [
    { label: 'Total Children Followed', value: kpis.totalChildrenFollowed, icon: <FaUsers className="text-blue-600" /> },
    { label: 'Total Behavioral Evaluations', value: kpis.totalBehavioralEvaluations, icon: <FaHeartbeat className="text-pink-600" /> },
    { label: 'Exercise Validation Rate (%)', value: `${kpis.validationRate.toFixed(2)}%`, icon: <FaChartLine className="text-green-600" /> },
    { label: 'Rejected Exercises', value: kpis.rejectedExercises, icon: <FaExclamationCircle className="text-red-600" /> },
    { label: 'Average Behavior Score Evolution per Day', value: kpis.avgBehaviorScorePerDay, icon: <FaSyncAlt className="text-teal-600" /> },
    { label: 'Children with Behavioral Regression', value: kpis.childrenWithRegression, icon: <FaUserTimes className="text-red-500" /> },
    { label: 'Contacts with Admin', value: kpis.contactsWithAdmin, icon: <FaComments className="text-indigo-600" /> },
    { label: 'Average Evaluations per Child', value: kpis.avgEvaluationsPerChild, icon: <FaCalculator className="text-purple-600" /> },
  ];

  const donutData = {
    labels: ['Validated', 'Rejected'],
    datasets: [{
      data: [kpis.validatedExercises, kpis.rejectedExercises],
      backgroundColor: ['#10B981', '#EF4444']
    }]
  };

  const lineData = {
    labels: kpis.behaviorScoreTimeline.map(e => e.date),
    datasets: [{
      label: 'Behavior Score',
      data: kpis.behaviorScoreTimeline.map(e => e.score),
      borderColor: '#3B82F6',
      fill: false,
      tension: 0.3
    }]
  };

  const barData = {
    labels: kpis.contactsPerMonth.map(m => m.month),
    datasets: [{
      label: 'Contacts with Admin',
      data: kpis.contactsPerMonth.map(m => m.count),
      backgroundColor: '#6366F1'
    }]
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📊 Healthcare Dashboard - KPIs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {kpiItems.map((item, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-5 flex items-center space-x-4 hover:shadow-xl transition">
            <div className="text-3xl">{item.icon}</div>
            <div>
              <div className="text-gray-600 text-sm font-medium">{item.label}</div>
              <div className="text-xl font-semibold text-gray-900">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Exercise Validation Breakdown</h3>
          <Doughnut data={donutData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Behavior Score Over Time</h3>
          <Line data={lineData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-10">
        <h3 className="text-lg font-bold mb-4">Monthly Contacts with Admin</h3>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default HealthcareDashboard;*/
