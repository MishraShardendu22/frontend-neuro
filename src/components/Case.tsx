import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Copy, FilePlus, UserPlus } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import toast from 'react-hot-toast';

interface Patient {
  _id: string;
  email: string;
  fullName: string;
  patientId: string;
}

interface CreateCaseProps {
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  onCaseCreated: (caseId: string, patientId: string) => void;
}

const CreateCase: React.FC<CreateCaseProps> = ({
  selectedPatientId,
  setSelectedPatientId,
  onCaseCreated,
}) => {
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axiosInstance.get('/hospital/getPatients', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAllPatients(res.data.Data);
        setFilteredPatients(res.data.Data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Internal Server Error');
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = allPatients.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, allPatients]);

  const copyToClipboard = (patientId: string) => {
    navigator.clipboard.writeText(patientId);
    setSelectedPatientId(patientId);
    toast.success('Patient ID copied and set as selection!');
  };

  const makeCase = async () => {
    if (!selectedPatientId) {
      toast.error('Please select a patient');
      return;
    }
    try {
      const res = await axiosInstance.post(
        '/cases/postCase',
        { patientId: selectedPatientId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const newCaseId = res.data.Data._id;
      toast.success(`Case created successfully! (Case ID: ${newCaseId})`);
      onCaseCreated(newCaseId, selectedPatientId);
    } catch (error) {
      console.error('Error creating case:', error);
      toast.error('Failed to create case');
    }
  };

  return (
    <Card className="w-full bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <UserPlus className="w-6 h-6" />
          Create New Case
        </CardTitle>
        <CardDescription className="text-gray-400">
          Search and select a patient to create a new case
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by name, email, or patient ID..."
            className="pl-10 bg-gray-900 text-white border-gray-800 focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-4 max-h-[300px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 hover:bg-gray-900">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Patient ID</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow
                  key={patient._id}
                  className={`cursor-pointer ${
                    selectedPatientId === patient._id ? 'bg-primary/20' : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedPatientId(patient._id)}
                >
                  <TableCell className="text-white">{patient.fullName}</TableCell>
                  <TableCell className="text-gray-400">{patient.email}</TableCell>
                  <TableCell className="text-gray-400">{patient._id}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-900 text-white hover:bg-gray-800 border-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(patient._id);
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy ID
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">Selected Patient</label>
          <Select value={selectedPatientId || undefined} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="bg-gray-900 text-white border-gray-800">
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white">
              {filteredPatients.map((patient) => (
                <SelectItem
                  key={patient._id}
                  value={patient._id}
                  className="hover:bg-gray-900 focus:bg-gray-900"
                >
                  {patient.fullName} ({patient.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={makeCase}
          className="w-full bg-primary hover:bg-primary/90"
          disabled={!selectedPatientId}
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Create New Case
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateCase;
