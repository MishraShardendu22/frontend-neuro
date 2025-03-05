import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Stethoscope, Calendar, Droplet, HeartPulse, PlusCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axiosInstance from '@/lib/axiosInstance';
import toast from 'react-hot-toast';

// Zod validation schema
const reportSchema = z.object({
  timeOfLastNormal: z.string().min(1, 'Time of last normal is required'),
  symptoms: z.string(),
  BP: z.string().min(1, 'Blood Pressure is required'),
  HR: z.string().min(1, 'Heart Rate is required'),
  O2_Saturation: z.string().min(1, 'O2 Saturation is required'),
  documentId: z.string().optional(),
});

interface PostReportProps {
  selectedPatientId: string | null;
  caseId: string | null;
  documentId?: string | null;
}

const PostReport: React.FC<PostReportProps> = ({ selectedPatientId, documentId, caseId }) => {
  // Initialize form with zod resolver
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      timeOfLastNormal: '',
      symptoms: '',
      BP: '',
      HR: '',
      O2_Saturation: '',
      documentId: documentId || '',
    },
  });

  useEffect(() => {
    if (documentId) {
      form.setValue('documentId', documentId);
    }
  }, [documentId, form]);

  const makeReport = async (data: z.infer<typeof reportSchema>) => {
    if (!selectedPatientId) {
      toast.error('Please select a patient for the report');
      return;
    }
    if (!caseId) {
      toast.error('Please create a case before posting a report');
      return;
    }
    const payload = {
      caseId,
      patientId: selectedPatientId,
      documentId: data.documentId,
      timeOfLastNormal: data.timeOfLastNormal,
      symptoms: data.symptoms.split(',').map((symptom) => symptom.trim()),
      BP: data.BP,
      HR: data.HR,
      O2_Saturation: data.O2_Saturation,
    };
    try {
      await axiosInstance.post('/reports/postReport', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Report posted successfully!');
    } catch (error) {
      console.error('Error posting report:', error);
      toast.error('Failed to post report');
    }
  };

  return (
    <Card className="w-full bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="w-6 h-6" />
          Post Report
        </CardTitle>
        <CardDescription className="text-gray-400">
          Enter detailed medical report information
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(makeReport)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Case ID */}
              <FormField
                control={form.control}
                name="documentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" /> Document ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Document ID"
                        className="bg-gray-900 text-white border-gray-800 focus:border-primary"
                        readOnly={!!documentId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time of Last Normal */}
              <FormField
                control={form.control}
                name="timeOfLastNormal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Time of Last Normal
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        className="bg-gray-900 text-white border-gray-800 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Symptoms */}
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center gap-2">
                      <PlusCircle className="w-4 h-4" /> Symptoms
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Symptoms (comma separated)"
                        className="bg-gray-900 text-white border-gray-800 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Blood Pressure */}
              <FormField
                control={form.control}
                name="BP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center gap-2">
                      <Droplet className="w-4 h-4" /> Blood Pressure
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="BP"
                        className="bg-gray-900 text-white border-gray-800 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Heart Rate */}
              <FormField
                control={form.control}
                name="HR"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center gap-2">
                      <HeartPulse className="w-4 h-4" /> Heart Rate
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="HR"
                        className="bg-gray-900 text-white border-gray-800 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* O2 Saturation */}
              <FormField
                control={form.control}
                name="O2_Saturation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center gap-2">
                      <PlusCircle className="w-4 h-4" /> O2 Saturation
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="O2 Saturation"
                        className="bg-gray-900 text-white border-gray-800 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!selectedPatientId || !caseId}
            >
              <FileText className="mr-2 h-4 w-4" />
              Post Report
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PostReport;
