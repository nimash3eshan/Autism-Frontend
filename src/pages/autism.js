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
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

const Page = () => {
  const fileInputRef = useRef(null);
  const [processing, setProcessing] = useState(false);

  const [autismResult, setAutismResult] = useState(null);

  const handleFileUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      setProcessing(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://127.0.0.1:5000/detect-anomaly", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setAutismResult(data.anomaly_classification);
        } else {
          const errorText = await response.text();
          console.error("Failed to detect anomaly:", errorText);
          alert("Error detecting anomaly: " + errorText);
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
        <title>Autism Prediction</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Autism Prediction</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <Box sx={{ display: "inline-block", ml: 1 }}>
                <label htmlFor="raised-button-file">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    component="span"
                  >
                    Add
                  </Button>
                </label>
              </Box>
            </Stack>

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
              {autismResult && (
                <Typography variant="h6">Anomaly Classification: {autismResult}</Typography>
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
