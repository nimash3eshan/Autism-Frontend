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
import { useEffect, useRef, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";

const Page = () => {
  const fileInputRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [realAge, setRealAge] = useState(null);
  const [isRealAgeGreaterThanPredicted, setIsRealAgeGreaterThanPredicted] = useState(null);
  const [predictedAge, setPredictedAge] = useState(null);
  const [fileName, setFileName] = useState(null);

  // Load table data from localStorage on component mount
  const [tableData, setTableData] = useState(JSON.parse(localStorage.getItem("tableData")) || []);

  // Update tableData in localStorage when new predictions are available
  useEffect(() => {
    if (predictedAge && isRealAgeGreaterThanPredicted !== null) {
      const newData = {
        fileName,
        realAge,
        predictedAge,
        isRealAgeGreaterThanPredicted,
      };
      setTableData((prevData) => {
        const updatedData = [...prevData, newData];
        localStorage.setItem("tableData", JSON.stringify(updatedData));
        return updatedData;
      });
    }
  }, [predictedAge, isRealAgeGreaterThanPredicted]);

  const handleFileUpload = async () => {
    const file = fileInputRef.current.files[0];
    console.log("Selected file:", file);

    // Extract the file name without extension
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    setFileName(fileName);

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
          fileInputRef.current.value = "";
        } else {
          const errorText = await response.text();
          fileInputRef.current.value = "";
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
              {tableData !== null && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Voice Name</TableCell>
                        <TableCell>Real Age</TableCell>
                        <TableCell>Predicted Age</TableCell>
                        <TableCell>Is Real Age &gt; Predicted Age</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.fileName}</TableCell>
                          <TableCell>{row.realAge}</TableCell>
                          <TableCell>{row.predictedAge}</TableCell>
                          <TableCell>{row.isRealAgeGreaterThanPredicted}</TableCell>
                        </TableRow>
                      ))}
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
