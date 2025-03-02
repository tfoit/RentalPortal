import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Divider, List, ListItem, ListItemText, Collapse, IconButton } from '@mui/material';
import enhancedLogger from '../utils/enhancedLogger';

/**
 * DevTools component for debugging React rendering issues
 * This provides a visual interface for debugging application state, rendering, and network issues
 */
const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [components, setComponents] = useState([]);
  const [networkRequests, setNetworkRequests] = useState([]);
  const [appState, setAppState] = useState({});
  const [isHidden, setIsHidden] = useState(false);
  
  // Capture logs from the enhanced logger
  useEffect(() => {
    const interval = setInterval(() => {
      if (enhancedLogger.logs) {
        setLogs([...enhancedLogger.logs].reverse().slice(0, 50));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Collect component render metrics
  useEffect(() => {
    const componentTracker = {
      renders: {},
      mounts: {},
      updates: {},
      unmounts: {}
    };
    
    // Hook into React's lifecycle events via our logger
    const originalRenderLog = enhancedLogger.renderLog;
    const originalMountLog = enhancedLogger.mountLog;
    const originalUpdateLog = enhancedLogger.updateLog;
    const originalUnmountLog = enhancedLogger.unmountLog;
    
    enhancedLogger.renderLog = (componentName, props) => {
      if (!componentTracker.renders[componentName]) {
        componentTracker.renders[componentName] = 0;
      }
      componentTracker.renders[componentName]++;
      setComponents(Object.entries(componentTracker.renders).map(([name, count]) => ({ name, renders: count })));
      originalRenderLog.call(enhancedLogger, componentName, props);
    };
    
    enhancedLogger.mountLog = (componentName) => {
      if (!componentTracker.mounts[componentName]) {
        componentTracker.mounts[componentName] = 0;
      }
      componentTracker.mounts[componentName]++;
      originalMountLog.call(enhancedLogger, componentName);
    };
    
    return () => {
      enhancedLogger.renderLog = originalRenderLog;
      enhancedLogger.mountLog = originalMountLog;
      enhancedLogger.updateLog = originalUpdateLog;
      enhancedLogger.unmountLog = originalUnmountLog;
    };
  }, []);
  
  // Capture network requests
  useEffect(() => {
    // This will only work if we're listening to network activity elsewhere
    // We'll poll the logs and filter for network events
    const interval = setInterval(() => {
      if (enhancedLogger.logs) {
        const networkLogs = enhancedLogger.logs.filter(log => 
          log.message && (
            log.message.includes('Fetch request') || 
            log.message.includes('Axios request') || 
            log.message.includes('XHR request')
          )
        );
        
        setNetworkRequests(networkLogs.slice(0, 20));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get application state
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        // Check localStorage
        const localStorageItems = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          try {
            const value = localStorage.getItem(key);
            // Try to parse JSON values
            try {
              localStorageItems[key] = JSON.parse(value);
            } catch {
              localStorageItems[key] = value;
            }
          } catch (e) {
            localStorageItems[key] = '[Error reading value]';
          }
        }
        
        // Get route info
        const routeInfo = {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash
        };
        
        // Update the app state
        setAppState({
          localStorage: localStorageItems,
          route: routeInfo,
          performanceMetrics: {
            memory: window.performance?.memory ? {
              jsHeapSizeLimit: Math.round(window.performance.memory.jsHeapSizeLimit / (1024 * 1024)) + 'MB',
              totalJSHeapSize: Math.round(window.performance.memory.totalJSHeapSize / (1024 * 1024)) + 'MB',
              usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) + 'MB'
            } : 'Not available',
            timing: {
              domLoading: window.performance.timing.domLoading,
              domInteractive: window.performance.timing.domInteractive,
              domContentLoadedEventEnd: window.performance.timing.domContentLoadedEventEnd,
              loadEventEnd: window.performance.timing.loadEventEnd
            }
          }
        });
      } catch (error) {
        console.error('Error collecting app state', error);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Toggle the visibility of the dev tools
  const toggleDevTools = () => {
    setIsOpen(!isOpen);
  };
  
  // Hide completely (minimize to a small button)
  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };
  
  // If hidden, show just the toggle button
  if (isHidden) {
    return (
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={toggleVisibility}
        sx={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 9999,
          minWidth: '30px',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          p: 0
        }}
      >
        D
      </Button>
    );
  }
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        width: isOpen ? '80%' : '200px',
        maxWidth: '800px',
        maxHeight: isOpen ? '80vh' : '40px',
        zIndex: 9999,
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Paper elevation={3}>
        <Box 
          sx={{ 
            p: 1, 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="subtitle2">
            📊 React DevTools {isOpen ? '(Expanded)' : '(Minimized)'}
          </Typography>
          <Box>
            <Button 
              size="small" 
              variant="contained" 
              color="info" 
              onClick={toggleDevTools}
              sx={{ mr: 1, py: 0, minWidth: '80px' }}
            >
              {isOpen ? 'Minimize' : 'Expand'}
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              color="error" 
              onClick={toggleVisibility}
              sx={{ py: 0, minWidth: '30px', width: '30px' }}
            >
              X
            </Button>
          </Box>
        </Box>
        
        {isOpen && (
          <Box sx={{ p: 2, maxHeight: 'calc(80vh - 50px)', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>Application Diagnostics</Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1">Component Renders</Typography>
            <List dense>
              {components.sort((a, b) => b.renders - a.renders).slice(0, 10).map((comp, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={comp.name} 
                    secondary={`Renders: ${comp.renders}`} 
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1">Recent Network Activity</Typography>
            <List dense>
              {networkRequests.slice(0, 5).map((req, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={req.message} 
                    secondary={new Date(req.timestamp).toLocaleTimeString()} 
                  />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1">Recent Errors</Typography>
            <List dense>
              {logs.filter(log => log.level === 'ERROR' || log.level === 'CRITICAL').slice(0, 5).map((log, index) => (
                <ListItem key={index} sx={{ bgcolor: log.level === 'CRITICAL' ? 'rgba(255,0,0,0.1)' : 'transparent' }}>
                  <ListItemText 
                    primary={log.message} 
                    secondary={`${log.level} - ${new Date(log.timestamp).toLocaleTimeString()}`} 
                    primaryTypographyProps={{ 
                      color: log.level === 'CRITICAL' ? 'error' : 'text.primary',
                      fontWeight: 'bold'
                    }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1">Authentication Status</Typography>
            <Paper variant="outlined" sx={{ p: 1, mb: 2 }}>
              <Typography variant="body2">
                Token Present: <strong>{appState.localStorage?.token ? 'Yes' : 'No'}</strong>
              </Typography>
            </Paper>
            
            <Button 
              variant="outlined" 
              color="secondary" 
              fullWidth 
              onClick={() => {
                enhancedLogger.clearLogs();
                enhancedLogger.info('Logs cleared by user');
                enhancedLogger.critical('🛑 ATTENTION: White screen debugging in progress');
              }}
            >
              Clear Logs
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              sx={{ mt: 1 }}
              onClick={() => {
                const debugData = {
                  logs: enhancedLogger.logs,
                  components,
                  appState,
                  networkRequests,
                  browserInfo: {
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    platform: navigator.platform,
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height
                  }
                };
                
                const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `debug-data-${new Date().toISOString()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                enhancedLogger.info('Debug data exported');
              }}
            >
              Export Debug Data
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DevTools; 