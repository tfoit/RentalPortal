import React from "react";
import { Box, Grid, Container, Typography, Paper } from "@mui/material";
import { PageLayout } from "../components/layout";
import { Dashboard } from "../components/dashboard";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui";
import { combineStyles } from "../utils/styleUtils";
import Hero from "../components/Hero";

// Material UI icons
import HouseIcon from "@mui/icons-material/House";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

// Reusable class strings
const containerClasses = "w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16";
const gridContainerClasses = "max-w-[2000px] mx-auto";

// Component styles
const sectionStyles = combineStyles("py-8", {});
const featureCardStyles = combineStyles("h-full p-4 bg-white hover:shadow-md transition-all duration-300 rounded-xl border border-[#E5DCC4]", {});
const iconBoxStyles = combineStyles("p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3", {});

// Data arrays for features, user types, and testimonials
const features = [
  {
    title: "Prime Locations",
    description: "Find properties in the most desirable neighborhoods with proximity to amenities.",
    Icon: LocationOnIcon,
    iconBg: "#EFE9D9",
    iconColor: "text-[#4D6A59]",
  },
  {
    title: "Verified Listings",
    description: "All our properties are verified and maintained to high standards of quality.",
    Icon: StarIcon,
    iconBg: "#EFE9D9",
    iconColor: "text-[#4D6A59]",
  },
  {
    title: "Quick Process",
    description: "Streamlined application and approval process gets you moved in faster.",
    Icon: AccessTimeIcon,
    iconBg: "#EFE9D9",
    iconColor: "text-[#4D6A59]",
  },
];

const userTypes = [
  {
    title: "For Tenants",
    description: "Find your dream rental property with easy search tools and apply online.",
    buttonText: "Find a Rental",
    Icon: PeopleIcon,
    iconBg: "#EFE9D9",
    iconColor: "text-[#4D6A59]",
  },
  {
    title: "For Property Owners",
    description: "List properties, manage applications, and find reliable tenants.",
    buttonText: "List Your Property",
    Icon: HouseIcon,
    iconBg: "#EFE9D9",
    iconColor: "text-[#4D6A59]",
  },
  {
    title: "For Administrators",
    description: "Oversee properties, users, and transactions in one dashboard.",
    buttonText: "Admin Portal",
    Icon: VerifiedUserIcon,
    iconBg: "#EFE9D9",
    iconColor: "text-[#4D6A59]",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Tenant",
    initial: "S",
    testimonial: "I found my dream apartment in just two days. The process was simple and the customer service was excellent!",
  },
  {
    name: "Michael Smith",
    role: "Property Owner",
    initial: "M",
    testimonial: "As a property owner, this platform has made it so much easier to find reliable tenants and manage my properties.",
  },
  {
    name: "Jessica Lee",
    role: "Administrator",
    initial: "J",
    testimonial: "The dashboard provides complete visibility into all our properties and transactions. It's a game-changer!",
  },
];

const Home = () => {
  const { user: currentUser, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <PageLayout title={`Welcome Back, ${currentUser?.name || "User"}`} subtitle="Manage your rental properties and applications" bgColor="bg-[#F5F2E9]">
        <Dashboard />
      </PageLayout>
    );
  }

  return (
    <Box className="min-h-screen bg-[#F5F2E9]">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className={`${sectionStyles.className} bg-white`}>
        <Container maxWidth="xl" className={containerClasses}>
          <Box className="text-center mb-6">
            <Typography variant="h4" component="h2" className="font-bold text-[#3A5145] mb-2">
              Why Choose RentalPortal
            </Typography>
            <Typography variant="body1" className="text-[#607B6B] max-w-2xl mx-auto">
              Our platform offers a seamless experience for property owners, tenants, and administrators.
            </Typography>
          </Box>
          <Grid container spacing={3} className={gridContainerClasses}>
            {features.map(({ title, description, Icon, iconBg, iconColor }, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={4}>
                <Box className={`${featureCardStyles.className} transform hover:-translate-y-1`}>
                  <Box className={iconBoxStyles.className} style={{ backgroundColor: iconBg }}>
                    <Icon className={iconColor} />
                  </Box>
                  <Typography variant="h6" className="font-semibold text-[#3A5145] mb-1">
                    {title}
                  </Typography>
                  <Typography className="text-[#607B6B]">{description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* User Types Section */}
      <section className={sectionStyles.className}>
        <Container maxWidth="xl" className={containerClasses}>
          <Box className="text-center mb-6">
            <Typography variant="h4" component="h2" className="font-bold text-[#3A5145] mb-2">
              Who We Serve
            </Typography>
            <Typography variant="body1" className="text-[#607B6B] max-w-2xl mx-auto">
              Our platform is designed to meet the needs of everyone involved in the rental process.
            </Typography>
          </Box>
          <Grid container spacing={3} className={gridContainerClasses}>
            {userTypes.map(({ title, description, buttonText, Icon, iconBg, iconColor }, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={4}>
                <Paper elevation={0} className={`${featureCardStyles.className} text-center`}>
                  <Box className={iconBoxStyles.className} style={{ backgroundColor: iconBg }}>
                    <Icon className={iconColor} />
                  </Box>
                  <Typography variant="h6" className="font-semibold text-[#3A5145] mb-2">
                    {title}
                  </Typography>
                  <Typography className="text-[#607B6B] mb-3">{description}</Typography>
                  <Button variant="outline" size="md" className="mt-1">
                    {buttonText}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-[#4D6A59] text-white">
        <Container maxWidth="xl" className={containerClasses}>
          <Box className="text-center py-4">
            <Typography variant="h4" component="h2" className="font-bold mb-3">
              Ready to Find Your Perfect Rental Home?
            </Typography>
            <Typography variant="body1" className="mb-5 text-white/80 max-w-xl mx-auto">
              Join thousands of happy tenants who found their ideal rental property through our platform.
            </Typography>
            <Box className="flex flex-col sm:flex-row justify-center gap-3">
              <Button variant="primary" size="lg" className="bg-white text-[#4D6A59] hover:bg-[#EFE9D9]">
                Browse Properties
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Box>
          </Box>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className={`${sectionStyles.className} bg-white`}>
        <Container maxWidth="xl" className={containerClasses}>
          <Box className="text-center mb-6">
            <Typography variant="h4" component="h2" className="font-bold text-[#3A5145] mb-2">
              What Our Users Say
            </Typography>
            <Typography variant="body1" className="text-[#607B6B] max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied users have to say.
            </Typography>
          </Box>
          <Grid container spacing={3} className={gridContainerClasses}>
            {testimonials.map(({ name, role, initial, testimonial }, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={4}>
                <Paper elevation={0} className={featureCardStyles.className}>
                  <Box className="flex items-center mb-3">
                    <Box className="w-8 h-8 rounded-full bg-[#EFE9D9] flex items-center justify-center mr-2">
                      <Typography className="font-bold text-[#4D6A59]">{initial}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" className="font-medium text-[#3A5145]">
                        {name}
                      </Typography>
                      <Typography variant="body2" className="text-[#607B6B]">
                        {role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography className="text-[#607B6B] italic">{testimonial}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>
    </Box>
  );
};

export default Home;
