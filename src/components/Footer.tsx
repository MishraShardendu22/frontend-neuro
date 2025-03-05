import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Github, Linkedin, Heart, Coffee, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/MishraShardendu22',
      icon: <Github className="w-5 h-5" />,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/shardendumishra22',
      icon: <Linkedin className="w-5 h-5" />,
    },
  ];

  const iconVariants = {
    hover: {
      scale: 1.2,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <footer className="relative bg-card text-card-foreground dark:bg-card dark:text-card-foreground py-10 mt-16 border-t border-border">
      {/* Colorful top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <motion.div
              className="text-2xl font-bold text-primary dark:text-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Shardendu Mishra
            </motion.div>
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
              Creating innovative web experiences with modern technologies
            </p>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center">
            <div className="p-4 rounded-full bg-muted dark:bg-muted">
              <img
                src="/Logo/PNG/main-logo-white-transparent.png"
                alt="Shardendu Mishra"
                className="w-26 h-26 rounded-full"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <Card className="p-4 bg-card/50 backdrop-blur border-border shadow-md">
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-muted hover:bg-primary dark:bg-muted dark:hover:bg-primary rounded-full hover:text-primary-foreground dark:hover:text-primary-foreground transition-colors duration-300 flex items-center gap-1"
                    whileHover="hover"
                    variants={iconVariants}
                    aria-label={link.name}
                  >
                    {link.icon}
                    <span className="hidden sm:inline text-xs font-medium">{link.name}</span>
                    <ExternalLink className="w-3 h-3 hidden sm:inline" />
                  </motion.a>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Separator className="bg-border dark:bg-border/50" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} All Rights Reserved
            </p>
          </div>

          <motion.div
            className="flex items-center text-sm text-muted-foreground group"
            whileHover={{ scale: 1.05 }}
          >
            <span className="flex items-center">
              Made with
              <motion.span
                className="mx-1"
                whileHover={{ rotate: 10 }}
                animate={{
                  scale: [1, 1.2, 1],
                  transition: {
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 2,
                  },
                }}
              >
                <Heart className="w-4 h-4 text-destructive" />
              </motion.span>
              and
              <motion.span className="mx-1" whileHover={{ y: -2 }}>
                <Coffee className="w-4 h-4 text-accent" />
              </motion.span>
              <span className="font-medium text-foreground dark:text-foreground">
                by Shardendu Mishra
              </span>
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
