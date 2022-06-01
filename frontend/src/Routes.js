import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro"
import Home from './pages/Home'
import Result from './pages/Result'
import Ubs from './pages/Ubs'
import Avaliacao from "./pages/Avaliacao";

const AppRoutes = () => {
   return(
       <Router>
         <Routes>
            <Route element={<Login />}  path="/" />
            <Route element={<Cadastro />} path="/cadastro" />
            <Route element={<Home />} path="/home" />
            <Route element={<Result />} path="/results" />
            <Route element={<Ubs />} path="/ubs" />
            <Route element={<Avaliacao />} path="/avaliacao" />
         </Routes>
       </Router>
   )
}

export default AppRoutes;