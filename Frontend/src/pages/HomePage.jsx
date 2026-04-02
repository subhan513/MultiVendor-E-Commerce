import React from 'react'
import Header from "../components/Layout/Header.jsx"
import Hero from "../components/Route/Hero/Hero.jsx"
import Categories from "../components/Route/Categores/Categories.jsx"
import BestDeals from "../components/Route/BestDeals/BestDeals.jsx"
import FeaturesProduct from "../components/FeaturesProduct/FeaturesProduct.jsx"
import Events from "../components/Events/Events.jsx"
import Sponsord from "../components/Route/Sponsord/Sponsord.jsx"
import Footer from "../components/Layout/Footer.jsx"
const HomePage = () => {
  return (
    <>
    <div>
    <Header activeHeading={1}/>
    <Hero/>
    <div className='my-5'>
    <Categories/>
    </div>
    <BestDeals/>
    </div>
    <Events/>
    <FeaturesProduct/>
    <Sponsord/>
    <Footer/>
  </>
  )
}

export default HomePage;