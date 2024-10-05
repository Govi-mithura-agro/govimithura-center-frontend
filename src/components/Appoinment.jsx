import React from 'react';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Bell } from 'lucide-react';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for revenue chart
  const revenueData = [
    { month: 'Jan', amount: 4000 },
    { month: 'Feb', amount: 3000 },
    { month: 'Mar', amount: 5000 },
    { month: 'Apr', amount: 4500 },
    { month: 'May', amount: 6000 },
    { month: 'Jun', amount: 5500 },
  ];

  // Mock data for appointments by date
  const appointmentsByDate = [
    { date: '03/20', count: 8 },
    { date: '03/21', count: 12 },
    { date: '03/22', count: 15 },
    { date: '03/23', count: 10 },
    { date: '03/24', count: 5 },
    { date: '03/25', count: 14 },
    { date: '03/26', count: 11 }
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/appoinments/getappointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.appointments) {
          setAppointments(data.appointments);
          setLoading(false);
        } else {
          setError('No appointments found');
          setLoading(false);
        }
      })
      .catch((error) => {
        setError('Error fetching appointments: ' + error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl font-semibold">Loading dashboard...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 overflow-auto">    

      <main className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#379237" 
                  fill="#e7ffe6" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Appointments by Date */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Appointments by Date</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#379237" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Appointments</h2>
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-green-600 font-medium">
                        {appointment.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{appointment.name}</div>
                      <div className="text-sm text-gray-500">{appointment.email}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;