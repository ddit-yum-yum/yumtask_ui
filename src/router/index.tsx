import { createBrowserRouter } from "react-router";
import { HomePage } from './HomePage'
import { zeeneeRoutes } from "@/members/zeenee/routes";
import { zennyRoutes } from "@/members/zenny/routes";

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/zeenee', children: zeeneeRoutes },
  { path: '/zenny', children: zennyRoutes },
])