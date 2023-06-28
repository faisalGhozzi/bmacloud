import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

import * as AiIcons from "react-icons/ai";
import * as FiIcons from "react-icons/fi";
// import axios from "axios";

export default function Boxen(props) {
  const [listBoxes, setListBoxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);

  const fetchBoxes = async () => {
    await fetch(
      `http://localhost/bmacloud/server/boxes?mandant=${user.mandant}`
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .then(async (data) => {
        await Promise.all(
          data.map((e, index, array) => {
            return fetch(
              `http://localhost/bmacloud/server/boxes/status?boxid=${data[index].boxid}&skey=bc66_pegel`
            )
              .then((response) => response.json())
              .then((data) => {
                array[index] = { ...e, ...data };
              });
          })
        ).catch((e) => {
          console.error(e);
        });
        return data;
      })
      .then(async (data) => {
        await Promise.all(
          data.map((e, index, array) => {
            return fetch(
              `http://localhost/bmacloud/server/anlage/id?aid=${data[index].aid}&mandant=${user.mandant}`
            )
              .then((response) => response.json())
              .then((data) => {
                array[index] = { ...e, ...data };
              });
          })
        ).catch((e) => {
          console.error(e);
        });
        return data;
      })
      .then(async (data) => {
        await Promise.all(
          data.map((e, index, array) => {
            return fetch(
              `http://localhost/bmacloud/server/boxes/status/boxid=${data[index].aid}&skey=protokoll`
            )
              .then((response) => response.json())
              .then((data) => {
                array[index] = { ...e, ...data };
              });
          })
        ).catch((e) => {
          console.error(e);
        });
        setListBoxes(data);
      });
  };

  useEffect(() => {
    fetchBoxes().then(() => {
      setIsLoading(false);
    });
  }, []);

  function renderStatus(data) {
    if (data.mqtt_online === 1) {
      return (
        <div>
          <span className="badge bg-success">
            Online seit{" "}
            {new Intl.DateTimeFormat("de-DE", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(data.mqtt_ts)}
          </span>
        </div>
      );
    } else if (data.mqtt_ts > 0) {
      return (
        <div>
          <span className="badge bg-danger">
            Offline seit{" "}
            {new Intl.DateTimeFormat("de-DE", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(data.mqtt_ts)}
          </span>
        </div>
      );
    } else if (data.lastping <= new Date() - 90) {
      if (data.lastping > 0) {
        return (
          <div>
            <span className="badge bg-danger">
              Offline seit{" "}
              {new Intl.DateTimeFormat("de-DE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(data.lastping)}
            </span>
          </div>
        );
      } else {
        return <span className="badge bg-warning">Offline</span>;
      }
    } else {
      return <span className="badge badge-success">Online</span>;
    }
  }

  function renderVerzogerung(data) {
    if (data.last_message_ts > 0 && data.last_message > 0) {
      return parseInt(data.last_message - data.last_message_ts) + " Sek.";
    }
    return "";
  }

  function formatted_string(pad, user_str, pad_pos = "") {
    if (typeof user_str === "undefined") return pad;
    if (pad_pos === "l") {
      return (pad + user_str).slice(-pad.length);
    } else {
      return (user_str + pad).substring(0, pad.length);
    }
  }

  function renderVersion(data) {
    if (data.version !== "") {
      if (data.version >= 200) {
        return "V3." + formatted_string("00", data.version - 200);
      } else if (data.version >= 100) {
        return "V2." + formatted_string("00", data.version - 100);
      } else {
        return "V1." + data.version;
      }
    } else {
      return "";
    }
  }
  return (
    <div className="main-page">
      <div className="container-fluid">
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <div className="row">
              <div className="col-8">
                <div>
                  <h3 className="title">
                    Geräteverwaltung
                    <br />
                    <small className="subtitle">
                      Verfügbare Sender mit entsprechendem Status
                    </small>
                  </h3>
                </div>
              </div>

              <div className="col-4" align="right">
                <button className="btn btn-labeled btn-success" type="button">
                  <span className="btn-label">
                    <i>
                      <FiIcons.FiPlusSquare />
                    </i>
                  </span>
                  Neue Box
                </button>
              </div>
            </div>

            <div className="row">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">Boxen</div>
                    <div className="card-body">
                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th>Typ</th>
                            <th>Seriennummer</th>
                            <th className="sort-alpha">Bemerkung</th>
                            <th>Status</th>
                            <th>Pegel</th>
                            <th>Anlage</th>
                            <th>Gruppe</th>
                            <th style={{ whiteSpace: "nowrap" }}>
                              Verzögerung
                            </th>
                            <th>Version</th>
                            <th>-TBD-</th>
                            <th>Aktion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listBoxes.map((data, key) => (
                            <tr>
                              <td>
                                {data.dauerhaft > 0 ? (
                                  <img alt="box1" />
                                ) : (
                                  <img alt="box2" />
                                )}
                              </td>
                              <td>{data.boxid}</td>
                              <td>{data.bemerkung}</td>
                              <td>{renderStatus(data)}</td>
                              <td>{data.svalue}</td>
                              <td>{data.aid > 0 ? data.nr : "-"}</td>
                              <td>{data.gname}</td>
                              <td>{renderVerzogerung(data)}</td>
                              <td>{renderVersion(data)}</td>
                              <td>{/*To fill later*/}</td>
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
                                      <a href="" className="dropdown-item">
                                        Bearbeiten
                                      </a>
                                    </li>
                                    <li>
                                      <a href="" className="dropdown-item">
                                        Live-Meldungen
                                      </a>
                                    </li>
                                    <li>
                                      <a href="" className="dropdown-item">
                                        Log
                                      </a>
                                    </li>
                                    {data.mqtt_ts > 0 ?? (
                                      <>
                                        <li>
                                          <a href="" className="dropdown-item">
                                            Statusaktualisierung
                                          </a>
                                        </li>
                                        <li>
                                          <a href="" className="dropdown-item">
                                            MQTT-Ping
                                          </a>
                                        </li>
                                        <li>
                                          <a href="" className="dropdown-item">
                                            Sende Updates zur Box
                                          </a>
                                        </li>
                                        <li>
                                          <a href="" className="dropdown-item">
                                            Neustart der Box
                                          </a>
                                        </li>
                                      </>
                                    )}
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
        )}
      </div>
    </div>
  );
}
