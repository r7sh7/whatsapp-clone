import React from "react";
import styled from "styled-components";

const Main = () => {
  return (
    <Container>
      <div>
        <img src="/images/logo.svg" alt="" height="200px" />
        <Title>Select a Conversation to get started</Title>
      </div>
    </Container>
  );
};

export default Main;

const Container = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  background-color: whitesmoke;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Title = styled.h1``;
