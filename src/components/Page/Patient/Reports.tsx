import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Stethoscope, HeartPulse, Droplet } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import toast from 'react-hot-toast';

interface Report {
  _id: string;
  caseId: string;
  patientId: string;
  documentId: string;
  timeOfLastNormal: string;
  symptoms: string[];
  BP: string;
  O2_Saturation: string;
  HR: string;
  createdAt: string;
  updatedAt: string;
}

const Reports = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 20;

  const openModal = async (id: string) => {
    setModalOpen(true);
    try {
      const res = await axiosInstance.get(`/patient/report/${id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      setReport(res.data.Data);
      toast.success('Report loaded successfully!');
    } catch (error) {
      toast.error('Failed to fetch report.');
      console.error('Error fetching report:', error);
    }
  };

  useEffect(() => {
    const getReports = async () => {
      try {
        const res = await axiosInstance.get('/patient/report', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        setReports(res.data.Data || []);
        toast.success('Reports loaded successfully!');
      } catch (error) {
        toast.error('Failed to fetch reports.');
        console.error('Error fetching reports:', error);
      }
    };
    getReports();
  }, []);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center space-x-4">
        <Stethoscope className="w-10 h-10 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Patient Reports</h2>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-muted/50 rounded-lg">
          <FileText className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No reports available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentReports.map((report) => (
            <Card key={report._id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Case Report</span>
                </CardTitle>
                <CardDescription>Case ID: {report.caseId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">
                    Last Normal: {new Date(report.timeOfLastNormal).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <HeartPulse className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm truncate">
                    Symptoms: {report.symptoms.slice(0, 3).join(', ')}
                    {report.symptoms.length > 3 && '...'}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => openModal(report._id)}
                  className="w-full"
                  variant="secondary"
                >
                  View Report
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      {report && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-md bg-black/100">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-primary" />
                <span>Report Details</span>
              </DialogTitle>
              <DialogDescription className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4 text-muted-foreground" />
                    <p>
                      <strong>Case ID:</strong> {report.caseId}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplet className="w-4 h-4 text-muted-foreground" />
                    <p>
                      <strong>BP:</strong> {report.BP}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HeartPulse className="w-4 h-4 text-muted-foreground" />
                    <p>
                      <strong>HR:</strong> {report.HR}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Symptoms:</strong> {report.symptoms.join(', ')}
                  </p>
                  <p>
                    <strong>O₂ Saturation:</strong> {report.O2_Saturation}
                  </p>
                  <p>
                    <strong>Last Normal:</strong>{' '}
                    {new Date(report.timeOfLastNormal).toLocaleString()}
                  </p>
                  <p>
                    <strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button variant="secondary" className="w-full">
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Reports;
