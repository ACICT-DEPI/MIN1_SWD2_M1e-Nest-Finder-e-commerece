import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Table,
  Modal,
  Row,
  Col,
  InputGroup,
  Alert,
} from "react-bootstrap";
import api from "../../../API/ApiLink.jsx";
import LoadingBtn from "../../../Components/LoadingBtn.jsx";
import Cookies from "js-cookie";
import OverPage from "../../../Components/OverPage/OverPage.jsx";
import AlertMessage from "../../../Components/Alert/Alert.jsx";
import DeleteItem from "../../../Components/DeleteItem/DeleteItem.jsx";

export default function Regions() {

  const role = Cookies.get("role")
  const token = Cookies.get("token");
  const [getForm, setGetForm] = useState({
    governorate: "",
    city: "",
  });
  const [load, setLoad] = useState(false);
  const [loadId, setLoadId] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ msg: "", variant: 0 });
  const [show, setShow] = useState(false);
  const [regionName, setRegionName] = useState(""); //اسم الحاجه اللى هضيفها
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [newRegionName, setNewRegionName] = useState("");
  const [regions, setRegions] = useState([]);
  const handleClose = () => setShow(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loadEdit, setLoadEdit] = useState(false);
  const handleShow = (id, name) => {
    setSelectedItemId(id, name);
    setNewRegionName(name);
    setShow(true);
  };
  const handleGetChange = (e) => {
    const { name, value } = e.target;
    if (name === "governorate") {
      setGetForm({ governorate: value, city: "" });
      setCities([]);
      setRegions([]);
    } else {
      setGetForm({
        ...getForm,
        [name]: value,
      });
    }
  };

  // استرجاع المحافظات
  useEffect(() => {
    const fetchGov = async () => {
      try {
        setOverlay(true);
        const response = await api.get("/governorates/authGov", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGovernorates(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setOverlay(false);
      }
    };
    fetchGov();
  }, []);

  //استرجاع المدن
  useEffect(() => {
    const fetchCity = async () => {
      try {
        setOverlay(true);
        const response = await api.get(
          `/cities/${getForm.governorate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCities(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setOverlay(false);
      }
    };
    if (getForm.governorate) {
      fetchCity();
    }
  }, [getForm.governorate]);

  // استرجاع المناطق
  const fetchRegion = async () => {
    try {
      setOverlay(true);
      const response = await api.get(
        `/regions/${getForm.city}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRegions(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setOverlay(false);
    }
  };
  useEffect(() => {
    if (getForm.city) {
      fetchRegion();
    }
  }, [getForm.governorate, getForm.city]);

  // تعديل المناطق
  const handleEdite = async () => {
    if (newRegionName) {
      try {
        setLoadEdit(true);
        await api.patch(
          `/regions/${selectedItemId}`,
          { name: newRegionName, city_id: getForm.city },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchRegion();
      } catch (err) {
        console.log(err);
      } finally {
        setLoadEdit(false);
        setShow(false);
      }
    }
  };

  // حذف منطقه
  const handleDelete = async (id) => {
    try {
      setLoadId(true);
      await api.delete(`/regions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRegion();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadId(false);
    }
  };

  // اضافه منطقه
  const handleAddRegions = async (e) => {
    e.preventDefault();
    setLoad(true);
    if (getForm.city) {
      try {
        await api.post(
          "/regions",
          { name: regionName, city_id: getForm.city },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchRegion();
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false);
      }
    } else {
      setAlert({ msg: "يجب تحديد مدينه لاضافه المنطقه داخلها", variant: 3 });
      setShowAlert(true);
      setLoad(false);
    }
  };
  function handleChangeRegionName(e) {
    setRegionName(e.target.value);
  }
  function handleNewRegionName(e) {
    setNewRegionName(e.target.value);
  }
  return (
    <>
      <Form.Group controlId="governorate" className="mb-3">
        <Form.Label className="required">المحافظة</Form.Label>
        <Form.Select
          name="governorate"
          value={getForm.governorate}
          onChange={handleGetChange}
          required
        >
          <option key={0} value="">
            اختر المحافظة
          </option>
          {governorates.map((gov) => (
            <option key={gov.id} value={gov.id}>
              {gov.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="city" className="mb-3">
        <Form.Label className="required">المدينة</Form.Label>
        <Form.Select
          name="city"
          value={getForm.city}
          onChange={handleGetChange}
          required
        >
          <option key={0} value="">
            اختر المدينة
          </option>
          {cities.map((city) => (
            <option key={city.name} value={city.id}>
              {city.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form onSubmit={handleAddRegions}>
        <Row className="align-items-center">
          <Col xs="8">
            <InputGroup className="mb-2" dir="ltr">
              <Form.Control
                id="inlineFormInputGroup"
                className="text-end"
                name="regionName"
                onChange={handleChangeRegionName}
                required
                placeholder="اكتب اسم المنطقة"
              />
            </InputGroup>
          </Col>
          <Col xs="4">
            <Button type="submit" className="mb-2">
              {load ? <LoadingBtn /> : "اضف منطقة"}
            </Button>
          </Col>
        </Row>
      </Form>
      {showAlert && (
        <>
          <AlertMessage
            msg={alert.msg}
            setShow={setShowAlert}
            variant={alert.variant}
          />
        </>
      )}

      {overlay ? (
        <OverPage />
      ) : (
        <>
          {regions.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>اسم المنطقة</th>
                  <th colSpan={2} className="text-center">
                    أجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {regions.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => {
                          handleShow(item._id, item.name);
                        }}
                      >
                        تعديل
                      </Button>
                      <Modal show={show} onHide={handleClose}>
                        <Modal.Header>
                          <Modal.Title>تعديل اسم المنطقة</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form.Control
                            type="text"
                            name="newRegionName"
                            value={newRegionName}
                            onChange={handleNewRegionName}
                          />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            الغاء
                          </Button>
                          <Button
                            variant="success"
                            onClick={handleEdite}
                            disabled={loadEdit}
                          >
                            {loadEdit ? <LoadingBtn /> : " حفظ التعديل"}
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </td>
                  {role==='admin'&& <DeleteItem
                      id={selectedItemId}
                      setId={setSelectedItemId}
                      itemId={item._id}
                      DeleteFun={handleDelete}
                      load={loadId}
                    />}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert key="warning" variant="warning">
              لا يوجد مناطق
            </Alert>
          )}
        </>
      )}
    </>
  );
}
