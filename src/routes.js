import React from "react";
// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import AlertsLocation from "views/admin/alertsLocation";
// Auth Imports
import SignIn from "views/auth/SignIn";
// Icon Imports
import { MdHome, MdPerson, MdLock } from "react-icons/md";
import SignUp from "views/auth/SignUp";

const routes = [
  {
    name: "Inicio",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    showInMenu: true,
  },

  {
    name: "Perfil",
    layout: "/admin",
    path: "profile/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    showInMenu: false,
  },
  {
    name: "Perfil",
    layout: "/admin",
    path: "alerts",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AlertsLocation />,
    showInMenu: false,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
    showInMenu: false,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
    showInMenu: false,
  },
];
export default routes;
