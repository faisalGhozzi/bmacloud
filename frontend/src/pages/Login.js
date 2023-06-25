import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import BmacloudLogo from "../assets/images/bmacloud-logo.png";
import SsystemsLogo from "../assets/images/7systems-logo.png";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../style/login.css";

function Login() {
  const { loginUser, wait, loggedInCheck } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const onChangeInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!Object.values(formData).every((val) => val.trim() !== "")) {
      setErrMsg("Please Fill in all Required Fields!");
      return;
    }

    const data = await loginUser(formData);
    if (data.success) {
      e.target.reset();
      setRedirect("Redirecting...");
      await loggedInCheck();
      // <Navigate to={<Navigation />} />;
      return;
    }
    setErrMsg(data.message);
  };

  return (
    <div className="login-bg">
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <center>
                    <img
                      src={BmacloudLogo}
                      alt="BMACloud Logo"
                      className="bma-logo"
                    />
                    <p className="sub-text">- by -</p>
                    <img
                      src={SsystemsLogo}
                      alt="7systems Logo"
                      className="ssys-logo"
                    />
                  </center>
                  <br />
                  <p>{errMsg && <div className="err-msg">{errMsg}</div>}</p>
                  <br />
                  <div className="mb-3">
                    <Form onSubmit={submitForm}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Email address
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="login"
                          placeholder="Ihre E-mail"
                          onChange={onChangeInput}
                          value={formData.email}
                          required
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Passwort</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Ihr Passwort"
                          onChange={onChangeInput}
                          value={formData.password}
                          required
                        />
                      </Form.Group>
                      <center>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicCheckbox"
                        >
                          <p className="small">
                            <a className="text-primary" href="#!">
                              Passwort vergessen?
                            </a>
                          </p>
                        </Form.Group>
                      </center>
                      <div className="d-grid">
                        {redirect ? (
                          redirect
                        ) : (
                          <Button
                            variant="danger"
                            type="submit"
                            disabled={wait}
                          >
                            Login
                          </Button>
                        )}
                      </div>
                    </Form>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
