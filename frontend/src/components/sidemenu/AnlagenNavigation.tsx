import React from "react";
import "../../style/sidebar.css";
import * as BsIcons from "react-icons/bs";
import { AnlagenSidebarData } from "./data/AnlagenSidebarData";
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import * as FiIcons from "react-icons/fi";
import SubmenuAnlagen from "./SubmeuAnlagen";
import { title } from "process";

function MainNavigation() {
  const { user, logout } = useContext(UserContext);
  const [toggleSidebar, setToggleSidebar] = useState(true);
  // const [toggleDropdown, setToggleDropdown] = useState(false);
  const [submenuStates, setSubmenuStates] = useState(
    Array(AnlagenSidebarData.length).fill(false)
  );

  const handleSubmenuClick = (index: any) => {
    const newSubmenuStates = [...submenuStates];
    newSubmenuStates[index] = !newSubmenuStates[index];
    setSubmenuStates(newSubmenuStates);
  };
  return (
    <>
      <div className={`sidebar ${toggleSidebar ? "" : "close"}`}>
        {toggleSidebar ? (
          <div className="logo-details">
            <span className="small-title"></span>
            <span className="logo_name">BMAcloud</span>
          </div>
        ) : (
          <div className="logo-details">
            <span className="small-title">BMA</span>
          </div>
        )}
        <ul className="nav-links">
          {AnlagenSidebarData.map((val, key) => {
            if (val.sub !== undefined) {
              return (
                <SubmenuAnlagen
                  key={key}
                  val={val}
                  submenuIsOpen={submenuStates[key]}
                  onSubmenuToggle={() => handleSubmenuClick(key)}
                />
              );
            } else {
              return (
                <li key={key}>
                  <Link to={val.link}>
                    <i>{val.icon}</i>
                    <span className="link_name">{val.title}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <a href="#" className="link_name">
                        {val.title}
                      </a>
                    </li>
                  </ul>
                </li>
              );
            }
          })}
        </ul>
        <ul>
          <li>
            <FiIcons.FiLogOut />
          </li>
          <li>
            <FiIcons.FiLogOut />
          </li>
          <li>
            <FiIcons.FiLogOut />
          </li>
          <li>
            <p>T</p>
          </li>
        </ul>
      </div>
      <nav className="navbar navbar-expanded-lg navbar-light bg-light">
        <div className="container-fluid">
          <i
            className="bx bx-menu"
            onClick={() => setToggleSidebar(!toggleSidebar)}
          ></i>
          <span className="text dropdown">
            <i
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <BsIcons.BsPerson />
            </i>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton1"
            >
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={logout}>
                  Abmelden
                </a>
              </li>
            </ul>
          </span>
        </div>
      </nav>
    </>
  );
}

export default MainNavigation;
