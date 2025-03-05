import {
  Bell,
  Send,
  AlertTriangle,
  HeartPulse,
  Stethoscope,
  Clock,
  Activity,
  Waves,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const HomeHospital = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [newNotification, setNewNotification] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [caseId, setCaseId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [BP, setBP] = useState('');
  const [HR, setHR] = useState('');
  const [O2Saturation, setO2Saturation] = useState('');
  const [timeOfLastNormal, setTimeOfLastNormal] = useState<Date | undefined>(undefined);
  const [symptoms, setSymptoms] = useState('');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (timeOfLastNormal) {
      const updatedDateTime = new Date(timeOfLastNormal);
      updatedDateTime.setHours(parseInt(hours));
      updatedDateTime.setMinutes(parseInt(minutes));
      setTimeOfLastNormal(updatedDateTime);
    }
  }, [hours, minutes]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notification/all', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotifications(response.data.Data.notifications.reverse());
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch notifications');
    }
  };

  const sendNotification = async () => {
    if (!newNotification.trim()) {
      toast.error('Notification cannot be empty');
      return;
    }
    try {
      await axiosInstance.post(
        '/notification/new',
        { notification: newNotification },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Notification sent successfully');
      setNewNotification('');
      fetchNotifications();
    } catch (error) {
      console.log(error);
      toast.error('Failed to send notification');
    }
  };

  const triggerEmergency = async () => {
    if (
      !caseId ||
      !patientId ||
      !BP ||
      !HR ||
      !O2Saturation ||
      !timeOfLastNormal ||
      !symptoms.trim()
    ) {
      toast.error('All fields are required!');
      return;
    }
    try {
      await axiosInstance.post(
        '/hospital/emergencyActivate',
        {
          caseId,
          patientId,
          BP,
          HR,
          symptoms: symptoms.split(',').map((s) => s.trim()),
          documentId: `doc_${Date.now()}`,
          O2_Saturation: O2Saturation,
          timeOfLastNormal: timeOfLastNormal.toISOString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Emergency Activated!');
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Failed to activate emergency!');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex space-x-6">
        {/* Left Side - Notifications */}
        <Card className="w-1/3 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-6 h-6 text-primary" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>Send and view important updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter notification message"
                value={newNotification}
                onChange={(e) => setNewNotification(e.target.value)}
                className="flex-grow"
              />
              <Button
                onClick={sendNotification}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </Button>
            </div>
            <div
              className={`border rounded-lg p-2 scrollbar-thin scrollbar-track-muted/50 scrollbar-thumb-primary/50 ${notifications.length > 3 ? 'max-h-[400px] overflow-y-auto' : ''}`}
            >
              {notifications.length > 0 ? (
                notifications.map((notif, index) => (
                  <div key={index} className="bg-muted/50 rounded-md p-2 mb-2 last:mb-0 shadow-sm">
                    {notif}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Bell className="w-12 h-12 mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Hospital Information */}
        <Card className="w-2/3 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="w-6 h-6 text-primary" />
              <span>Welcome to Our Hospital</span>
            </CardTitle>
            <CardDescription>Providing exceptional healthcare</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-foreground mb-4">
                Our hospital is a leading healthcare provider known for cutting-edge medical
                technology and experienced professionals committed to patient care and well-being.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="destructive"
                className="w-full flex items-center justify-center space-x-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Emergency Activation</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-black/100 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <span>Emergency Details</span>
            </DialogTitle>
            <DialogDescription>
              Provide comprehensive details for emergency activation
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-muted-foreground" />
                <span>Case ID</span>
              </Label>
              <Input
                placeholder="Enter Case ID"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-muted-foreground" />
                <span>Patient ID</span>
              </Label>
              <Input
                placeholder="Enter Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span>Blood Pressure</span>
              </Label>
              <Input placeholder="BP" value={BP} onChange={(e) => setBP(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Waves className="w-4 h-4 text-muted-foreground" />
                <span>Heart Rate</span>
              </Label>
              <Input placeholder="HR" value={HR} onChange={(e) => setHR(e.target.value)} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Last Normal Time</span>
              </Label>
              <div className="flex space-x-2">
                {/* Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !timeOfLastNormal && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {timeOfLastNormal ? (
                        format(timeOfLastNormal, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={timeOfLastNormal}
                      onSelect={setTimeOfLastNormal}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Time Selectors */}
                <select
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="border bg-black/100 rounded p-2"
                >
                  {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
                <select
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="border bg-black/100 rounded p-2"
                >
                  {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(
                    (minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Waves className="w-4 h-4 text-muted-foreground" />
                <span>O2 Saturation</span>
              </Label>
              <Input
                placeholder="O2 Saturation"
                value={O2Saturation}
                onChange={(e) => setO2Saturation(e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <span>Symptoms</span>
              </Label>
              <Textarea
                placeholder="Enter symptoms (comma-separated)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={triggerEmergency}
            variant="destructive"
            className="w-full flex items-center justify-center space-x-2"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Activate Emergency</span>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeHospital;
