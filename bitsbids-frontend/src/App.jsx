import 'bootstrap/dist/css/bootstrap.css';
import styles from './App.module.css'
import Navbar from './components/Navbar';
import {Outlet} from "react-router-dom";
import Footer from './components/Footer';
import FetchingItems from "./components/FetchingItems";
import FetchingBids from "./components/FetchingBids"
function App(){
  return <div className={styles['app']}>
    <Navbar/>
  <FetchingItems/>
  <FetchingBids/>
    <Outlet/>
    <Footer/>

    
  </div>

}

export default App;