import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/joy";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  faBed,
  faBath,
  faEnvelope,
  faHome,
  faRulerCombined,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Row, Col, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Phone from "./Phone";
import api from "../../API/ApiLink.jsx";
import Cookies from "js-cookie";

import { faPhone } from "@fortawesome/free-solid-svg-icons";
import AlertMessage from "../Alert/Alert.jsx";

export default function PropertyCard({ properties = [], loading }) {
  console.log(properties)
  const token = Cookies.get("token");
  const role = Cookies.get("role");
  // const role = localStorage.getItem("role")
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState({ msg: "", variant: 0 });
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // حركة تلقائية
    autoplaySpeed: 3500, // الوقت بين كل حركة تلقائية (بالملي ثانية)
    arrows: false, // تفعيل الأسهم الجانبية
  };
  const [favorites, setFavorites] = useState([]);
  const [loadId, setLoadId] = useState(null);

  useEffect(() => {
    if (properties.length) {
      setFavorites(properties.map((p) => p.is_favorite));
    }
  }, [properties]);

  const handleLove = async (ad_id, index) => {
    setLoadId(ad_id);
    try {
      //OLD
      await api.post(
        "/flip-favorite",
        { ad_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newFavorites = [...favorites];
      newFavorites[index] = !newFavorites[index];
      setFavorites(newFavorites);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setAlert({
          msg: "انتهت جلستك.يرجى تسجيل الدخول مره اخرى",
          variant: 3,
        });
        setShow(true);
        Object.keys(Cookies.get()).forEach(function (cookieName) {
          Cookies.remove(cookieName);
        });
      }
    } finally {
      setLoadId(null);
    }
  };
  if (properties.length === 0) {
    return (
      <>
        {loading ? (
          // Skeleton عند تحميل البيانات
          Array(3)
            .fill(0)
            .map((_, index) => (
              <Card className="d-flex flex-row mb-3 small" key={index}>
                <div style={{ width: "50%", height: "auto" }}>
                  <Skeleton height={300} />
                </div>
                <div style={{ width: "50%", height: "auto", padding: "15px" }}>
                  <Skeleton count={5} />
                </div>
              </Card>
            ))
        ) : (
          <Alert key="warning" className="text-center" variant="warning">
            لا يوجد اعلانات
          </Alert>
        )}
      </>
    );
  }

  //اعرض جزء من الوصف
  const renderLimitedText = (text, charLimit) => {
    if (text.length > charLimit) {
      return `${text.substring(0, charLimit)}....`;
    }
    return text;
  };

  return (
    <>
      {loading ? (
        // Skeleton عند تحميل البيانات
        Array(3)
          .fill(0)
          .map((_, index) => (
            <Card className="d-flex flex-row mb-3 small" key={index}>
              <div style={{ width: "50%", height: "auto" }}>
                <Skeleton height={300} />
              </div>
              <div style={{ width: "50%", height: "auto", padding: "15px" }}>
                <Skeleton count={5} />
              </div>
            </Card>
          ))
      ) : (
        <>
          {properties.map((property, index) =>
            // Normal Ads
            property.ad_type === 0 ? (
              <Card
                className="d-flex flex-row mb-3 small position-relative"
                key={index}
              >
                <div
                  className="imgCont"
                  style={{ width: "50%", height: "auto" }}
                >
                  <Link to={`/property/${property.slug}`} className="link">
                    {property.property_id.images.length > 0 ? (
                      <Slider {...settings}>
                        <div key="primary-image">
                          <img
                            src={property.property_id.primary_picture}
                            alt="صوره الاعلان الرئيسيه"
                            style={{ width: "100%", height: "300px" }}
                          />
                        </div>
                        {property.property_id.images.map((image, idx) => (
                          <div key={`image-${idx}`}>
                            <img
                              src={image}
                              alt={`imgCard-${idx}`}
                              style={{ width: "100%", height: "300px" }}
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div>
                        <img
                          src={property.property_id.primary_picture}
                          alt={`صوره الاعلان الرئيسيه`}
                          key={index}
                          style={{ width: "100%", height: "300px" }}
                        />
                      </div>
                    )}
                  </Link>
                  {/* <h6 style={{ color: "#0d6efd" }} className="my-1">
                    الصور المتاحة لهذا العقار
                  </h6> */}
                  <div className="SocialContactCont">
                    <a href={`tel:+2${property.phone}`}>
                      <Button variant="primary" className="m-1 btn-lg">
                        <FontAwesomeIcon icon={faPhone} /> اتصل
                      </Button>
                    </a>
                    <Button
                      variant="secondary"
                      className="m-1 btn-lg"
                      onClick={() => {
                        const mailtoLink = `mailto:${
                          property.email
                        }?subject=${encodeURIComponent(
                          "عقار على Nest Finder"
                        )}&body=${encodeURIComponent(
                          `الرقم التعريفى للاعلان: ${property.id}`
                        )}`;
                        window.location.href = mailtoLink;
                      }}
                    >
                      <FontAwesomeIcon icon={faEnvelope} /> الإيميل
                    </Button>
                    <a
                      href={`https://api.whatsapp.com/send?phone=2${
                        property.whats_phone
                      }&text=${encodeURIComponent(
                        "مرحباً، أنا مهتم بعقارك الموجود على Nest Finder.: "
                      )}${encodeURIComponent(
                        `https://depi-final-project.vercel.app//property/${encodeURIComponent(
                          property.slug
                        )}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="success" className="m-1 btn-lg">
                        <FontAwesomeIcon icon={faWhatsapp} /> واتساب
                      </Button>
                    </a>
                  </div>
                </div>
                <div
                  className="imgCont"
                  style={{ width: "50%", height: "auto" }}
                >
                  <Link
                    to={`/property/${property.slug}`}
                    className="link"
                    key={index}
                  >
                    <Card.Body
                      style={{
                        textAlign: "right",
                        height: "100%",
                      }}
                    >
                      <Card.Title
                        style={{
                          color: "#123",
                          fontWeight: "700",
                          fontSize: "28px",
                        }}
                      >
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "28px",
                            marginLeft: "5px",
                          }}
                        >
                          {Number(property.property_id.price).toLocaleString(
                            "ar-EG"
                          )}
                        </span>
                        <span
                          style={{
                            color: "#123",
                            fontSize: "18px",
                          }}
                        >
                          ج.م
                        </span>
                      </Card.Title>
                      <Card.Text style={{ padding: "0px" }}>
                        <Row className="mb-2">
                          <Col
                            xs={4}
                            style={{
                              color: "rgb(13, 110, 253)",
                              display: "flex",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faHome}
                              style={{ marginLeft: "5px" }}
                            />
                            <span
                              style={{
                                color: "black",
                              }}
                            >
                              {property.property_id.sub_category}
                            </span>
                          </Col>
                          <Col
                            xs={4}
                            style={{
                              color: "rgb(13, 110, 253)",
                              display: "flex",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faBed}
                              style={{ marginLeft: "5px" }}
                            />
                            <span
                              style={{
                                color: "black",
                              }}
                            >
                              {property.property_id.rooms == 10
                                ? "+10"
                                : property.property_id.rooms}
                            </span>
                          </Col>
                          <Col
                            xs={4}
                            style={{
                              color: "rgb(13, 110, 253)",
                              display: "flex",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faBath}
                              style={{ marginLeft: "5px" }}
                            />
                            <span
                              style={{
                                color: "black",
                              }}
                            >
                              {property.property_id.bathrooms == 6
                                ? "+6"
                                : property.property_id.bathrooms}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col style={{ color: "#868686" }}>
                            <span
                              style={{
                                color: "rgb(13, 110, 253)",
                                fontSize: "18px",
                                marginLeft: "7px",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faRulerCombined}
                                style={{ marginLeft: "5px" }}
                              />
                              المساحة:
                            </span>
                            <span
                              style={{
                                color: "black",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              {property.property_id.area}
                            </span>
                            متر مربع
                          </Col>
                        </Row>
                        <Row>
                          <Col style={{ color: "black" }} className="my-1">
                            <h2>{property.property_id.name_ad_ar}</h2>
                          </Col>
                        </Row>
                        <Row>
                          <p style={{ color: "#898989" }}>
                            {property.property_id.details_ar &&
                              renderLimitedText(
                                property.property_id.details_ar,
                                150
                              )}
                          </p>
                        </Row>
                        <Row>
                          <Col>
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              style={{ marginLeft: "5px" }}
                            />
                            <span
                              style={{
                                color: "black",
                              }}
                            >
                              {property.property_id.full_address}
                            </span>
                          </Col>
                        </Row>
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </div>
                {/* Love button */}
                {role === "user" && (
                  <IconButton
                    loading={loadId === property.id}
                    onClick={() => handleLove(property.id, index)}
                    color="danger"
                    size="lg"
                    sx={{
                      mr: "auto",
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                    }}
                  >
                    {favorites[index] ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                )}
              </Card>
            ) : (
              // Quick Ads
              <Card
                className="d-flex flex-row mb-3 small position-relative"
                key={index}
              >
                <div
                  className="imgCont"
                  style={{ width: "50%", height: "auto" }}
                >
                  <Link
                    to={`/property/${property.slug}`}
                    className="link"
                    key={index}
                  >
                    {property.property_id.images.length > 1 ? (
                      <Slider {...settings}>
                        {property.property_id.images.map((image, idx) => (
                          <div key={idx}>
                            <img
                              src={image}
                              alt={`imgCard-${idx}`}
                              key={idx}
                              style={{ width: "100%", height: "300px" }}
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div>
                        <img
                          src={property.property_id.images[0]}
                          alt={`صوره الاعلان`}
                          key={index}
                          style={{ width: "100%", height: "300px" }}
                        />
                      </div>
                    )}
                  </Link>
                  {/* <h6 style={{ color: "#0d6efd" }} className="my-1">
                    الصور المتاحة لهذا العقار
                  </h6> */}
                  <div className="SocialContactCont">
                    <a href={`tel:+2${property.phone}`}>
                      <Button variant="primary" className="m-1 btn-lg">
                        <FontAwesomeIcon icon={faPhone} /> اتصل
                      </Button>
                    </a>
                    <Button
                      variant="secondary"
                      className="m-1 btn-lg"
                      onClick={() => {
                        const mailtoLink = `mailto:${
                          property.email
                        }?subject=${encodeURIComponent(
                          "عقار على Nest Finder"
                        )}&body=${encodeURIComponent(
                          `الرقم التعريفى للاعلان: ${property.id}`
                        )}`;
                        window.location.href = mailtoLink;
                      }}
                    >
                      <FontAwesomeIcon icon={faEnvelope} /> الإيميل
                    </Button>
                    <a
                      href={`https://api.whatsapp.com/send?phone=2${
                        property.whats_phone
                      }&text=${encodeURIComponent(
                        "مرحباً، أنا مهتم بعقارك الموجود على Nest Finder.: "
                      )}${encodeURIComponent(
                        `https://depi-final-project.vercel.app//property/${encodeURIComponent(
                          property.slug
                        )}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="success" className="m-1 btn-lg">
                        <FontAwesomeIcon icon={faWhatsapp} /> واتساب
                      </Button>
                    </a>
                  </div>
                </div>
                <div
                  className="imgCont"
                  style={{ width: "50%", height: "auto" }}
                >
                  <Link
                    to={`/property/${property.slug}`}
                    className="link"
                    key={index}
                  >
                    <Card.Body
                      style={{
                        textAlign: "right",
                        height: "100%",
                      }}
                    >
                      <Card.Text style={{ padding: "0px" }}>
                        <Row>
                          <p style={{ color: "#898989" }}>
                            {property.property_id.details_ar &&
                              renderLimitedText(
                                property.property_id.details_ar,
                                500
                              )}
                          </p>
                        </Row>
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </div>
                {/* Love button */}
                {role === "user" && (
                  <IconButton
                    loading={loadId === property.id}
                    onClick={() => handleLove(property.id, index)}
                    color="danger"
                    size="lg"
                    sx={{
                      mr: "auto",
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                    }}
                  >
                    {favorites[index] ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                )}
              </Card>
            )
          )}
        </>
      )}
      {show && (
        <>
          <AlertMessage
            msg={alert.msg}
            setShow={setShow}
            variant={alert.variant}
          />
        </>
      )}
    </>
  );
}
