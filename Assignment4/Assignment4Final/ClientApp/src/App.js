import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate, Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
// import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import { Layout } from "./components/Layout";
import "./custom.css";

import NotAuth from "./components/auth/NotAuth";

import { getClaims } from "./components/auth/handleJWT";
import { AuthenticationContext } from "./components/auth/AuthenticationContext";
import configureInterceptor from "./components/auth/axios";
import axios from "axios";

configureInterceptor();


function App() {
  //static displayName = App.name;
  const [claims, setClaims] = useState([]);
  
  useEffect(() => {
    setClaims(getClaims());
  }, []);
  
  function isRole(roles) {
    return roles.some((role) =>
      claims.find((claim) => claim.name === "role" && claim.value === role)
    );
  }

  return (
    <AuthenticationContext.Provider value={{ claims, update: setClaims }}>
      <Layout>
        <Routes>
          {AppRoutes.map((route, index) => {
            const {
              element,
              needsAdmin,
              needsQc,
              needsCand,
              needsMarker,
              ...rest
            } = route;

            return (
              <Route
                key={index}
                {...rest}
                element={
                  needsAdmin || needsQc || needsCand || needsMarker ? (
                    isRole([
                      "admin",
                      "qualitycontrol",
                      "candidate",
                      "marker",
                    ]) ? (
                      element
                    ) : (
                      <NotAuth />
                    )
                  ) : (
                    element
                  )
                }
              />
            );
          })}
        </Routes>
      </Layout>
    </AuthenticationContext.Provider>
  );
}
export default App;
