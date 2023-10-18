import React, { Fragment } from "react";
import "./App.css";
import "./style/main.css";
import { UserContext } from "./context/UserContext";
import { useContext } from "react";
import MainNavigation from "./components/sidemenu/MainNavigation";
import AnlagenNavigation from "./components/sidemenu/AnlagenNavigation";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/start/Dashboard";
import Boxen from "./pages/boxen/Boxen";
import Dateien from "./pages/Dateien";
import Servicebericht from "./pages/Servicebericht";
import AnlagenDetails from "./pages/anlagen/AnlagenDetails";
import AnlageStatistik from "./pages/anlagen/AnlageStatistik";
import DeaktivierteAnlagen from "./pages/anlagen/DeaktivierteAnlagen";
import NeueAnlage from "./pages/anlagen/NeueAnlage";
import Datenpunkte from "./pages/start/Datenpunkte";
import Information from "./pages/ubersicht/Information";
import Netzteile from "./pages/ubersicht/Netzteile";
import Vertretungszugriffe from "./pages/ubersicht/Vertretungszugriffe";
import BoxenEdit from "./pages/boxen/Boxen_edit";
import BuildingInfo from "./pages/boxen/Building/Building_info";
import ConnectedDevices from "./pages/boxen/Building/Connected_devices";

function App() {
  const { user } = useContext(UserContext);
  return (
    <div className="App">
      <Router>
        {user && <Fragment children={<MainNavigation />} />}
        {/* {user && <Fragment children={<MainNavigation />} />} */}
        <Routes>
          {/* Start */}
          {user && <Route path="/" element={<Dashboard />} />}
          {user && <Route path="/datenpunkte" element={<Datenpunkte />} />}
          {/* Anlagen */}
          {user && (
            <Route path="/anlagen/details" element={<AnlagenDetails />} />
          )}
          {user && (
            <Route path="/anlagen/statistik" element={<AnlageStatistik />} />
          )}
          {user && (
            <Route
              path="/anlagen/deaktivierte"
              element={<DeaktivierteAnlagen />}
            />
          )}
          {user && <Route path="/anlagen/neue" element={<NeueAnlage />} />}
          {/* Übersicht */}
          {user && (
            <Route path="/ubersicht/information" element={<Information />} />
          )}
          {user && (
            <Route path="/ubersicht/netzteile" element={<Netzteile />} />
          )}
          {user && (
            <Route
              path="/ubersicht/vertretungszugriffe"
              element={<Vertretungszugriffe />}
            />
          )}
          {/* the Rest */}
          {user && (
            <Route path="/servicebericht" element={<Servicebericht />} />
          )}
          {user && (
            <Route path="/boxen" element={<Boxen mandant={user.mandant} />} />
          )}
          {user && <Route path="/boxen/edit" element={<BoxenEdit />} />}
          {user && <Route path="/boxen/gebaude" element={<BuildingInfo />} />}
          {user && (
            <Route path="/boxen/gebaude/raume" element={<ConnectedDevices />} />
          )}
          {user && <Route path="/dateien" element={<Dateien />} />}

          {!user && (
            <>
              <Route path="/login" Component={Login} />
            </>
          )}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
