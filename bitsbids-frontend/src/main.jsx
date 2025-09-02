import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Winnings from "./pages/Winnings"
import Bids from "./pages/Bids"
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux"
import bitsbidsStore from "./store/index.js";
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ToastContainer } from 'react-toastify';
import Profile from './pages/Profile.jsx';
import Users from './pages/Users.jsx';
import AddItem from './pages/AddItem.jsx';
createRoot(document.getElementById('root')).render(
<Provider store={bitsbidsStore}>
<BrowserRouter>
<ToastContainer/>
    <Routes>
      <Route element={<ProtectedRoute/>}>
      <Route path='/' element={<App/>}>
      <Route path="" element={<Home/>}/>
      <Route path="winning" element={<Winnings/>}/>
      <Route path="bids" element={<Bids/>}/>
      <Route path="profile" element={<Profile/>}/>
      </Route>
      </Route>
      <Route path="/users" element={<Users/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Login/>}/>
      <Route path="/addItem" element={<AddItem/>}/>
      
    </Routes>
</BrowserRouter>
    </Provider>

)
