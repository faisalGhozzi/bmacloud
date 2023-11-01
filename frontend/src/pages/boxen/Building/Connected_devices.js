import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { Spinner } from "react-bootstrap";
import { Table } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import axios from "axios";

// Drag table row

const type = "DragableBodyRow";

const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop(
    () => ({
      accept: type,
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName:
            dragIndex < index ? "drop-over-downward" : "drop-over-upward",
        };
      },
      drop: (item) => {
        moveRow(item.index);
      },
    }),
    [index]
  );
  const [, drag] = useDrag(
    () => ({
      type,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index]
  );
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{ cursor: "move", ...style }}
      {...restProps}
    ></tr>
  );
};

export default function ConnectedDevices(props) {
  const columns = [
    {
      title: "Referenz",
      dataIndex: "referenz",
      key: "referenz",
    },
    {
      title: "Typ",
      dataIndex: "typ",
      key: "typ",
    },

    {
      title: "Letzter Test",
      dataIndex: "latest_test",
      key: "latest_test",
    },
  ];
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [houseDevices, setHousedevices] = useState([]);
  const [status, setStatus] = useState();
  const houseid = location.state?.houseid;
  const roomid = location.state?.roomid;
  const [data, setData] = useState([
    {
      key: "4",
      referenz: "EATON FULLEON FB/024/R",
      typ: "Sirene",
      latest_test: "2023-10-04",
    },
    {
      key: "5",
      referenz: "EATON FULLEON FB/024/R",
      typ: "Sirene",
      latest_test: "2023-10-04",
    },
    {
      key: "6",
      referenz: "Eingangstür",
      typ: "Tür",
      latest_test: "2023-10-04",
    },
    {
      key: "7",
      referenz: "LFII HSW",
      typ: "Sprinkler",
      latest_test: "2023-10-04",
    },
  ]);

  const changeStatus = (event, newStatus, id) => {
    event.preventDefault();
    setIsLoading(true);
    submitStatus(newStatus, id).then(() => {
      fetchDevices();
      setIsLoading(false);
    });
  };

  const submitStatus = async (new_status, deviceid) => {
    axios.put(
      `http://localhost:8888/bmacloud/server/boxes/gebaude/raume/gerate/status?deviceid=${deviceid}&status=${new_status}`
    );
  };

  const fetchDevices = async () => {
    await fetch(
      `http://localhost:8888/bmacloud/server/boxes/gebaude/raume/gerate?houseid=${houseid}&roomid=${roomid}`
    )
      .then((response) => response.json())
      .then((data) => {
        setDevices(data);
      });
  };

  const fetchAllDevices = async () => {
    await fetch(
      `http://localhost:8888/bmacloud/server/boxes/gebaude/raume/gerate/devices?houseid=${houseid}`
    )
      .then((response) => response.json())
      .then((data) => {
        setHousedevices(data);
      });
  };

  useEffect(() => {
    fetchDevices().then(() => {
      fetchAllDevices().then(() => {
        setIsLoading(false);
      });
      // setIsLoading(false);
    });
  }, []);

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [data, 0, dragRow],
          ],
        })
      );
    },
    [houseDevices]
  );

  function generateStatus(data) {
    if (data == 1) {
      return <span className="badge rounded-pill text-bg-success">ON</span>;
    }
    return <span className="badge rounded-pill text-bg-danger">OFF</span>;
  }

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
                    Informationen zu Raumgeräten
                    <br />
                    <small className="subtitle">
                      Geräte visualisieren und testen / Evakuierungsszenarien
                      programmieren
                    </small>
                  </h3>
                </div>
              </div>
            </div>

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
                          {devices.map((data, key) => (
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

            <div className="space-50"></div>

            <div className="row">
              <div className="col-8">
                <div>
                  <h3 className="title">
                    Evakuierungssequenz
                    <br />
                    <small className="subtitle">
                      Programmieren eine Evakuierung Sequenz, falls dieser Raum
                      in Brand gerät
                    </small>
                  </h3>
                </div>
              </div>
            </div>

            <DndProvider backend={HTML5Backend}>
              <Table
                columns={columns}
                dataSource={data}
                components={components}
                onRow={(record, index) => ({
                  index,
                  moveRow,
                })}
              />
            </DndProvider>
          </>
        )}
      </div>
    </div>
  );
}
