import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import api from "../../API/ApiLink.jsx";
import Cookies from 'js-cookie';
import LoadingBtn from "../../Components/LoadingBtn.jsx";
import AlertMessage from "../../Components/Alert/Alert.jsx";
import { useNavigate } from 'react-router-dom';
import OverPage from "../../Components/OverPage/OverPage.jsx";
import usePageSEO from "../../hooks/usePageSEO.jsx";
import Header from './../../Components/Header/Header';
import Footer from "../../Components/Footer/Footer.jsx";



export default function LoginPage() {

// Set SEO settings
usePageSEO({
  title: "تسجيل الدخول",
  keywords:["تسجيل الدخول"],
});
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [alert, setAlert] = useState({ msg: "", variant: 0 })
  const [formData, setFormData] = useState({});
  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handelSubmit = async (e) => {
    setShow(false)
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    else {
      setLoad(true)
      try {
        const response = await api.post("/users/login", {
          email: formData.email,
          password: formData.password,
        });
        Cookies.set('token', response.data.data.token);
        Cookies.set("image", response.data.data.user.image);
        Cookies.set('role', response.data.data.user.role);
        Cookies.set('first_name', response.data.data.user.first_name);
        Cookies.set('email', response.data.data.user.email);
        Cookies.set('last_name', response.data.data.user.last_name);
        Cookies.set('bio', response.data.data.user.bio);
        Cookies.set("user_id", response.data.data.user.id);
        Cookies.set('user_type', response.data.data.user.user_type);
        Cookies.set('phone', response.data.data.user.phone);
        Cookies.set('whats_phone', response.data.data.user.whats_phone);
        setLoad(false)
        setOverlay(true)
        setShow(true)
        setAlert({ msg: "تم تسجيل الدخول بنجاح", variant: 1 })
        if(response.data.data.user.role=='admin'){
          navigate('/dashboard')
        }
        else{
          navigate('/')
        }
      
      } catch (error) {
        setLoad(false)
        setShow(true)
        console.log(error)
        if (error.code === 'ERR_NETWORK') {
          setAlert({ msg: "خطا فى الشبكه. تأكد من الاتصال بالانترنت و اعد المحاوله", variant: 2 })
        }
        else if (error.response.status === 401) {
          setAlert({ msg: "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.", variant: 3 })
        }
        else if (error.response.status === 404) {
          setAlert({ msg: "هذا البريد الإلكتروني غير مسجل لدينا: هل تريد", variant: 4 })
        }
      }
    }
    setValidated(true);
  };

//
  return (
    <>
      <Header/>
      <Container className="login-container mt-5" dir="rtl">
        
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <h2 className="text-center mb-4" style={{ color: "#007bff" }}>
              تسجيل الدخول
            </h2>
            <Form
              noValidate
              validated={validated}
              className="p-4 border rounded"
              onSubmit={handelSubmit}
            >
              <Form.Group controlId="formBasicEmail">
                <Form.Label className="fs-5 mb-3">البريد الإلكتروني</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ادخل البريد الإلكتروني"
                  name="email"
                  onChange={handelChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  من فضلك ادخل الايميل بشكل صحيح
                </Form.Control.Feedback>
              </Form.Group>
      
              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label className="fs-5 mb-3">كلمة المرور</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="ادخل كلمة المرور"
                  name="password"
                  onChange={handelChange}
                  required
                  minLength={8}
                />
                <Form.Control.Feedback type="invalid">
                  من فضلك ادخل كلمه المرور بشكل صحيح
                </Form.Control.Feedback>
              </Form.Group>
      
              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-3"
                disabled={load}
              >
                {load ? <LoadingBtn /> : "تسجيل الدخول"}
              </Button>
            </Form>
            <div className="text-center mt-3">
              <Link to="/signup">ليس لديك حساب؟ سجل هنا</Link>
            </div>
          </Col>
        </Row>
        {/*  */}
        {show && <>
          <AlertMessage msg={alert.msg} setShow={setShow} variant={alert.variant} />
        </>}
        {overlay && <><OverPage /></>}
        {/*  */}
      
      </Container>
    </>
  );
}