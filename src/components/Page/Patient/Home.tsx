/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/components/store/userStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, TrendingUp, AlertTriangle, DollarSign, HeartPulse } from 'lucide-react';
import { useEffect } from 'react';

const StatisticSection = ({
  title,
  statistics,
  icon: Icon,
}: {
  title: string;
  statistics: string[];
  icon: any;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-4"
  >
    <div className="flex items-center space-x-2 text-primary">
      <Icon size={24} />
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <ul className="space-y-2 text-sm text-muted-foreground">
      {statistics.map((stat, index) => (
        <li key={index} className="flex items-start space-x-2">
          <AlertTriangle size={16} className="text-yellow-500 mt-1 flex-shrink-0" />
          <span>{stat}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const HomePatient = () => {
  const user = useUserStore((state: any) => state.user);

  useEffect(() => {
    toast.success(`Welcome back, ${user.fullName}!`);
  }, [user.fullName]);

  const statisticSections = [
    {
      title: 'Global Stroke Insights',
      statistics: [
        '15 million people suffer strokes annually worldwide',
        'Stroke is the second leading cause of death globally',
        'Every 2 seconds, someone in the world has a stroke',
        '70% of strokes occur in low- and middle-income countries',
      ],
      icon: TrendingUp,
    },
    {
      title: 'U.S. Stroke Landscape',
      statistics: [
        'Nearly 800,000 strokes occur each year',
        '1 stroke happens every 40 seconds',
        '1 stroke-related death occurs every 3.5 minutes',
        'Leading cause of long-term disability in the U.S.',
      ],
      icon: HeartPulse,
    },
    {
      title: 'Economic Impact',
      statistics: [
        'Stroke costs the U.S. $56.5 billion per year',
        'Average cost per stroke survivor: $140,000+ over lifetime',
        'Direct medical costs: $45.5 billion',
        'Lost productivity: $11 billion',
      ],
      icon: DollarSign,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <User size={32} className="text-primary" />
              <CardTitle>Welcome, {user.fullName}!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Badge variant="secondary" className="text-lg">
                Patient Code: {user._id}
              </Badge>
              <Badge variant="secondary" className="text-lg">
                Patient ID: {user.patientId}
              </Badge>
              <Badge variant="secondary" className="text-lg">
                Email: {user.email}
              </Badge>
              <Badge variant="secondary" className="text-lg">
                Phone Number: {user.phoneNumber}
              </Badge>
              <Badge variant="secondary" className="text-lg">
                Created At: {user.createdAt}
              </Badge>
              <span className="ml-2 text-lg font-bold text-muted-foreground">
                Your health is our priority.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Tabs */}
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="us">U.S. Insights</TabsTrigger>
            <TabsTrigger value="economic">Economic</TabsTrigger>
          </TabsList>
          {statisticSections.map((section, index) => (
            <TabsContent key={section.title} value={['global', 'us', 'economic'][index]}>
              <Card>
                <CardContent className="pt-6">
                  <StatisticSection {...section} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Prevention & Recovery Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Stroke Prevention & Recovery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-primary">Prevention Strategies</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 80% of strokes are preventable</li>
                  <li>• Lowering blood pressure reduces stroke risk by 30-40%</li>
                  <li>• Physical activity reduces stroke risk by 25-30%</li>
                  <li>• Quitting smoking cuts stroke risk in half within 2 years</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-primary">Survival Rates</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 1-year survival rate: ~75%</li>
                  <li>• 5-year survival rate: ~50%</li>
                  <li>• Early intervention can reduce mortality by 50%</li>
                  <li>• Risk doubles every 10 years after age 55</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default HomePatient;
