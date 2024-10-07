import React, { useState,useEffect } from "react";
import Header from "../../Components/Header/Header.jsx";
import Footer from "../../Components/Footer/Footer.jsx";
import { Container } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Cookies from 'js-cookie';
import api from "../../API/ApiLink.jsx";
import CardDetails from "../../Components/CardDetails/CardDetails.jsx";
import { useParams } from "react-router-dom";
import CommentCardAds from "../../Components/Comments/CommentCardAds.jsx";
import AddCommentAds from "../../Components/Comments/AddCommentAds.jsx";

import Share from "../../Components/Cards/Share.jsx";
import OverPage from "../../Components/OverPage/OverPage.jsx";
import NotFoundPage from '../NotFoundPage/NotFoundPage.jsx';
import QuickCardDetails from "../../Components/CardDetails/QuickCardDetails.jsx";

const MoreDeteliesPage = () => {
  const {id}=useParams()
  const [over,setOver]=useState(true)
const[data,setData]=useState("")
  useEffect(()=>{
    const getOneAds = async (e) => {
        try {
          const token=Cookies.get("token")
          const response = await api.get(`/getAd/${id}`, null, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          const adsData=response.data.data
          setData(adsData)
        }catch(err){
          if(err.response.data.status===404){
            setData("NotFound")
          }
          
        }
        finally{
          setOver(false)
        }
      }
      getOneAds()
  },[])
  return (
    <>
      {data === "NotFound" ? (
        <NotFoundPage />
      ) : data === "" ? (
        <></>
      ) : (
        <>
          <Header />
          {data.ad_type?<QuickCardDetails propertyDetails={data} />:<CardDetails propertyDetails={data} />}
          <hr />
          <Container>
            <CommentCardAds ads_id={id} />
            <hr />
            <AddCommentAds ads_id={id} />
          </Container>
          <Footer />
          {data && (
            <Share
              text={data.property["Arabic Name"]}
              url={`http://varnda.com/property/${encodeURIComponent(id)}`}
            />
          )}
          {over && <OverPage />}
        </>
      )}
    </>
  );
};

export default MoreDeteliesPage;


