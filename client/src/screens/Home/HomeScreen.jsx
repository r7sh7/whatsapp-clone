import React from "react";
import styled from "styled-components";
import Main from "../../components/Main.jsx";
import Sidebar from "../../components/Sidebar.jsx";

const HomeScreen = () => {
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
