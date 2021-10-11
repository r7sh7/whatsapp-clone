import React from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { width } from "@mui/system";

const Chat = () => {
  return (
    <Container>
      <UseAvatar sx={{ height: "3.2rem", width: "3.2rem" }} />
      <ChatDetails>
        <MessageDetails>
          <h4>Rishi Bolinjkar</h4>
          <p>Hello world! this is my first message</p>
        </MessageDetails>
        <MessageStats>
          <Time>12:45</Time>
          <Number>90</Number>
        </MessageStats>
      </ChatDetails>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  :hover {
    background-color: #e2e2e2;
  }
`;

const UseAvatar = styled(Avatar)`
  margin-left: 0.8rem;
`;

const ChatDetails = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  margin: 0 0.8rem;
  padding-left: 0;
  border-bottom: 1px solid #e2e2e2;
`;

const MessageDetails = styled.div`
  > h4 {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
    margin-bottom: 0.2rem;
  }
  > p {
    font-size: 0.88rem;
    font-weight: 500;
    margin: 0;
  }
`;

const MessageStats = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Time = styled.span`
  margin-bottom: 0.2rem;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 400;
`;
const Number = styled.span`
  background-color: #3cbc28;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  border-radius: 1rem;
  padding: 0.1rem 0;
`;
