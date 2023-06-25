import React from "react";
import * as AiIcons from "react-icons/ai";
import * as ImIcons from "react-icons/im";
import * as BsIcons from "react-icons/bs";
import { Link } from "react-router-dom";

export const SidebarData = [
  {
    title: "Start",
    icon: <AiIcons.AiOutlineDashboard />,
    sub: [
      {
        title: "Dashboard",
        link: <Link to="/">Dashboard</Link>,
      },
      {
        title: "Datenpunkte Übersicht",
        link: <Link to="/datenpunkte">Datenpunkte Übersicht</Link>,
      },
    ],
  },
  {
    title: "Anlagen",
    icon: <ImIcons.ImStatsBars />,
    sub: [
      {
        title: "Anlagen Details",
        link: <Link to="/anlagen/details">Anlagen Details</Link>,
      },
      {
        title: "Neue Anlage",
        link: <Link to="/anlagen/neue">Neue Anlage</Link>,
      },
      {
        title: "Anlage Statistik",
        link: <Link to="/anlagen/statistik">Anlage Statistik</Link>,
      },
      {
        title: "Deaktivierte Anlagen",
        link: <Link to="/anlagen/deaktivierte">Deaktivierte Anlagen</Link>,
      },
    ],
  },
  {
    title: "Servicebericht",
    icon: <BsIcons.BsFileEarmarkSpreadsheet />,
    link: "/servicebericht",
  },
  {
    title: "Boxen",
    icon: <BsIcons.BsHdd />,
    link: "/boxen",
  },
  {
    title: "Übersicht",
    icon: <AiIcons.AiOutlineEye />,
    sub: [
      {
        title: "Netzteile",
        link: <Link to="/ubersicht/netzteile">Netzteile</Link>,
      },
      {
        title: "Information",
        link: <Link to="/ubersicht/information">Information</Link>,
      },
      {
        title: "Vertretungszugriffe",
        link: <Link to="/ubersicht/vertretungszugriffe">Vertretungszugriffe</Link>,
      },
    ],
  },
  {
    title: "Dateien (Firma)",
    icon: <AiIcons.AiOutlineTable />,
    link: "/dateien",
  },
];
