import moment from "moment";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../config/fbconfig";

const Message = ({ message: { message, user }, timestamp }) => {
  console.log(user);
  const [userLoggedIn] = useAuthState(auth);
  const MessageType = user === userLoggedIn.phoneNumber ? Sender : Receiver;
  return (
    <Container>
      <MessageType>
        {message}
        <Timestamp>{moment(timestamp).format("LT")}</Timestamp>
      </MessageType>
    </Container>
  );
};

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 0.9rem;
  padding-bottom: 1.5rem;
  border-radius: 0.5rem;
  margin: 0.6rem;
  min-width: 60px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 0.6rem;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
`;
