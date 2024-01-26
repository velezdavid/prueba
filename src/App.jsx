import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import { obtenerUsuario } from "services/auth.service";
import { LanguageProvider } from "hooks/useLanguage";

const App = () => {
  const usuario = obtenerUsuario();

  return (
    <LanguageProvider>
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route
        path="/"
        element={<Navigate to={usuario ? "/admin" : "/auth"} replace />}
      />
      <Route
        path="/*"
        element={<Navigate to={usuario ? "/admin" : "/auth"} replace />}
      />
    </Routes>
    </LanguageProvider>

  );
};

export default App;
