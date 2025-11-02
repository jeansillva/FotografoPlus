import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Portfolio from "./pages/Portfolio";
import Schedule from "./pages/Schedule";
import Register from "./pages/Register";
import UpdateCredentials from "./pages/UpdateCredentials";
import PrivateRoute from "./routes/PrivateRoute";
import Albums from "./pages/Albums";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/update-credentials"
          element={
            <PrivateRoute>
              <UpdateCredentials />
            </PrivateRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <PrivateRoute>
              <Portfolio />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <PrivateRoute>
              <Schedule />
            </PrivateRoute>
          }
        />
        <Route path="/albums" element={<PrivateRoute><Albums /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
