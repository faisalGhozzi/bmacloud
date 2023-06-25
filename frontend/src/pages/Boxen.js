import React, {useState, useEffect} from "react";

import * as FiIcons from "react-icons/fi";
import axios from 'axios';

export default function Boxen(){
  const [listBoxes, setListBoxes] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoxes = async () => {
    const res = await fetch(
      "http://localhost/bmacloud/api/boxes"
    );
    
    return await res.json();
  }

  useEffect(() => {
    fetchBoxes().then((boxes) => {
      setIsLoading(false);
      setListBoxes(boxes);
    })
  }, [])

  function renderStatus(data){
    if(data.mqtt_online === 1){ 
        return(
        <div>
          <span className="badge bg-success">Online seit {new Intl.DateTimeFormat('de-DE', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(data.mqtt_ts)}</span>
        </div>)
    }else if(data.mqtt_ts > 0){
      return(
      <div>
        <span className="badge bg-danger">Offline seit {new Intl.DateTimeFormat('de-DE', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(data.mqtt_ts)}</span> 
      </div>)
    }else if(data.lastping <= new Date() - 90){
      if(data.lastping > 0){
        return(
        <div>
          <span className="badge bg-danger">Offline seit {new Intl.DateTimeFormat('de-DE', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(data.lastping)}</span> 
        </div>)
      }else{
        return(<span className="badge bg-warning">Offline</span>)
      }
    }else{
      return(<span className="badge badge-success">Online</span>)
    }
  }

  return (
    <div className="main-page">
      <div className="container-fluid">
        { isLoading ? <h1>Loading...</h1>:
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
                  <table
                    id="datatable"
                    className="table table-striped table-hover"
                  >
                    <thead>
                      <tr>
                        <th>Typ</th>
                        <th>Seriennummer</th>
                        <th className="sort-alpha">Bemerkung</th>
                        <th>Status</th>
                        <th>Pegel</th>
                        <th>Anlage</th>
                        <th>Gruppe</th>
                        <th style={{ whiteSpace: "nowrap" }}>Verzögerung</th>
                        <th>Version</th>
                        <th>Aktion</th>
                      </tr>
                    </thead>
                    {listBoxes.map((data, key) => 
                    <tbody key={key}>
                      <tr>
                      <td>
                        {data.dauerhaft > 0 ? 
                        <img alt="box1" /> : 
                        <img alt="box2" />}
                      </td>
                      <td>{data.boxid}</td>
                      <td>{data.bemerkung}</td>
                      <td>
                      {renderStatus(data)}
                      </td>
                      <td>pegel</td>
                      <td>anlage</td>
                      <td>gruppe</td>
                      <td>verver</td>
                      <td>version</td>
                      <td>
                        <button>hello</button>
                      </td>
                      </tr>
                    </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      }
      </div>
    </div>
  );
}