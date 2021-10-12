import React from "react";
import { Circle } from "better-react-spinkit";
import styled from "styled-components";

const Loader = () => {
  return (
    <Container>
      <img src="/images/logo.svg" alt="" height={100} />
      <Circle color="#3CBC28" size={60} />
    </Container>
  );
};

export default Loader;

const Container = styled.div`
  display: grid;
  height: 30vh;
  place-items: center;
  background-color: white;
`;
