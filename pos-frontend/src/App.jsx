/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Dashboard } from "./pages";
import Header from "./components/shared/Header";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

// License Checker
import { useEffect, useState } from "react";
import { checkLicense } from "./utils/licenseCheck";

function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const hideHeaderRoutes = ["/auth"];
  const { isAuth } = useSelector((state) => state.user);
  const userData = useSelector((state) => state.user);
  let isAdmin = false;
  let isChef = false;

  if (userData.role === "Admin") {
    isAdmin = true;
  } else if (userData.role === "Chef") {
    isChef = true;
  }

  if (isLoading) return <FullScreenLoader />;

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <Orders />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoutes>
              <Tables />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoutes>
              <Menu />
            </ProtectedRoutes>
          }
        />
        <Route path="/menu/:id" element={<Menu />} />
        <Route
          path="/dashboard"
          element={
            isAdmin || isChef ? (
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  const userData = useSelector((state) => state.user);

  let isChef = false;

  if (userData.role === "Chef") {
    isChef = true;
  }

  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  // If the user is a Chef and tries to access any route except /dashboard
  if (isChef && window.location.pathname !== "/dashboard") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function App() {
  const [licenseStatus, setLicenseStatus] = useState({
    loading: true,
    valid: false,
    message: "",
    client: "",
  });

  // useEffect(() => {
  //   async function validate() {
  //     const result = await checkLicense();
  //     setLicenseStatus({ loading: false, ...result });
  //   }
  //   validate();
  // }, []);

  // // 🔄 Loading screen
  // if (licenseStatus.loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-gray-50">
  //       <motion.h2
  //         initial={{ opacity: 0 }}
  //         animate={{ opacity: [0, 1, 0] }}
  //         transition={{ repeat: Infinity, duration: 2 }}
  //         className="text-xl font-semibold text-gray-600"
  //       >
  //         🔄 Checking license...
  //       </motion.h2>
  //     </div>
  //   );
  // }

  // // ❌ Invalid license screen
  // if (!licenseStatus.valid) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-accent to-primary">
  //       <motion.div
  //         initial={{ scale: 0, rotate: -10, opacity: 0 }}
  //         animate={{ scale: 1, rotate: 0, opacity: 1 }}
  //         transition={{ type: "spring", stiffness: 120, damping: 12 }}
  //         className="max-w-md p-10 text-center bg-white shadow-2xl rounded-2xl"
  //       >
  //         <motion.div
  //           initial={{ y: -40, opacity: 0 }}
  //           animate={{ y: 0, opacity: 1 }}
  //           transition={{ delay: 0.1 }}
  //           className="flex justify-center mb-6"
  //         >
  //           <FaExclamationTriangle className="text-6xl text-red-600" />
  //         </motion.div>

  //         <motion.h1
  //           initial={{ y: -20, opacity: 0 }}
  //           animate={{ y: 0, opacity: 1 }}
  //           transition={{ delay: 0.2 }}
  //           className="mb-4 text-3xl font-bold text-red-600"
  //         >
  //           License Invalid/Expired
  //         </motion.h1>

  //         <motion.p
  //           initial={{ y: 20, opacity: 0 }}
  //           animate={{ y: 0, opacity: 1 }}
  //           transition={{ delay: 0.4 }}
  //           className="mb-2 text-lg text-gray-700"
  //         >
  //           {licenseStatus.message}
  //         </motion.p>

  //         <motion.p
  //           initial={{ y: 20, opacity: 0 }}
  //           animate={{ y: 0, opacity: 1 }}
  //           transition={{ delay: 0.6 }}
  //           className="text-gray-500"
  //         >
  //           Please contact the developer to resolve this issue.{" "}
  //           <a
  //             title="JGDEV SOCIAL LINK"
  //             target="_blank"
  //             className="text-sm text-primary"
  //             href="https://www.facebook.com/jgdev101"
  //           >
  //             Click this
  //           </a>
  //         </motion.p>
  //       </motion.div>
  //     </div>
  //   );
  // }

  // ✅ Valid license → show app
  return (
    <Router>
      <Layout clientName={licenseStatus.client} />
    </Router>
  );
}

export default App;
