import moment from "moment";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../config/fbconfig";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

const Message = ({ message: { message, user, timestamp } }) => {
  const [userLoggedIn] = useAuthState(auth);
  const MessageType = user === userLoggedIn.phoneNumber ? Sender : Receiver;

  return (
    <Container>
      <MessageType>
        {message}
        <Timestamp>{moment(timestamp).format("LT")}</Timestamp>
        {MessageType === Sender && (
          <IconButton>
            <DeleteIcon />
          </IconButton>
        )}
      </MessageType>
    </Container>
  );
};

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 0.4rem;
  border-radius: 0.5rem;
  margin: 0.6rem;
  min-width: 80px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  position: relative;
  > button {
    padding: 0.05rem;
    z-index: 999;
    position: absolute;
    top: 0.1rem;
    right: 0.1rem;
    display: none;
  }
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const Timestamp = styled.div`
  color: gray;
  font-size: 0.7rem;
  text-align: right;
  padding-top: 0.5rem;
  margin-left: 1.2rem;

  &:hover + button,
  button:hover {
    display: inline-block;
    background-color: #dcf8c6;
    cursor: pointer;
  }
`;
