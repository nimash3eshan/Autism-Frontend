import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRef, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";

const Page = () => {
  const fileInputRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [realAge, setRealAge] = useState(null);
  const [isRealAgeGreaterThanPredicted, setIsRealAgeGreaterThanPredicted] = useState(null);
  const [predictedAge, setPredictedAge] = useState(null);

  const handleFileUpload = async () => {
    const file = fileInputRef.current.files[0];

    if (!realAge) {
      alert("Please enter the baby's real age.");
      return;
    }

    if (file) {
      setProcessing(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://127.0.0.1:5000/predict-age", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setPredictedAge(data.predicted_age);
          setIsRealAgeGreaterThanPredicted(realAge > data.predicted_age ? "Yes" : "No");
        } else {
          const errorText = await response.text();
          console.error("Failed to predict age:", errorText);
          alert("Error predicting age: " + errorText);
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
        <title>Age Prediction</title>
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
                <Typography variant="h4">Age Prediction</Typography>
              </Stack>
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
              <label htmlFor="realAge">Enter Baby&apos;s Real Age:</label>
              <Typography variant="title" color="inherit" noWrap>
                &nbsp;
              </Typography>
              <TextField
                label="Age"
                variant="outlined"
                type="number"
                value={realAge}
                onChange={(e) => setRealAge(e.target.value)}
                sx={{ mb: 2 }}
              />

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
              {predictedAge && isRealAgeGreaterThanPredicted !== null && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Real Age</TableCell>
                        <TableCell>Predicted Age</TableCell>
                        <TableCell>Is Real Age &gt; Predicted Age</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{realAge}</TableCell>
                        <TableCell>{predictedAge}</TableCell>
                        <TableCell>{isRealAgeGreaterThanPredicted}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
