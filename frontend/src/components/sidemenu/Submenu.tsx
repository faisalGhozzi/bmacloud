import React from "react";

interface SubmenuProps {
  val: any;
  submenuIsOpen: boolean;
  onSubmenuToggle: () => void;
}

export default function Submenu(props: SubmenuProps) {
  return (
    <li className={`${props.submenuIsOpen ? "showMenu" : ""}`}>
      <div className="iocn-link" onClick={props.onSubmenuToggle}>
        <a href="#">
          <i>{props.val.icon}</i>
          <span className="link_name">{props.val.title}</span>
        </a>
        <i className="bx bxs-chevron-down arrow"></i>
      </div>
      <ul className="sub-menu">
        <li>
          <a href="#" className="link_name">
            {props.val.title}
          </a>
        </li>
        {props.val.sub?.map((subval: any, subkey: any) => {
          return <li key={`${subkey}`}>{subval.link}</li>;
        })}
      </ul>
    </li>
  );
}
