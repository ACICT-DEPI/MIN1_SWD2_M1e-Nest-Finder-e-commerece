import React from "react";
import "./HomePage.css";
import Header from "../../Components/Header/Header.jsx";
import SearchForm from "../../Components/SearchForm/SearchForm.jsx";
import Swapper from "../../Components/Swapper/Swapper.jsx";
import Footer from "../../Components/Footer/Footer.jsx";
import mobilebgimage from "../../images/mobile-homeland.jpg";

// *****************
import Company from "../../Components/Company/Company.jsx";
import AddPropertyCard from "../../Components/Cards/AddProperty/AddPropertyCard.jsx";
import AddQuickCard from "../../Components/Cards/AddProperty/AddQuickCard.jsx";
import AllGovernorates from "../../Components/AllGovernorates/AllGovernorates.jsx";
import usePageSEO from "../../hooks/usePageSEO.jsx";

export default function HomePage() {

// Set SEO settings
usePageSEO({
  title: "Nest Finder",
});
  return (
    <>
      <Header />
      <SearchForm backgroundImage={mobilebgimage} />
      <Swapper />
      <AddPropertyCard />
      <Company />
      <AddQuickCard />
      <AllGovernorates />
      <Footer />
    </>
  );
}
