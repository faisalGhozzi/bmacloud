import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import axios from "axios";

export default function BuildingInfo(props) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [houseAdress, setHouseAdress] = useState("");
  const [listRooms, setListRooms] = useState([]);
  const [checkPin, setCheckPin] = useState(false);
  const [pin, setPin] = useState("");
  const [houseDevices, setHousedevices] = useState([]);
  const boxid = location.state?.data;
  const [houseid, setHouseID] = useState();
  const [initStatusSirens, setInitStatusSirens] = useState(1);
  const [initStatusDetectors, setInitStatusDetectors] = useState(1);

  console.log(houseid);

  const handleChange = (event) => {
    setPin(event.target.value);
  };

  const changeStatus = (event, newStatus, id) => {
    event.preventDefault();
    setIsLoading(true);
    submitStatus(newStatus, id).then(() => {
      fetchAllDevices();
      setIsLoading(false);
    });
  };

  const changeSirensStatus = (event, newStatus) => {
    event.preventDefault();
    setIsLoading(true);
    submitSirensStatus(newStatus).then(() => {
      fetchAllDevices();
      setInitStatusSirens(newStatus);
      setIsLoading(false);
    });
  };

  const changeDetectorsStatus = (event, newStatus) => {
    event.preventDefault();
    setIsLoading(true);
    submitDetectorsStatus(newStatus).then(() => {
      fetchAllDevices();
      setInitStatusDetectors(newStatus);
      setIsLoading(false);
    });
  };

  const submitStatus = async (new_status, deviceid) => {
    axios.put(
      `http://localhost/bmacloud/server/boxes/gebaude/raume/gerate/status?deviceid=${deviceid}&status=${new_status}`
    );
  };

  const submitDetectorsStatus = async (new_status) => {
    axios.put(
      `http://localhost/bmacloud/server/boxes/gebaude/detectors/status?new_status=${new_status}`
    );
  };

  const submitSirensStatus = async (new_status) => {
    axios.put(
      `http://localhost/bmacloud/server/boxes/gebaude/sirenen/status?new_status=${new_status}`
    );
  };

  const fetchAllDevices = async () => {
    await fetch(
      `http://localhost/bmacloud/server/boxes/gebaude/raume/gerate/devices?houseid=1`
    )
      .then((response) => response.json())
      .then((data) => {
        setHousedevices(data);
      });
  };

  function generateStatus(data) {
    if (data == 1) {
      return <span className="badge rounded-pill text-bg-success">ON</span>;
    }
    return <span className="badge rounded-pill text-bg-danger">OFF</span>;
  }

  const fetchHouse = async () => {
    await fetch(`http://localhost/bmacloud/server/boxes/gebaude?boxid=${boxid}`)
      .then((response) => response.json())
      .then((data) => {
        setHouseAdress(data.adress);
        setHouseID(data.id);
        return data.id;
      })
      .then(async (data) => {
        await fetch(
          `http://localhost/bmacloud/server/boxes/gebaude/raume?houseid=${data[0]}`
        )
          .then((response) => response.json())
          .then((data) => {
            setListRooms(data);
          });
      });
  };

  const toggle = (event) => {
    event.preventDefault();
    if (checkPin) {
      setCheckPin((checkPin) => !checkPin);
    } else if (pin === "123456") {
      setCheckPin((checkPin) => !checkPin);
    }
  };

  useEffect(() => {
    fetchHouse().then(() => {
      fetchAllDevices().then(() => {
        setIsLoading(false);
      });
    });
  }, []);

  return (
    <div className="main-page">
      <div className="container-fluid">
        {isLoading ? (
          <div style={{ width: 50, height: 50 }} className="center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-8">
                <div>
                  <h3 className="title">
                    Status des Gebäudes mit Standort: {houseAdress}
                    <br />
                    <small className="subtitle">
                      Visualisieren und steuern Sie unten Alarme
                    </small>
                  </h3>
                </div>
              </div>
            </div>

            <div className="space-50">
              <div className="row col-4">
                <div className="row">
                  <div className="input-group">
                    <input
                      type="password"
                      id="pin"
                      name="pin"
                      onChange={handleChange}
                      value={pin}
                      autoComplete="off"
                      className="form-control"
                      placeholder="Geheimzahl"
                      aria-label="Geheimzahle"
                      aria-describedby="basic-addon2"
                    />
                    <div className="input-group-append">
                      <span
                        className={`input-group-text btn ${
                          checkPin ? "btn-danger" : "btn-success"
                        }`}
                        id="basic-addon2"
                        onClick={toggle}
                      >
                        {checkPin ? "Abmelden" : "Einreichen"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {checkPin ? (
              <>
                <div className="space-50"></div>

                <div className="d-grid gap-2 d-md-flex">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={(event) =>
                      changeSirensStatus(event, initStatusSirens === 1 ? 0 : 1)
                    }
                  >
                    {initStatusSirens === 1
                      ? "Sirenen Deaktivieren"
                      : "Sirenen Aktivieren"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={(event) =>
                      changeDetectorsStatus(
                        event,
                        initStatusDetectors === 1 ? 0 : 1
                      )
                    }
                  >
                    {initStatusDetectors === 1
                      ? "Melder Deaktivieren"
                      : "Melder Aktivieren"}
                  </button>
                </div>

                <div className="space-50"></div>
              </>
            ) : (
              <></>
            )}

            <div className="row">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">Räume</div>
                    <div className="card-body">
                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th>Raumename</th>
                            <th className="sort-alpha">Bemerkung</th>
                            <th>Status</th>
                            {checkPin ? <th>Aktion</th> : <></>}
                          </tr>
                        </thead>
                        <tbody>
                          {listRooms.map((data, key) => (
                            <tr key={key}>
                              <td>{data.raumename}</td>
                              <td>{data.bemerkung}</td>
                              {/* <td>{renderStatus(data)}</td> */}
                              <td>{data.status}</td>
                              {checkPin ? (
                                <td>
                                  <div className="dropdown">
                                    <a
                                      href="javascript:void(0);"
                                      className="btn btn-default btn-xs dropdown-toggle"
                                      role="button"
                                      id="dropdownMenuLink"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <small>Aktion</small>
                                    </a>
                                    <ul
                                      className="dropdown-menu pull-right text-left"
                                      aria-labelledby="dropdownMenuLink"
                                    >
                                      <li>
                                        <Link
                                          className="dropdown-item"
                                          to={`/boxen/gebaude/raume`}
                                          state={{
                                            houseid: data.houseid,
                                            roomid: data.id,
                                          }}
                                        >
                                          Einzelheiten
                                        </Link>
                                      </li>
                                      <li>
                                        <Link
                                          className="dropdown-item"
                                          to={`/boxen/gebaude`}
                                        >
                                          Übertragungseinheit
                                          aktivieren/deaktivieren
                                        </Link>
                                      </li>
                                      <li>
                                        <Link
                                          className="dropdown-item"
                                          to={`/boxen/gebaude`}
                                        >
                                          Alarm aktivieren/deaktivieren
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                </td>
                              ) : (
                                <></>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {checkPin ? (
              <>
                <div className="space-50"></div>

                <div className="row">
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">Geräte</div>
                        <div className="card-body">
                          <table className="table table-striped table-hover">
                            <thead>
                              <tr>
                                <th>Referenz</th>
                                <th className="sort-alpha">Typ</th>
                                <th>Status</th>
                                <th>Letzter Test</th>
                                <th>Aktion</th>
                              </tr>
                            </thead>
                            <tbody>
                              {houseDevices.map((data, key) => (
                                <tr key={key}>
                                  <td>{data.ref}</td>
                                  <td>{data.type}</td>
                                  {/* <td>{renderStatus(data)}</td> */}
                                  <td>{generateStatus(data.active)}</td>
                                  <td>{data.letzter_test}</td>

                                  <td>
                                    <div className="dropdown">
                                      <a
                                        href="javascript:void(0);"
                                        className="btn btn-default btn-xs dropdown-toggle"
                                        role="button"
                                        id="dropdownMenuLink"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <small>Aktion</small>
                                      </a>
                                      <ul
                                        className="dropdown-menu pull-right text-left"
                                        aria-labelledby="dropdownMenuLink"
                                      >
                                        <li>
                                          <Link
                                            className="dropdown-item"
                                            onClick={(event) =>
                                              changeStatus(
                                                event,
                                                data.active === "1" ? "0" : "1",
                                                data.id
                                              )
                                            }
                                          >
                                            {data.active === "1"
                                              ? "Deaktivieren"
                                              : "Aktivieren"}
                                          </Link>
                                        </li>
                                        <li>
                                          <Link
                                            className="dropdown-item"
                                            to={`/boxen/gebaude`}
                                          >
                                            Übertragungseinheit
                                            aktivieren/deaktivieren
                                          </Link>
                                        </li>
                                        <li>
                                          <Link
                                            className="dropdown-item"
                                            to={`/boxen/gebaude`}
                                          >
                                            Alarm aktivieren/deaktivieren
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </div>
  );
}
