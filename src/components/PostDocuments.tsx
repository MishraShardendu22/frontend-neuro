import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { FileUp, FileText, Tags, User, Folder } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '@/lib/axiosInstance';
import toast from 'react-hot-toast';

// Zod schema for form validation
const documentSchema = z.object({
  patientId: z.string().optional(),
  documentUrl: z.string().url('Invalid URL'),
  documentType: z.string().min(1, 'Document type is required'),
  documentName: z.string().min(1, 'Document name is required'),
});

interface PostDocumentProps {
  selectedPatientId: string | null;
  caseId: string | null;
  fileUrl: string | null;
  onDocumentCreated: (documentId: string) => void;
}

const PostDocument: React.FC<PostDocumentProps> = ({
  selectedPatientId,
  caseId,
  fileUrl,
  onDocumentCreated,
}) => {
  const form = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      patientId: selectedPatientId || '',
      documentUrl: fileUrl || '',
      documentType: '',
      documentName: '',
    },
  });

  // Update form when fileUrl changes
  useEffect(() => {
    if (fileUrl) {
      form.setValue('documentUrl', fileUrl);
    }
  }, [fileUrl, form]);

  const makeDocument = async (data: z.infer<typeof documentSchema>) => {
    if (!data.documentUrl) {
      toast.error('Please upload an image to obtain a document URL');
      return;
    }

    const payload = {
      caseId: caseId,
      ...data,
    };

    try {
      const res = await axiosInstance.post('/documents/postDocument', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const newDocumentId = res.data.Data._id;
      toast.success(`Document posted successfully! (Document ID: ${newDocumentId})`);
      onDocumentCreated(newDocumentId);
    } catch (error) {
      console.error('Error posting document:', error);
      toast.error('Failed to post document');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileUp className="mr-2" /> Post New Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(makeDocument)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Case ID */}
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Folder className="mr-2 h-4 w-4" /> Case ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Case ID"
                        value={caseId || field.value}
                        readOnly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Patient ID */}
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-4 w-4" /> Patient ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Patient ID"
                        value={selectedPatientId || field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document Name */}
              <FormField
                control={form.control}
                name="documentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" /> Document Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter document name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document Type */}
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Tags className="mr-2 h-4 w-4" /> Document Type
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="pdf, jpg, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document URL */}
              <FormField
                control={form.control}
                name="documentUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center">
                      <FileUp className="mr-2 h-4 w-4" /> Document URL
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Document URL" disabled={!!fileUrl} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full mt-4" disabled={!form.formState.isValid}>
              Post Document
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PostDocument;
