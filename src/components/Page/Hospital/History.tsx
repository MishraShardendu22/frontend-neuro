import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

interface Case {
  _id: string;
  status: string;
  caseName: string;
  createdAt: string;
  updatedAt: string;
  patientId: string;
  hospitalId: string;
}

const HistoryHospital: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      getAllCases();
    }
  }, [token]);

  const getAllCases = async () => {
    try {
      const response = await axiosInstance.get('/cases/getAllCases', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setCases(response.data.Data);
    } catch (error) {
      console.error('Error retrieving cases:', error);
    }
  };

  const deleteCase = async (id: string) => {
    try {
      await axiosInstance.delete(`/cases/deleteCase/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setCases((prevCases) => prevCases.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  const updateCase = async (id: string, status: string) => {
    try {
      const response = await axiosInstance.put<{ Message: string; Data: Case }>(
        `/cases/updateCase/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setCases((prevCases) => prevCases.map((c) => (c._id === id ? response.data.Data : c)));
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  if (!token) {
    return <p>Authentication required</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Hospital Cases</h1>
      <p className="mb-4">Manage hospital cases with API integration.</p>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {cases.length === 0 ? (
          <p>No cases available</p>
        ) : (
          <ul>
            {cases.map((c) => (
              <li key={c._id} className="p-2 border-b flex justify-between items-center">
                <span>
                  {c.caseName}
                  {c._id} - {c.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateCase(c._id, 'Approved')}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => deleteCase(c._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryHospital;
