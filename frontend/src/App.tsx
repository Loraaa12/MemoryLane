import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AddSurpriseForm from './components/AddSurpriseForm';
import SurpriseViewer from './components/SurpriseViewer';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Simple navigation component
const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Memory Lane
        </Typography>
        <Button
          color="inherit"
          onClick={() => navigate('/add')}
          sx={{ mr: 2 }}
        >
          Add Surprise
        </Button>
        <Button
          color="inherit"
          onClick={() => navigate('/view')}
        >
          View Surprises
        </Button>
      </Toolbar>
    </AppBar>
  );
};

function AppRoutes() {
  return (
    <>
      <Navigation />
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/add" element={<AddSurpriseForm />} />
          <Route path="/view" element={<SurpriseViewer />} />
          <Route path="/" element={<AddSurpriseForm />} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
