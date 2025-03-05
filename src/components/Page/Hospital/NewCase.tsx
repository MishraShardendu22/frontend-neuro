/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileUp, Folder, NotebookPen, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateCase from '../../Case';
import PostReport from '../../Reports';
import EditImages from '../../EditImage';
import PostDocument from '../../PostDocuments';
import { PickerOverlay } from 'filestack-react';

const WorkflowApp: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_FILESTACK_API_KEY as string;
  const options = {
    accept: [
      '.pdf',
      '.doc',
      '.csv',
      '.ppt',
      '.txt',
      '.xls',
      '.pptx',
      '.docx',
      '.xlsx',
      'image/*',
      'video/*',
      'image/png',
      'image/jpeg',
    ],
    fromSources: ['url', 'camera', 'local_file_system'],
    transformations: {
      crop: true,
      circle: true,
      rotate: true,
    },
    maxFiles: 5,
    storeTo: {
      location: 's3',
    },
  };

  const onSuccess = (result: any) => {
    console.log('Upload success:', result);
    if (result.filesUploaded && result.filesUploaded.length > 0) {
      const uploadedUrl = result.filesUploaded[0].url;
      toast.success('File uploaded successfully!');
      setFileUrl(uploadedUrl);
    }
  };

  const onError = (error: any) => {
    console.error('Upload error:', error);
    toast.error('File upload failed');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Tabs defaultValue="createCase" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900 p-1 rounded-lg gap-1">
          <TabsTrigger
            value="createCase"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <NotebookPen className="w-4 h-4" /> Create Case
          </TabsTrigger>
          <TabsTrigger
            value="postReport"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText className="w-4 h-4" /> Post Report
          </TabsTrigger>
          <TabsTrigger
            value="postDocument"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Folder className="w-4 h-4" /> Post Document
          </TabsTrigger>
          <TabsTrigger
            value="uploadFile"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileUp className="w-4 h-4" /> Upload File
          </TabsTrigger>
          <TabsTrigger
            value="editImages"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Image className="w-4 h-4" /> Edit Images
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="createCase">
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Create Case</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateCase
                  selectedPatientId={selectedPatientId}
                  setSelectedPatientId={setSelectedPatientId}
                  onCaseCreated={(newCaseId, patientId) => {
                    setCaseId(newCaseId);
                    setSelectedPatientId(patientId);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="postReport">
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Post Report</CardTitle>
              </CardHeader>
              <CardContent>
                <PostReport
                  selectedPatientId={selectedPatientId}
                  caseId={caseId}
                  documentId={documentId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="postDocument">
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Post Document</CardTitle>
              </CardHeader>
              <CardContent>
                <PostDocument
                  caseId={caseId}
                  fileUrl={fileUrl}
                  selectedPatientId={selectedPatientId}
                  onDocumentCreated={(newDocId) => setDocumentId(newDocId)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uploadFile">
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Upload File</CardTitle>
              </CardHeader>
              <CardContent>
                {apiKey ? (
                  <div className="flex flex-col items-center justify-center">
                    <PickerOverlay
                      apikey={apiKey}
                      onError={onError}
                      onSuccess={onSuccess}
                      pickerOptions={options}
                    />
                  </div>
                ) : (
                  <div className="text-destructive">FileStack API Key not found!</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editImages">
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Edit Images</CardTitle>
              </CardHeader>
              <CardContent>
                <EditImages />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default WorkflowApp;
