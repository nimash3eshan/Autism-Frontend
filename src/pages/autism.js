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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import MicIcon from "@mui/icons-material/Mic";
import { useRef, useState, useEffect } from "react";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

const Page = () => {
  const fileInputRef = useRef(null);
  const [processing, setProcessing] = useState(false);

  const [autismResult, setAutismResult] = useState(null);
  const [fileName, setFileName] = useState(null);

  // Load table data from localStorage on component mount
  const [tableData2, setTableData2] = useState(
    JSON.parse(localStorage.getItem("tableData2")) || []
  );

  // Update tableData in localStorage when new predictions are available
  useEffect(() => {
    if (autismResult !== null) {
      const newData = {
        fileName,
        autismResult,
      };
      setTableData2((prevData) => {
        const updatedData = [...prevData, newData];
        localStorage.setItem("tableData2", JSON.stringify(updatedData));
        return updatedData;
      });
    }
  }, [autismResult, fileName]);

  const handleFileUpload = async () => {
    const file = fileInputRef.current.files[0];

    // Extract the file name without extension
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    setFileName(fileName);

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
          fileInputRef.current.value = "";
        } else {
          const errorText = await response.text();
          fileInputRef.current.value = "";
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
              {tableData2 !== null && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Voice Name</TableCell>
                        <TableCell>Anomaly Classification</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData2.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.fileName}</TableCell>
                          <TableCell>{row.autismResult}</TableCell>
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
