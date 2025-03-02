import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getApartments } from "../services/apartmentService";
// Import Material UI icons
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import BuildIcon from "@mui/icons-material/Build";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FilterListIcon from "@mui/icons-material/FilterList";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import EmailIcon from "@mui/icons-material/Email";
import TuneIcon from "@mui/icons-material/Tune";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Collapse, IconButton } from "@mui/material";

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`dashboard-tabpanel-${index}`} aria-labelledby={`dashboard-tab-${index}`} {...other}>
      {value === index && <div className="py-6">{children}</div>}
    </div>
  );
}

// Activity item component - Airbnb-inspired light design
function ActivityItem({ icon, title, description, time, isNew }) {
  return (
    <div className={`p-4 ${isNew ? "border-l-2 border-rose-500" : ""} mb-3 rounded-lg transition-all duration-300 hover:shadow-sm bg-white dark:bg-gray-800`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className={`p-2 rounded-full ${isNew ? "bg-rose-50 text-rose-500" : "bg-gray-50 text-gray-500"}`}>{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full">{time}</span>
        </div>
      </div>
    </div>
  );
}

// Property card component - Airbnb-inspired light design
function PropertyCard({ apartment, onClick }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircleIcon className="text-teal-500" />;
      case "rented":
        return <ApartmentIcon className="text-rose-500" />;
      case "maintenance":
        return <BuildIcon className="text-amber-500" />;
      default:
        return <WarningIcon className="text-rose-600" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "available":
        return "bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-medium";
      case "rented":
        return "bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs font-medium";
      case "maintenance":
        return "bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  return (
    <div onClick={onClick} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
      <div className="relative">
        <div className="h-48 bg-gray-50 dark:bg-gray-700">
          {apartment.images && apartment.images.length > 0 ? (
            <img src={apartment.images[0]} alt={apartment.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ApartmentIcon style={{ fontSize: 60 }} className="text-gray-300" />
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className={getStatusBadgeClass(apartment.status)}>{apartment.status.charAt(0).toUpperCase() + apartment.status.slice(1)}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">{apartment.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
              <HomeIcon fontSize="small" className="mr-1 opacity-70" />
              {apartment.location}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {apartment.rent} {apartment.currency || "USD"}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
            </p>
            <button className="rounded-full p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors">
              <ArrowForwardIcon fontSize="small" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Summary card component - Airbnb-inspired light design
function SummaryCard({ title, count, icon, linkPath, linkText }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute right-0 top-0 opacity-5">{React.cloneElement(icon, { style: { fontSize: 120 } })}</div>
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{title}</h3>
        <div className="p-2 bg-rose-50 dark:bg-gray-700 rounded-lg text-rose-500 dark:text-rose-400">{icon}</div>
      </div>
      <p className="text-3xl font-bold mb-2 relative z-10 text-gray-900 dark:text-white">{count}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 relative z-10">Total {title.toLowerCase()}</p>
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <Link to={linkPath} className="text-sm text-rose-500 hover:text-rose-600 flex items-center group">
          {linkText}
          <ArrowForwardIcon className="ml-1 transform group-hover:translate-x-1 transition-transform" fontSize="small" />
        </Link>
      </div>
    </div>
  );
}

// Quick action component - Airbnb-inspired light design
function QuickAction({ icon, title, path }) {
  return (
    <Link to={path} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center p-4">
        <div className="p-2 rounded-lg mr-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{icon}</div>
        <span className="font-medium text-gray-800 dark:text-gray-200">{title}</span>
      </div>
    </Link>
  );
}

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState(null);
  const [showTools, setShowTools] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apartmentsData = await getApartments();
        setApartments(apartmentsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (index) => {
    setTabValue(index);
  };

  // Filter apartments based on user role
  const userApartments = apartments.filter((apt) => {
    if (!currentUser || !currentUser.role) {
      return true; // Show all if role is not defined
    }

    if (currentUser.role === "admin") {
      return true; // Admin sees all
    } else if (currentUser.role === "owner") {
      return apt.owner === currentUser._id; // Owners see their own listings
    } else {
      // Tenants see apartments they're renting
      return apt.tenants && apt.tenants.includes(currentUser._id);
    }
  });

  // Calculate monthly income safely
  const calculateMonthlyIncome = () => {
    return userApartments.reduce((acc, apt) => {
      const rentValue = apt.status === "rented" ? parseFloat(apt.rent || 0) : 0;
      return isNaN(rentValue) ? acc : acc + rentValue;
    }, 0);
  };

  const monthlyIncome = calculateMonthlyIncome();

  // Update mock activity data with Airbnb-style icons and colors
  const recentActivities = [
    {
      icon: <NotificationsIcon className="text-rose-500" />,
      title: "New message from property manager",
      description: "Regarding your maintenance request for Apartment #103",
      time: "2h ago",
      isNew: true,
    },
    {
      icon: <AttachMoneyIcon className="text-teal-500" />,
      title: "Rent payment confirmed",
      description: "Your payment for May 2025 has been processed",
      time: "1d ago",
      isNew: false,
    },
    {
      icon: <BuildIcon className="text-amber-500" />,
      title: "Maintenance scheduled",
      description: "Plumber will visit on June 5th between 10am-12pm",
      time: "3d ago",
      isNew: false,
    },
  ];

  // Quick actions based on user role
  const quickActions = [
    currentUser?.role === "owner" && {
      icon: <AddIcon />,
      title: "Add New Property",
      path: "/apartments/new",
    },
    {
      icon: <BuildIcon />,
      title: "Request Maintenance",
      path: "/maintenance/request",
    },
    {
      icon: <DescriptionIcon />,
      title: "Upload Document",
      path: "/documents/upload",
    },
    {
      icon: <EmailIcon />,
      title: "View Messages",
      path: "/messages",
    },
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-peach bg-opacity-10 border border-peach text-peach p-4 rounded-lg">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-2 btn btn-outline border-peach text-peach hover:bg-peach hover:text-white">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="p-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-white flex items-center">
              <DashboardIcon className="mr-2 text-rose-500" /> Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome, {currentUser?.name || "User"}</p>
          </div>

          <div className="mt-4 md:mt-0">
            <IconButton onClick={() => setShowTools(!showTools)} className="bg-gray-100 hover:bg-gray-200 text-gray-600" aria-label="Show dashboard tools" title="Filter and search tools" size="small">
              <MoreHorizIcon />
            </IconButton>

            <Collapse in={showTools} className="mt-2">
              <div className="flex space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm animate-fadeIn">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                  <FilterListIcon className="mr-1" fontSize="small" /> Filter
                </button>
                <button className="px-3 py-1 text-sm bg-rose-500 text-white rounded-md hover:bg-rose-600 flex items-center">
                  <SearchIcon className="mr-1" fontSize="small" /> Search
                </button>
              </div>
            </Collapse>
          </div>
        </div>

        {/* Tabs with lighter styling */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            <button onClick={() => handleTabChange(0)} className={`px-4 py-2 font-medium text-sm transition-all border-b-2 ${tabValue === 0 ? "border-rose-500 text-rose-500" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-rose-500"}`}>
              <HomeIcon className="mr-1" fontSize="small" /> Overview
            </button>
            <button onClick={() => handleTabChange(1)} className={`px-4 py-2 font-medium text-sm transition-all border-b-2 ${tabValue === 1 ? "border-rose-500 text-rose-500" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-rose-500"}`}>
              <ApartmentIcon className="mr-1" fontSize="small" /> My Apartments
            </button>
            <button onClick={() => handleTabChange(2)} className={`px-4 py-2 font-medium text-sm transition-all border-b-2 ${tabValue === 2 ? "border-rose-500 text-rose-500" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-rose-500"}`}>
              <DescriptionIcon className="mr-1" fontSize="small" /> Documents
            </button>
          </div>
        </div>
      </div>

      {/* Tab panels */}
      <TabPanel value={tabValue} index={0}>
        {/* Summary cards with more white space */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mb-10">
          <SummaryCard title="Rented" count={userApartments.filter((apt) => apt.status === "rented").length || 0} icon={<ApartmentIcon />} linkPath="/apartments?status=rented" linkText="View details" />
          <SummaryCard title="Monthly Income" count={`$${monthlyIncome}`} icon={<AttachMoneyIcon />} linkPath="/finance" linkText="View details" />
          <SummaryCard title="Expenses" count="$950" icon={<MoneyOffIcon />} linkPath="/finance/expenses" linkText="View details" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-8">
          {/* Recent Activity */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">Recent Activity</h2>
              <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs font-medium">{recentActivities.filter((act) => act.isNew).length} new</span>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.filter(Boolean).map((action, index) => (
                <QuickAction key={index} {...action} />
              ))}
            </div>
          </div>
        </div>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <div className="px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">My Properties</h2>
            {currentUser?.role === "owner" && (
              <Link to="/apartments/new" className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors flex items-center">
                <AddIcon className="mr-1" fontSize="small" /> Add Property
              </Link>
            )}
          </div>

          {userApartments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userApartments.map((apartment) => (
                <PropertyCard key={apartment._id} apartment={apartment} onClick={() => (window.location.href = `/apartments/${apartment._id}`)} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-sm">
              <ApartmentIcon style={{ fontSize: 48 }} className="text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No properties found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{currentUser?.role === "owner" ? "You haven't added any properties yet." : "You don't have any properties assigned to you."}</p>
              {currentUser?.role === "owner" && (
                <Link to="/apartments/new" className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors inline-flex items-center">
                  <AddIcon className="mr-1" fontSize="small" /> Add Your First Property
                </Link>
              )}
            </div>
          )}
        </div>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <div className="px-8">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">Documents</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-sm">
            <DescriptionIcon style={{ fontSize: 48 }} className="text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No documents found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Upload and manage your property documents here.</p>
            <button className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors flex items-center mx-auto">
              <AddIcon className="mr-1" fontSize="small" /> Upload Document
            </button>
          </div>
        </div>
      </TabPanel>
    </div>
  );
};

export default Dashboard;
