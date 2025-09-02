import styles from "./Home.module.css";
import SearchandFilter from '../components/SearchandFilter'
import ProductList from '../components/ProductList'
import BasicPagination from "../components/BasicPagination";
const Home = () => {
  return (
    <div className={styles['home-container']}>
      <SearchandFilter bidsPage={false}/>
      <ProductList/>
    </div>
  )
}

export default Home