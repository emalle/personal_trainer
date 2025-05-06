import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Customerlist from './components/Customerlist';
import Traininglist from './components/Traininglist';

import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Personal Trainer
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, display: "flex", gap: 2 }}>
        <Button component={Link} to="/customers" variant="contained">Customers</Button>
        <Button component={Link} to="/trainings" variant="contained">Trainings</Button>
      </Box>

      <Container maxWidth={false} disableGutters sx={{ mt: 2 }}>
        <Routes>
          <Route path="/customers" element={<Customerlist />} />
          <Route path="/trainings" element={<Traininglist />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

