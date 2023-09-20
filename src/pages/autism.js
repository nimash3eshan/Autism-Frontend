import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import MicIcon from "@mui/icons-material/Mic";
import { useRef, useState } from "react";

const Page = () => {
  const fileInputRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [audioURL, setAudioURL] = useState(null);

  const handleFileUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      setProcessing(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://127.0.0.1:5000/process-voice", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);
          setAudioURL(objectURL);
        } else {
          const errorText = await response.text();
          console.error("Failed to process audio:", errorText);
          alert("Error processing audio: " + errorText);
        }
      } catch (error) {
        console.error("Error uploading the file:", error);
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Autism</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Autism Detection</Typography>
            </div>
            <div>
              <Grid container spacing={3}></Grid>
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                mt: 3,
              }}
            >
              <input
                accept="audio/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                id="raised-button-file"
                onChange={handleFileUpload}
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <MicIcon />
                    </SvgIcon>
                  }
                  component="span"
                >
                  Upload
                </Button>
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                mt: 3,
              }}
            >
              {processing && <div>Processing...</div>}
              {audioURL && (
                <div>
                  <audio controls>
                    <source src={audioURL} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
