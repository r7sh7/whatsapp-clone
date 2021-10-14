import React from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import Chats from "../../components/Chats.jsx";
import Main from "../../components/Main.jsx";
import Sidebar from "../../components/Sidebar.jsx";

const HomeScreen = () => {
  const { id } = useParams();

  return (
    <Container>
      <Sidebar id={id} />
      {id ? <Chats id={id} /> : <Main />}
    </Container>
  );
};

export default HomeScreen;

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow-y: hidden;
`;
