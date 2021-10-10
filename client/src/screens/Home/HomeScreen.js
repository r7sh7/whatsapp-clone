import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";

const HomeScreen = () => {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Redirect to="/login" />;
  return <div>HomeScreen</div>;
};

export default HomeScreen;
