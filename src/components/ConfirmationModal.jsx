import React from "react";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmationModal = ({ closeModal, action, actionName }) => {
  return (
    <Card>
      <Header>
        <h2>Confirm {actionName}</h2>
        <IconButton onClick={(e) => closeModal(e)}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Body>
        {actionName === "logout" ? (
          <Text>Are you sure you want to logout?</Text>
        ) : (
          <Text>Are you sure you want to delete this message?</Text>
        )}
        <Button confirm onClick={action}>
          Yes
        </Button>
        <Button onClick={closeModal}>No</Button>
      </Body>
    </Card>
  );
};

export default ConfirmationModal;

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
`;

const Text = styled.p`
  font-size: 1.2rem;
`;

const Button = styled.button`
  width: 5rem;
  padding: 0.8rem;
  margin-top: 1rem;
  margin-right: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: whitesmoke;
  background-color: ${(props) => (props.confirm ? "#df0707" : "#3cbc28")};
  border: 1px solid #e2e2e2;
  border-radius: 0.5rem;
  cursor: pointer;

  :hover {
    background-color: ${(props) => (props.confirm ? "#df0707bc" : "#3cbc28bc")};
  }
`;
