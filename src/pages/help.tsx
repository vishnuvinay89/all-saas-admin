import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Chip, 
  Paper, 
  Button,
  Avatar,
  Divider,
  Fade,
  Slide,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Info,
  Security,
  Group,
  Business,
  School,
  VideoLibrary,
  Description,
  ContactSupport,
  ArrowBack,
  CheckCircle,
  Warning,
  Lightbulb,
  TrendingUp,
  SupportAgent,
  School as SchoolIcon,
  People,
  AdminPanelSettings,
  Assignment,
  QuestionAnswer,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const HelpPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const helpSections = [
    {
      title: 'Tenant Management',
      icon: <Business sx={{ color: "#2581C4", fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="#2581C4" fontWeight="bold" sx={{ mb: 2 }}>
            Overview
          </Typography>
          <Typography paragraph sx={{ color: "#666", lineHeight: 1.7, mb: 3 }}>
            Manage organizational tenants in the system. Tenants represent different organizations or institutions using the platform.
          </Typography>
          
          <Typography variant="h6" gutterBottom color="#2581C4" fontWeight="bold" sx={{ mb: 2 }}>
            Key Features
          </Typography>
          <List dense sx={{ mb: 3 }}>
            <ListItem sx={{ py: 1, px: 0, alignItems: 'center' }}>
              <ListItemIcon sx={{ minWidth: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), width: 32, height: 32 }}>
                  <Info sx={{ color: "#2581C4", fontSize: 18 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary="Create new tenants with organizational details" 
                primaryTypographyProps={{ fontSize: "15px", color: "#333", fontWeight: 500 }}
                sx={{ ml: 1 }}
              />
            </ListItem>
            <ListItem sx={{ py: 1, px: 0, alignItems: 'center' }}>
              <ListItemIcon sx={{ minWidth: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), width: 32, height: 32 }}>
                  <Info sx={{ color: "#2581C4", fontSize: 18 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary="Edit tenant information and settings" 
                primaryTypographyProps={{ fontSize: "15px", color: "#333", fontWeight: 500 }}
                sx={{ ml: 1 }}
              />
            </ListItem>
            <ListItem sx={{ py: 1, px: 0, alignItems: 'center' }}>
              <ListItemIcon sx={{ minWidth: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), width: 32, height: 32 }}>
                  <Info sx={{ color: "#2581C4", fontSize: 18 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary="Archive tenants when no longer needed" 
                primaryTypographyProps={{ fontSize: "15px", color: "#333", fontWeight: 500 }}
                sx={{ ml: 1 }}
              />
            </ListItem>
          </List>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: alpha('#2581C4', 0.05), 
              border: `2px solid ${alpha('#2581C4', 0.1)}`,
              borderRadius: "16px",
              mt: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #2581C4, #1976d2)',
              }
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Lightbulb sx={{ color: "#2581C4", mr: 1 }} />
              <Typography variant="subtitle1" color="#2581C4" fontWeight="bold">
                How to Add a New Tenant
              </Typography>
            </Box>
            <Box component="ol" sx={{ m: 0, pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ color: "#666", mb: 1 }}>
                Click the "Add" button in the tenant table
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: "#666", mb: 1 }}>
                Fill in the tenant details form
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: "#666", mb: 1 }}>
                Set the tenant configuration
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: "#666" }}>
                Click "Save" to create the tenant
              </Typography>
            </Box>
          </Paper>
        </Box>
      )
    },
    {
      title: 'Cohort Management',
      icon: <School sx={{ color: "#2581C4", fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="#2581C4" fontWeight="bold" sx={{ mb: 2 }}>
            Overview
          </Typography>
          <Typography paragraph sx={{ color: "#666", lineHeight: 1.7, mb: 3 }}>
            Manage learning cohorts within tenants. Cohorts are groups of learners organized for specific educational programs.
          </Typography>
          
          <Typography variant="h6" gutterBottom color="#2581C4" fontWeight="bold" sx={{ mb: 2 }}>
            Key Features
          </Typography>
          <List dense sx={{ mb: 3 }}>
            <ListItem sx={{ py: 1, px: 0, alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), width: 32, height: 32 }}>
                  <Info sx={{ color: "#2581C4", fontSize: 18 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary="Create cohorts with specific learning objectives" 
                primaryTypographyProps={{ fontSize: "15px", color: "#333", fontWeight: 500 }}
                sx={{ mt: 0.5 }}
              />
            </ListItem>
            <ListItem sx={{ py: 1, px: 0, alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), width: 32, height: 32 }}>
                  <Info sx={{ color: "#2581C4", fontSize: 18 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary="Assign cohort administrators" 
                primaryTypographyProps={{ fontSize: "15px", color: "#333", fontWeight: 500 }}
                sx={{ mt: 0.5 }}
              />
            </ListItem>
            <ListItem sx={{ py: 1, px: 0, alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), width: 32, height: 32 }}>
                  <Info sx={{ color: "#2581C4", fontSize: 18 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary="Monitor cohort progress and engagement" 
                primaryTypographyProps={{ fontSize: "15px", color: "#333", fontWeight: 500 }}
                sx={{ mt: 0.5 }}
              />
            </ListItem>
          </List>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: alpha('#ff9800', 0.08), 
              border: `2px solid ${alpha('#ff9800', 0.2)}`,
              borderRadius: "16px",
              mt: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #ff9800, #f57c00)',
              }
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <Warning sx={{ color: "#ff9800", mr: 1 }} />
              <Typography variant="subtitle1" color="#ff9800" fontWeight="bold">
                Important Notice
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#e65100", fontWeight: 500 }}>
              Cohorts with active members cannot be deleted. Remove all members first before archiving a cohort.
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      title: 'User Management',
      icon: <Group sx={{ color: "#2581C4", fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="#2581C4" fontWeight="bold" sx={{ mb: 2 }}>
            Overview
          </Typography>
          <Typography paragraph sx={{ color: "#666", lineHeight: 1.7, mb: 3 }}>
            Manage learners and their access to the platform. Control user roles, permissions, and learning assignments.
          </Typography>
          
          <Typography variant="h6" gutterBottom color="#2581C4" fontWeight="bold" sx={{ mb: 2 }}>
            User Types
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card 
                variant="outlined" 
                sx={{ 
                  border: `2px solid ${alpha('#2581C4', 0.1)}`,
                  borderRadius: "16px",
                  height: '100%',
                  transition: 'all 0.3s ease',
                  "&:hover": { 
                    boxShadow: '0 8px 25px rgba(37, 129, 196, 0.15)',
                    transform: 'translateY(-4px)',
                    borderColor: '#2581C4'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), width: 56, height: 56, mx: 'auto', mb: 2 }}>
                    <AdminPanelSettings sx={{ color: "#2581C4", fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h6" color="#2581C4" fontWeight="bold" sx={{ mb: 1 }}>
                    Super Admin
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                    Full system access, manages all tenants and users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card 
                variant="outlined" 
                sx={{ 
                  border: `2px solid ${alpha('#2581C4', 0.1)}`,
                  borderRadius: "16px",
                  height: '100%',
                  transition: 'all 0.3s ease',
                  "&:hover": { 
                    boxShadow: '0 8px 25px rgba(37, 129, 196, 0.15)',
                    transform: 'translateY(-4px)',
                    borderColor: '#2581C4'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), width: 56, height: 56, mx: 'auto', mb: 2 }}>
                    <Business sx={{ color: "#2581C4", fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h6" color="#2581C4" fontWeight="bold" sx={{ mb: 1 }}>
                    Tenant Admin
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                    Manages users within their tenant organization
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card 
                variant="outlined" 
                sx={{ 
                  border: `2px solid ${alpha('#2581C4', 0.1)}`,
                  borderRadius: "16px",
                  height: '100%',
                  transition: 'all 0.3s ease',
                  "&:hover": { 
                    boxShadow: '0 8px 25px rgba(37, 129, 196, 0.15)',
                    transform: 'translateY(-4px)',
                    borderColor: '#2581C4'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), width: 56, height: 56, mx: 'auto', mb: 2 }}>
                    <SchoolIcon sx={{ color: "#2581C4", fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h6" color="#2581C4" fontWeight="bold" sx={{ mb: 1 }}>
                    Cohort Admin
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                    Manages specific cohorts and their learners
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: alpha('#4caf50', 0.08), 
              border: `2px solid ${alpha('#4caf50', 0.2)}`,
              borderRadius: "16px",
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #4caf50, #388e3c)',
              }
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <TrendingUp sx={{ color: "#4caf50", mr: 1 }} />
              <Typography variant="subtitle1" color="#4caf50" fontWeight="bold">
                CSV Upload
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#2e7d32", fontWeight: 500 }}>
              Upload multiple users at once using CSV format. Download the sample CSV template for the correct format.
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      title: 'Approval System',
      icon: <Security sx={{ color: "#2581C4", fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="#2581C4" fontWeight="bold" sx={{ mb: 2 }}>
            Overview
          </Typography>
          <Typography paragraph sx={{ color: "#666", lineHeight: 1.7, mb: 3 }}>
            Review and approve user registration requests and administrative actions that require approval.
          </Typography>
          
          <Typography variant="h6" gutterBottom color="#2581C4" fontWeight="bold" sx={{ mb: 2 }}>
            Approval Types
          </Typography>
          <List dense>
            <ListItem sx={{ py: 1, px: 0, alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                <Chip 
                  label="Pending" 
                  color="warning" 
                  size="small" 
                  sx={{ fontWeight: 600 }}
                />
              </ListItemIcon>
              <ListItemText 
                primary="New user registration requests" 
                primaryTypographyProps={{ fontSize: "15px", color: "#333", fontWeight: 500 }}
                sx={{ mt: 0.5 }}
              />
            </ListItem>
            <ListItem sx={{ py: 1, px: 0, alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                <Chip 
                  label="Review" 
                  color="info" 
                  size="small" 
                  sx={{ fontWeight: 600 }}
                />
              </ListItemIcon>
              <ListItemText 
                primary="Role change requests" 
                primaryTypographyProps={{ fontSize: "15px", color: "#333", fontWeight: 500 }}
                sx={{ mt: 0.5 }}
              />
            </ListItem>
          </List>
        </Box>
      )
    }
  ];

  const faqItems = [
    {
      question: "How do I reset a user's password?",
      answer: "Go to the user management section, find the user, click the action menu, and select 'Reset Password'.",
      category: "user-management",
      tags: ["password", "reset", "user"]
    },
    {
      question: "Why can't I delete a cohort?",
      answer: "Cohorts with active members cannot be deleted. You need to remove all members to other cohorts before you can archive the cohort.",
      category: "cohort-management",
      tags: ["delete", "cohort", "members"]
    },
    {
      question: "How do I bulk upload users?",
      answer: "Use the CSV upload feature in the user management section. Download the sample CSV template, fill in your user data, and upload the file. The system will validate and import the users.",
      category: "user-management",
      tags: ["upload", "csv", "bulk", "users"]
    },
    {
      question: "What are the different user roles?",
      answer: "There are three main roles: Super Admin (full system access), Tenant Admin (manages users within their organization), and Cohort Admin (manages specific cohorts and learners).",
      category: "user-management",
      tags: ["roles", "permissions", "access"]
    }
  ];

  const filteredFAQs = faqItems.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Enhanced Header */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #000033 0%, #1a1a2e 100%)',
          color: 'white', 
          py: 3, 
          px: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(37, 129, 196, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: alpha('#2581C4', 0.2), mr: 2, width: 48, height: 48 }}>
            <Description sx={{ color: 'white', fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Help & Documentation
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Comprehensive guide to using the Admin Portal
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            fontWeight: 600,
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            },
            transition: 'all 0.3s ease'
          }}
          onClick={() => router.push('/tenant')}
        >
          Back to Portal
        </Button>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Fade in timeout={800}>
          <Box>
            {/* Enhanced Quick Start Guide */}
            <Card 
              sx={{ 
                mb: 4, 
                background: 'linear-gradient(135deg, #2581C4 0%, #1976d2 100%)', 
                color: "white",
                borderRadius: "20px",
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(37, 129, 196, 0.3)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  pointerEvents: 'none'
                }
              }}
            >
              <CardContent sx={{ p: 4, position: 'relative' }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mr: 2, width: 56, height: 56 }}>
                    <Lightbulb sx={{ color: 'white', fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    🚀 Quick Start Guide
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.9, lineHeight: 1.6, maxWidth: '600px' }}>
                  Welcome to the Admin Portal! This comprehensive help section will guide you through all the features and functionalities.
                </Typography>
              </CardContent>
            </Card>

            {/* Enhanced Help Sections */}
            {helpSections.map((section, index) => (
              <Slide direction="up" in timeout={600 + index * 200} key={index}>
                <Card 
                  sx={{ 
                    mb: 3, 
                    border: `2px solid ${alpha('#e0e0e0', 0.5)}`,
                    borderRadius: "20px",
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    "&:hover": { 
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-4px)',
                      borderColor: '#2581C4'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 4, 
                      borderBottom: `2px solid ${alpha('#e0e0e0', 0.3)}`,
                      display: "flex", 
                      alignItems: "center", 
                      gap: 3,
                      background: `linear-gradient(135deg, ${alpha('#f8f9fa', 0.8)} 0%, ${alpha('#ffffff', 0.9)} 100%)`
                    }}
                  >
                    <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), width: 64, height: 64 }}>
                      {section.icon}
                    </Avatar>
                    <Typography variant="h5" color="#2581C4" fontWeight="bold">
                      {section.title}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 4, bgcolor: 'white' }}>
                    {section.content}
                  </Box>
                </Card>
              </Slide>
            ))}

            {/* Enhanced Additional Resources */}
            <Card sx={{ mt: 4, border: `2px solid ${alpha('#e0e0e0', 0.5)}`, borderRadius: "20px", overflow: 'hidden' }}>
              <CardContent sx={{ p: 4, bgcolor: alpha('#f8f9fa', 0.5) }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), mr: 2, width: 48, height: 48 }}>
                    <SupportAgent sx={{ color: "#2581C4", fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="h5" color="#2581C4" fontWeight="bold">
                    📞 Additional Resources
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      startIcon={<VideoLibrary />}
                      fullWidth
                      sx={{ 
                        borderColor: "#2581C4", 
                        color: "#2581C4",
                        borderRadius: '12px',
                        py: 2,
                        fontWeight: 600,
                        "&:hover": { 
                          borderColor: "#1976d2", 
                          backgroundColor: alpha('#2581C4', 0.05),
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(37, 129, 196, 0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    //   onClick={() => window.open('#', '_blank')}
                    >
                      Video Tutorials
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      startIcon={<Description />}
                      fullWidth
                      sx={{ 
                        borderColor: "#2581C4", 
                        color: "#2581C4",
                        borderRadius: '12px',
                        py: 2,
                        fontWeight: 600,
                        "&:hover": { 
                          borderColor: "#1976d2", 
                          backgroundColor: alpha('#2581C4', 0.05),
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(37, 129, 196, 0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    //   onClick={() => window.open('#', '_blank')}
                    >
                      Documentation
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      startIcon={<ContactSupport />}
                      fullWidth
                      sx={{ 
                        borderColor: "#2581C4", 
                        color: "#2581C4",
                        borderRadius: '12px',
                        py: 2,
                        fontWeight: 600,
                        "&:hover": { 
                          borderColor: "#1976d2", 
                          backgroundColor: alpha('#2581C4', 0.05),
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(37, 129, 196, 0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    //   onClick={() => window.open('mailto:support@example.com', '_blank')}
                    >
                      Contact Support
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Fixed FAQ Section */}
            <Card sx={{ mt: 4, border: `2px solid ${alpha('#e0e0e0', 0.5)}`, borderRadius: "20px", overflow: 'hidden' }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: alpha('#2581C4', 0.1), mr: 2, width: 48, height: 48 }}>
                    <QuestionAnswer sx={{ color: "#2581C4", fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="h5" color="#2581C4" fontWeight="bold">
                    ❓ Frequently Asked Questions
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  {filteredFAQs.map((faq, index) => (
                    <Accordion
                      key={index}
                      expanded={expandedFAQ === index}
                      onChange={() => toggleFAQ(index)}
                      sx={{
                        mb: 2,
                        border: `2px solid ${alpha('#e0e0e0', 0.3)}`,
                        borderRadius: "16px",
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#2581C4',
                          boxShadow: '0 4px 12px rgba(37, 129, 196, 0.1)'
                        },
                        '&:before': {
                          display: 'none'
                        },
                        '&.Mui-expanded': {
                          borderColor: '#2581C4',
                          boxShadow: '0 4px 12px rgba(37, 129, 196, 0.15)'
                        }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          backgroundColor: expandedFAQ === index ? alpha('#2581C4', 0.05) : 'white',
                          '&:hover': {
                            backgroundColor: alpha('#2581C4', 0.05)
                          },
                          '&.Mui-expanded': {
                            backgroundColor: alpha('#2581C4', 0.05)
                          }
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold" color="#333">
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: 'white', pt: 0 }}>
                        <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
      noLayout: true,
    },
  };
};

export default HelpPage; 