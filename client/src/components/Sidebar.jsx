import React from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { Button, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import Chat from "./Chat";

const Sidebar = () => {
  return (
    <Container>
      <Top>
        <Header>
          <UseAvatar />
          <HeaderIcons>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </HeaderIcons>
        </Header>
        <Search>
          <SearchBar>
            <SearchIcon />
            <SearchInput placeholder="Search in chats" />
          </SearchBar>
        </Search>
        <SidebarButton>Start a New Chat</SidebarButton>
      </Top>
      <ChatsContainer>
        {[...Array(20)].map((chat) => (
          <Chat />
        ))}
      </ChatsContainer>
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  border-right: 1px solid #e2e2e2;
`;

const Top = styled.div`
  position: sticky;
  top: 0;
  z-index: 999;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ebebeb;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid whitesmoke;
`;

const UseAvatar = styled(Avatar)`
  cursor: pointer;
`;

const HeaderIcons = styled.div`
  color: #424242;
`;

const Search = styled.div`
  background-color: whitesmoke;
  padding: 0.4rem 1rem;
  border-bottom: 1px solid whitesmoke;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0.4rem 1rem;
  border: 1px solid whitesmoke;
  border-radius: 1.5rem;
`;
const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  margin-left: 1rem;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    font-weight: 500;
    font-size: 1rem;
    padding: 0.5rem;
    color: black;
    border-bottom: 1px solid whitesmoke;
  }
`;

const ChatsContainer = styled.div`
  overflow-y: auto;
  height: 80%;
`;
