import { motion } from 'framer-motion';
import { AlertCircle, Clock, Users, HelpCircle, ClipboardList, MoveRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const Guidelines = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, duration: 0.5 },
    },
  };

  const sectionVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 250, damping: 24 },
    },
  };

  const listItemVariants = {
    hidden: { x: -15, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6 sm:px-12 lg:px-20">
      <motion.div
        className="w-full mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-5xl font-extrabold text-center text-primary-foreground">
          Hospital Guidelines
        </h1>

        <main className="w-full max-w-6xl mx-auto mt-12 space-y-16">
          {/* General Rules */}
          <motion.section variants={sectionVariants}>
            <div className="flex items-center gap-3 mb-5">
              <AlertCircle className="h-7 w-7 text-primary" />
              <h2 className="text-3xl font-bold">General Rules</h2>
            </div>
            <Separator className="mb-5 bg-muted h-1" />
            <ul className="space-y-4">
              {[
                'All visitors must check in at the reception before entering.',
                'Maintain silence in patient areas.',
                'Follow hygiene protocols, including hand sanitization.',
                'Smoking and alcohol consumption are strictly prohibited.',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 text-xl"
                  variants={listItemVariants}
                >
                  <MoveRight className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.section>

          {/* Visiting Hours */}
          <motion.section variants={sectionVariants}>
            <div className="flex items-center gap-3 mb-5">
              <Clock className="h-7 w-7 text-secondary" />
              <h2 className="text-3xl font-bold">Visiting Hours</h2>
            </div>
            <Separator className="mb-5 bg-muted h-1" />
            <ul className="space-y-4">
              <motion.li className="flex items-center gap-4 text-xl" variants={listItemVariants}>
                <MoveRight className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                <span className="flex-1">Morning:</span>
                <Badge className="bg-secondary text-secondary-foreground px-4 py-2 text-lg">
                  10:00 AM - 12:00 PM
                </Badge>
              </motion.li>
              <motion.li className="flex items-center gap-4 text-xl" variants={listItemVariants}>
                <MoveRight className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                <span className="flex-1">Evening:</span>
                <Badge className="bg-secondary text-secondary-foreground px-4 py-2 text-lg">
                  4:00 PM - 6:00 PM
                </Badge>
              </motion.li>
              <motion.li className="flex items-start gap-3 text-xl" variants={listItemVariants}>
                <MoveRight className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                <span>
                  <Users className="inline h-6 w-6 mr-2" />
                  Only two visitors per patient are allowed at a time.
                </span>
              </motion.li>
            </ul>
          </motion.section>

          {/* Emergency Procedures */}
          <motion.section variants={sectionVariants}>
            <div className="flex items-center gap-3 mb-5">
              <HelpCircle className="h-7 w-7 text-destructive" />
              <h2 className="text-3xl font-bold">Emergency Procedures</h2>
            </div>
            <Separator className="mb-5 bg-muted h-1" />
            <ul className="space-y-4">
              <motion.li className="flex items-start gap-3 text-xl" variants={listItemVariants}>
                <MoveRight className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                <span>
                  Dial{' '}
                  <Badge className="bg-destructive text-destructive-foreground px-4 py-2 text-lg">
                    102
                  </Badge>{' '}
                  for hospital emergencies.
                </span>
              </motion.li>
              {[
                'Report fire hazards or accidents immediately.',
                "Follow the staff's instructions during emergencies.",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 text-xl"
                  variants={listItemVariants}
                >
                  <MoveRight className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.section>

          {/* Patient Responsibilities */}
          <motion.section variants={sectionVariants}>
            <div className="flex items-center gap-3 mb-5">
              <ClipboardList className="h-7 w-7 text-accent" />
              <h2 className="text-3xl font-bold">Patient Responsibilities</h2>
            </div>
            <Separator className="mb-5 bg-muted h-1" />
            <ul className="space-y-4">
              {[
                'Provide accurate medical history and current health status.',
                'Follow the prescribed treatment and medication plan.',
                'Respect hospital staff and other patients.',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 text-xl"
                  variants={listItemVariants}
                >
                  <MoveRight className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        </main>
      </motion.div>
    </div>
  );
};

export default Guidelines;
