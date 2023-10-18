import { useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import React, { useState, useEffect, useContext } from "react";

export default function BoxenEdit(props) {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { from } = location.state;
  return (
    <div className="main-page">
      <div className="container-fluid">
        <h1>{from}</h1>
      </div>
    </div>
  );
}
