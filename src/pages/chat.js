import Head from "next/head";
import { Box, Button, Container, Stack, Typography, TextField } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, { user: "You", message: inputMessage }]);

      try {
        const response = await fetch("http://localhost:3001/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: inputMessage }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: "Chatbot", message: data.reply },
          ]);
        } else {
          console.error("Failed to fetch chatbot response");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }

      setInputMessage(""); // Clear the input field after sending the message
    }
  };

  return (
    <>
      <Head>
        <title>Chat Bot</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4">Chat</Typography>
          <Box
            sx={{
              height: "300px",
              overflowY: "auto",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              mt: 3,
              padding: 2,
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.user}:</strong> {msg.message}
              </div>
            ))}
          </Box>
          <TextField
            label="Type your message..."
            variant="outlined"
            fullWidth
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            sx={{ marginTop: 2 }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSendMessage}
            sx={{ marginTop: 2 }}
          >
            Send
          </Button>
        </Container>
      </Box>
    </>
  );
};

Chat.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Chat;
