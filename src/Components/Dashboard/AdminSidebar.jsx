import "./Sidebar.css";
import { useState, useEffect } from "react";
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from "../../API/ApiLink";
import AlertSideBar from "../Alert/AlertSideBar";
export default function SideBar() {
  const token = Cookies.get("token")

  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState({ msg: "", variant: 0 });
//التاكد من صحه التوكين
useEffect(() => {
  const fetchToken = async () => {
    try {
      const response = await api.get("/users/getAuthStatus", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.data.auth===false){
        setAlert({
          msg: "انتهت جلستك.يرجى تسجيل الدخول مره اخرى",
          variant: 3,
        });
        setShow(true)
        Object.keys(Cookies.get()).forEach(function (cookieName) {
          Cookies.remove(cookieName);
        });
      }
    } catch (error) {
      console.log(error);
    } 
  };
    fetchToken();
}, [token]);

  const role = Cookies.get("role")
  const navigate = useNavigate()
  const Logout = async () => {
      Object.keys(Cookies.get()).forEach(function (cookieName) {
        Cookies.remove(cookieName);
      });
      navigate("/")
  }
  return (
    <>
      <nav className="sidebar">
        <div>
          <div className="nav-li w-100 d-flex ">
            <Link to="/" className="w-100 button-link">
              <Button variant="primary" className="w-100">
                الصفحة الرئيسية
              </Button>
            </Link>

            {(role === "admin" || role === "seo") && (
              <Link to="/dashboard/general-pages" className="w-100 button-link">
                <Button variant="primary" className="w-100">
                  الصفحات العامة
                </Button>
              </Link>
            )}

            {role === "admin" && (
              <Link to="/dashboard/all-ads" className="w-100 button-link">
                <Button variant="primary" className="w-100">
                  جميع الاعلانات
                </Button>
              </Link>
            )}

            <Link to="/dashboard/category" className="w-100 button-link">
              <Button variant="primary" className="w-100">
                تصنيف المدونات
              </Button>
            </Link>

            <DropdownButton
              id="dropdown-basic-button"
              align="end"
              title="المدونات"
              className="w-100 sideDropdown"
            >
              <Dropdown.Item href="/dashboard/Blogs">
                عرض المدونات
              </Dropdown.Item>
              <Dropdown.Item href="/dashboard/Drafts">
                عرض المسودات
              </Dropdown.Item>
              <Dropdown.Item href="/dashboard/Blogs-category">
                المدونات حسب التصنيف
              </Dropdown.Item>
              <Dropdown.Item href="/dashboard/add-Blog">
                اضافه مدونة
              </Dropdown.Item>
            </DropdownButton>

            {/* المناطق */}
            {(role === "admin" || role === "seo") && (
              <DropdownButton
                id="dropdown-basic-button"
                align="end"
                title="المناطق"
                className="w-100 sideDropdown"
              >
                <Dropdown.Item href="/dashboard/governments">
                  المحافظات
                </Dropdown.Item>
                <Dropdown.Item href="/dashboard/cities">المدن</Dropdown.Item>
                <Dropdown.Item href="/dashboard/regions">المناطق</Dropdown.Item>
                <Dropdown.Item href="/dashboard/streets">الشوارع</Dropdown.Item>
                <Dropdown.Item href="/dashboard/compounds">
                  الكومباوندات
                </Dropdown.Item>
                <Dropdown.Item href="/dashboard/molls">المولات</Dropdown.Item>
              </DropdownButton>
            )}

            {/* التعليقات */}
            {role === "admin" && (
              <DropdownButton
                id="dropdown-basic-button"
                align="end"
                title="التعليقات"
                className="w-100 sideDropdown"
              >
                <Dropdown.Item href="/dashboard/ads-comments">
                  تعليقات الاعلانات
                </Dropdown.Item>
                <Dropdown.Item href="/dashboard/posts-comments">
                  تعليقات المدونات
                </Dropdown.Item>
              </DropdownButton>
            )}

            <Button variant="danger" className="w-100" onClick={Logout}>
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </nav>

      {show && (
        <>
          <AlertSideBar
            msg={alert.msg}
            setShow={setShow}
            variant={alert.variant}
          />
        </>
      )}
    </>
  );
}
