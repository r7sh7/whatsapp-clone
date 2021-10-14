import { Avatar, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/fbconfig";
import getRecipientNumber from "../utils/getRecipientNumber";
import { useCollection } from "react-firebase-hooks/firestore";

const Chats = ({ id }) => {
  const [user] = useAuthState(auth);
  const [pno, setPno] = useState("");

  useEffect(() => {
    db.collection("chats")
      .doc(id)
      .get()
      .then((doc) => setPno(getRecipientNumber(doc.data().users, user)));
  }, [id, user]);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("pno", "==", pno)
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container>
      <Header>
        <HeaderLeft>
          {recipient?.photoURL ? (
            <UseAvatar src={recipient.photoURL} />
          ) : (
            <UseAvatar>{recipient?.name[0]}</UseAvatar>
          )}
          <HeaderInfo>
            <h4>{recipient?.name}</h4>
            <p>Last Seen...</p>
          </HeaderInfo>
        </HeaderLeft>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageConatiner>
        <EndOfMessage />
      </MessageConatiner>
      <InputContainer>
        <IconButton>
          <InsertEmoticonIcon fontSize="large" />
        </IconButton>
        <Input placeholder="Type a message" />
        <IconButton>
          <MicIcon fontSize="large" />
        </IconButton>
      </InputContainer>
    </Container>
  );
};

export default Chats;

const Container = styled.div`
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ebebeb;
  padding: 0.6rem 1rem;
  position: sticky;
  top: 0;
  z-index: 99;
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;
const UseAvatar = styled(Avatar)`
  cursor: pointer;
`;
const HeaderInfo = styled.div`
  margin-left: 1rem;

  > h4 {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
  }

  > p {
    font-size: 0.85rem;
    margin: 0;
  }
`;

const HeaderIcons = styled.div`
  color: #424242;
`;

const MessageConatiner = styled.div`
  padding: 2rem;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
  position: sticky;
  bottom: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background-color: #ebebeb;
  color: gray;
`;

const Input = styled.input`
  flex: 0.95;
  padding: 0.8rem;
  border-radius: 2.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
`;
