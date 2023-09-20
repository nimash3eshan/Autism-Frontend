import Head from "next/head";
import {
  Box,
  Container,
  Unstable_Grid2 as Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => (
  <>
    <Head>
      <title>AutismSense: Early Autism Detection & Insights</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="xl">
        {/* Introduction */}
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome to AutismSense
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Your trusted companion for early autism detection and support.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Features */}
        <Grid container spacing={4}>
          {[
            {
              title: "Early Detection",
              description:
                "Utilize advanced algorithms and expert-approved assessments for accurate and early autism detection.",
            },
            {
              title: "Personalized Insights",
              description:
                "Gain a deeper understanding of your child's unique characteristics, helping in tailored care and support.",
            },
            {
              title: "Community Support",
              description:
                "Connect with a community of experts and parents. Share stories, ask questions, and find valuable resources.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Call to Action */}
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Button variant="contained" color="primary" size="large" sx={{ fontWeight: 600, px: 5 }}>
            Start Your Assessment Now
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Join thousands of parents in providing the best support to their children.
          </Typography>
        </Box>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
