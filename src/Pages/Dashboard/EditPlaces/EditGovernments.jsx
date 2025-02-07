import { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import api from "../../../API/ApiLink.jsx";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom"; //
import LoadingBtn from "../../../Components/LoadingBtn.jsx";
import AlertMessage from "../../../Components/Alert/Alert.jsx";

export default function EditGovernments() {
  const navigate = useNavigate();
  const location = useLocation(); //
  const Gov = location.state?.data; //
  const token = Cookies.get("token");
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState({ msg: "", variant: 0 });

  //
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    english_name: "",
    meta_title: "",
    h1_title: "",
    meta_description: "",
    image: "",
    url: "",
  });

  // وضع القيم فى الخانات
  useEffect(() => {
    const fetchFilter = async () => {
      setEditData({
        id: Gov.id,
        name: Gov.name,
        english_name: Gov.english_name,
        meta_title: Gov.meta_title,
        h1_title: Gov.h1_title,
        meta_description: Gov.meta_description,
        image: Gov.image,
        url: Gov.url,
      });
    };
    if (Gov) fetchFilter();
  }, [Gov]);

  function handelEditeChange(e) {
    const { name, value, type, files } = e.target;
    if (type === "file" && name === "image") {
      setNewImage(files[0]);
      setEditData({
        ...editData,
        [name]: files,
      });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  }

  // تعديل المحافظه
  const handleEdite = async (e) => {
    e.preventDefault();
    setLoad(true);
    const allFormData = new FormData();
    // Append form fields
    for (const [key, value] of Object.entries(editData)) {
      if (key !== "image" && value) {
        allFormData.append(key, value);
      }
    }
    if (newImage) {
      allFormData.append("image", editData.image[0]);
    }
    try {
      await api.patch(
        `/governorates/${editData.id}`,
        allFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      setAlert({ msg: "تم تعديل المحافظة بنجاح", variant: 1 });
      setTimeout(() => {
        navigate("/dashboard/governments");
      }, 2000);
    } catch (err) {
      if (err.response.data.status == 422) {
        setAlert({ msg: "هناك رابط اخر مشابهه لهذا", variant: 3 });
        // setShowAlert(true);
      }
    } finally {
      setShow(true);
      setLoad(false);
    }
  };
  const [newImage, setNewImage] = useState(null);

  return (
    <>
      <h2 className="text-center title-page py-1 pb-2 container my-3">
        تعديل المحافظة
      </h2>
      <Form className="mt-3" onSubmit={handleEdite}>
        <Row className="mb-2">
          <Form.Group as={Col} xs="12" md="6" controlId="formArName">
            <Form.Label>اسم المحافظة</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={editData.name}
              placeholder="اسم المحافظة بالعربى"
              onChange={handelEditeChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} xs="12" md="6" controlId="formAEnName">
            <Form.Label>اسم المحافظة انجليزى</Form.Label>
            <Form.Control
              type="text"
              name="english_name"
              value={editData.english_name}
              placeholder="اسم المحافظة بالانجليزى"
              onChange={handelEditeChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-2">
          <Form.Group as={Col} xs="12" md="6" controlId="formTitle">
            <Form.Label>العنوان الرئيسي</Form.Label>
            <Form.Control
              type="text"
              name="h1_title"
              value={editData.h1_title}
              onChange={handelEditeChange}
            />
          </Form.Group>
          <Form.Group as={Col} xs="12" md="6" controlId="formMetaTitle">
            <Form.Label>عنوان الصفحه فى الميتا</Form.Label>
            <Form.Control
              type="text"
              name="meta_title"
              value={editData.meta_title}
              onChange={handelEditeChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-2">
          <Form.Group as={Col} xs="12" md="6" controlId="formTitle">
            <Form.Label>رابط المحافظه</Form.Label>
            <Form.Control
              type="text"
              name="url"
              value={editData.url}
              placeholder="يجب ان يكون فريد من نوعه"
              onChange={handelEditeChange}
            />
          </Form.Group>

          <Form.Group as={Col} xs="12" md="6" controlId="formMetaTitle">
            <Form.Label>ميتا دسكريبشن</Form.Label>
            <Form.Control
              as="textarea"
              name="meta_description"
              value={editData.meta_description}
              onChange={handelEditeChange}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group controlId="image" className="mb-3">
            <Form.Label>الصورة الأساسية للصفحة</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handelEditeChange}
            />

            <div className="mt-2">
              <h5>الصورة الأساسية</h5>
              {newImage ? (
                <img
                  src={URL.createObjectURL(newImage)}
                  alt="MainImage"
                  style={{
                    maxWidth: "300px",
                    height: "auto",
                    margin: "0 10px 10px 0",
                    borderRadius: "5px",
                  }}
                />
              ) : editData.image ? (
                <img
                  src={editData.image}
                  alt="MainImage"
                  style={{
                    maxWidth: "300px",
                    height: "auto",
                    margin: "0 10px 10px 0",
                    borderRadius: "5px",
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </Form.Group>
        </Row>
        <div className="text-center d-flex justify-content-center my-4">
          <Button variant="primary" type="submit" disabled={load}>
            {load ? <LoadingBtn /> : "حفظ التعديل"}
          </Button>
        </div>
      </Form>
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
