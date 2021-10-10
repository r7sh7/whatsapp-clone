import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import styled from "styled-components";
import Main from "../../components/Main.jsx";
import Sidebar from "../../components/Sidebar.jsx";

const HomeScreen = () => {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Redirect to="/login" />;
  return (
    <Container>
      <Sidebar />
      <Main />
    </Container>
  );
};

export default HomeScreen;

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow-y: hidden;
`;
