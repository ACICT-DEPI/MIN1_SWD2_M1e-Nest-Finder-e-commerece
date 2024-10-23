import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./SignupPage.css";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import api from "../../API/ApiLink.jsx";
import LoadingBtn from "../../Components/LoadingBtn.jsx";
import AlertMessage from "../../Components/Alert/Alert.jsx";
import AlertSignUp from "../../Components/Alert/AlertVerifySignup.jsx";
import usePageSEO from "../../hooks/usePageSEO.jsx";
import Header from "../../Components/Header/Header.jsx";

export default function SignupPage() {
  
// Set SEO settings
usePageSEO({
  title: "إنشاء حساب",
  keywords:["إنشاء حساب"],
});
  const [validated, setValidated] = useState(false);
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [alert, setAlert] = useState({ msg: "", variant: 0 });
  const [formData, setFormData] = useState({
    role:'user'
  });
  const isValidPhone = (phoneNumber) => {
    const egPhone = /^(010|011|012|015)\d{8}$/;
    return egPhone.test(phoneNumber);
  };

  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "phone") {
      if (!isValidPhone(value)) {
        e.target.setCustomValidity("يرجى إدخال رقم هاتف صحيح");
      } else {
        e.target.setCustomValidity("");
      }
    }
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      if (formData.password !== formData.password_confirmation) {
        setAlert({
          msg: "كلمات المرور الجديدة غير متطابقة",
          variant: 3
        })
        setShow(true);
      } else {
        try {
          setLoad(true);
          const response = await api.post("/users/register", {
            ...formData,
          });
          Cookies.set("token", response.data.data.token);
          Cookies.set("user_id", response.data.data.user_id);
          Cookies.set('email', response.data.data.email);
          Cookies.set('phone', response.data.data.phone);
          Cookies.set('role', response.data.data.role);
          Cookies.set('verify',null)
          Cookies.set("image", response.data.data.image);
          Cookies.set('first_name', response.data.data.first_name);
          Cookies.set('last_name', response.data.data.last_name);
          Cookies.set('phone', response.data.data.phone);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setOverlay(true);
        } catch (err) {
          try {
            const errdata = err.response.data
            console.log(errdata);
            setAlert({ msg: "الايميل او الرقم مستخدم بالفعل", variant: 3 });
            setShow(true)
          } catch (err) {
            setAlert({ msg: "حدث خطأ. تاكد من الاتصال بالانترنت", variant: 2 });
            setShow(true)
          }
        }
        setLoad(false)
      }
    }

    setValidated(true);
  };

  return (
    <>
      <Header />
      <Container className="signup-container mt-3" dir="rtl">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={7}>
            <h2 className="text-center mb-4" style={{ color: "#007bff" }}>
              إنشاء حساب
            </h2>
      
            <Form
              className="p-4 border rounded"
              noValidate
              validated={validated}
              onSubmit={handelSubmit}
            >
              <Row className="mb-2">
                <Form.Group as={Col} controlId="formFirstName">
                  <Form.Label>الاسم الشخصى</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    placeholder="الاسم الشخصى"
                    onChange={handelChange}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formLastName">
                  <Form.Label>اسم العائله</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    placeholder="اسم العائله"
                    onChange={handelChange}
                    required
                  />
                </Form.Group>
              </Row>
      
              <Form.Group controlId="formBasicEmail" className="mt-2">
                <Form.Label className="fs-5 mb-2">البريد الإلكتروني</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="ادخل البريد الإلكتروني"
                  onChange={handelChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  ادخل الايميل بشكل صحيح
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label className="mt-2">رقم التليفون</Form.Label>
                <Form.Control
                  type="number"
                  name="phone"
                  onChange={handelChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  ادخل رقم الهاتف بشكل صحيح "01xxxxxxxxx"
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mt-2">
                <Form.Label className="fs-5 mb-2">كلمة المرور</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="ادخل كلمة المرور"
                  onChange={handelChange}
                  required
                  minLength={8}
                />
                <Form.Control.Feedback type="invalid">
                  كلمه المرور لا تقل عن 8 احرف
                </Form.Control.Feedback>
              </Form.Group>
      
              <Form.Group controlId="passwordConfirmation" className="mt-2">
                <Form.Label className="fs-5 mb-2"> تأكيد كلمة المرور</Form.Label>
                <Form.Control
                  type="password"
                  name="password_confirmation"
                  placeholder=" ادخل كلمة المرور مرة أخرى "
                  onChange={handelChange}
                  required
                  minLength={8}
                />
                <Form.Control.Feedback type="invalid">
                  كلمه المرور لا تقل عن 8 احرف
                </Form.Control.Feedback>
              </Form.Group>
      
              <Button variant="primary" type="submit" disabled={load} className="w-100 mt-2">
                {load ? <LoadingBtn /> : "إنشاء حساب"}
              </Button>
      
            </Form>
            <div className="text-center mt-2">
              <Link to="/login">لديك حساب بالفعل؟ تسجيل الدخول هنا</Link>
            </div>
          </Col>
        </Row>
        {/*  */}
        {show && (
          <>
            <AlertMessage
              msg={alert.msg}
              setShow={setShow}
              variant={alert.variant}
            />
          </>
        )}
        {overlay && (
          <>
            <div style={{
              position: 'absolute',
              top: '5px',
              left: '0px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <AlertSignUp />
            </div>
          </>
        )}
        {/*  */}
      </Container>
    </>
  );
}
