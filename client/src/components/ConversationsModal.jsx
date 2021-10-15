import React from "react";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ConversationsModal = ({ closeModal }) => {
  const reset = (e) => {
    closeModal(e);
  };
  return (
    <Card>
      <Header>
        <h2>Create a Group Chat</h2>
        <IconButton onClick={reset}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Body></Body>
    </Card>
  );
};

export default ConversationsModal;

const Card = styled.div`
  max-width: 35rem;
  width: 100%;
  border-radius: 0.4rem;
  background-color: whitesmoke;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e2e2e2;
`;

const Body = styled.div`
  padding: 1rem;

  > form {
    display: flex;
    flex-direction: column;

    > label {
      font-size: 1.2rem;
      padding: 0.5rem 0;
    }

    > input {
      padding: 0.5rem;
      border: 1px solid #e2e2e2;
      border-radius: 0.2rem;
      margin-bottom: 1rem;
      outline: none;
      font-size: 1rem;
    }

    > button {
      max-width: 8rem;
      padding: 0.8rem;
      margin-top: 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: whitesmoke;
      background-color: #3cbc28;
      border: 1px solid #e2e2e2;
      border-radius: 0.2rem;
    }
  }
`;
