import {
 BrowserRouter,
 Routes,
 Route
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import SetupMFA from "./pages/MFA/SetupMFA";
import VerifyMFA from "./pages/MFA/VerifyMFA";
import Dashboard from "./pages/Dashboard/Dashboard";
import Admin from "./pages/Admin/Admin";
import Medicines from "./pages/Medicines/Medicines";
import Orders from "./pages/Orders/Orders";
import Contact from "./pages/Contact/Contact";

function App() {

 return (

  <BrowserRouter>

   <Routes>

    <Route path="/" element={<Home />}/>

    <Route path="/register" element={<Register />}/>

    <Route path="/login" element={<Login />}/>

    <Route path="/setup-mfa" element={<SetupMFA />}/>

    <Route path="/verify-mfa" element={<VerifyMFA />}/>

    <Route path="/dashboard" element={<Dashboard />}/>

    <Route path="/admin" element={<Admin />}/>

    <Route path="/medicines" element={<Medicines />} />

    <Route path="/orders" element={<Orders />} />

    <Route path="/contact" element={<Contact />} />

   </Routes>

  </BrowserRouter>
 );
}

export default App;