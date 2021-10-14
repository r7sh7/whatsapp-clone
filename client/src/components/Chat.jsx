import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { auth, db } from "../config/fbconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientNumber from "../utils/getRecipientNumber";
import { useCollection } from "react-firebase-hooks/firestore";
import { useHistory } from "react-router";

const Chat = ({ id, users, active, contacts }) => {
  const [newContact, setNewContact] = useState(true);
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("pno", "==", getRecipientNumber(users, user))
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const history = useHistory();
  const chatClickHandler = () => {
    history.push(`/chats/${id}`);
  };

  useEffect(() => {
    contacts?.forEach((contact) => {
      if (contact.pno === recipient?.pno) {
        setNewContact(false);
        setName(contact.name);
      }
    });
  }, [contacts, recipient?.pno]);
  return (
    <Container onClick={chatClickHandler} active={active}>
      {recipient?.photoURL ? (
        <UseAvatar
          sx={{ height: "3.2rem", width: "3.2rem" }}
          src={recipient.photoURL}
        />
      ) : (
        <UseAvatar sx={{ height: "3.2rem", width: "3.2rem" }}>
          {name[0] || recipient?.name[0]}
        </UseAvatar>
      )}
      <ChatDetails>
        <MessageDetails>
          {newContact ? (
            <h4>
              {recipient?.pno}
              <span style={{ fontSize: "0.8rem" }}>~ {recipient?.name}</span>
            </h4>
          ) : (
            <h4>{name}</h4>
          )}
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
  background-color: ${(props) => (props.active ? "#e2e2e2" : "white")};
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
