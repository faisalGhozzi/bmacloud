import React from "react";
import * as AiIcons from "react-icons/ai";
import * as ImIcons from "react-icons/im";
import * as BsIcons from "react-icons/bs";
import { Link } from "react-router-dom";

export const AnlagenSidebarData = [
  {
    title: "Start",
    link: "/",
    icon: <AiIcons.AiOutlineDashboard />,
  },
  {
    title: "Anlage",
    icon: <ImIcons.ImStatsBars />,
    sub: [
      {
        title: "Grunddaten",
        sub: [
          {
            title: "Anlagendaten",
            link: "",
          },
          {
            title: "Melder",
            link: "",
          },
          {
            title: "Steuerungen",
            link: "",
          },
          {
            title: "Information",
            link: "",
          },
        ],
      },
      {
        title: "Tauschintervalle",
        sub: [
          {
            title: "Melder",
            link: "",
          },
          {
            title: "Akkus",
            link: "",
          },
        ],
      },
      {
        title: "Berichte",
        link: "",
      },
      {
        title: "Struktur",
        sub: [
          {
            title: "Standorte",
            link: "",
          },
          {
            title: "Geräte",
            link: "",
          },
        ],
      },
      {
        title: "Wartung",
        sub: [
          {
            title: "Prüfplan",
            link: "",
          },
          {
            title: "Allg. Prüfpunkte bearbeiten",
            link: "",
          },
        ],
      },
      {
        title: "Vollprüfung",
        sub: [
          {
            title: "Prüfplan",
            link: "",
          },
          {
            title: "Allg. Prüfpunkte bearbeiten",
            link: "",
          },
        ],
      },
      {
        title: "Ereignisse",
        sub: [
          {
            title: "Live-Meldungen",
            link: "",
          },
          {
            title: "Melder",
            link: "",
          },
        ],
      },
      {
        title: "Alarmierung",
        link: "",
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
        link: (
          <Link to="/ubersicht/vertretungszugriffe">Vertretungszugriffe</Link>
        ),
      },
    ],
  },
  {
    title: "Dateien (Firma)",
    icon: <AiIcons.AiOutlineTable />,
    link: "/dateien",
  },
];
