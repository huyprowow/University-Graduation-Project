"use client";

import { useOverview } from "@/hook/overview";
import { formatCurrency } from "@/utils/utils";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OrdersByDayChartProps = {
  data: {
    date: string;
    totalSales: number;
  }[];
};

export function OrdersByDayChart({ data }: OrdersByDayChartProps) {
  return (
   
  );
}
const Admin = () => {
  const { data: session } = useSession();
  const { loading, overview, getOverview } = useOverview();
  useEffect(() => {
    getOverview();
  }, [overview?.length]);

  console.log(session);
  return (
    <>
      <h1>Overview</h1>
      <Box
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 100px)",
        }}
      >
        <Grid container spacing={2} sx={{ marginBottom: 5 }}>
          <Grid
            item
            xs={6}
            sx={{
              height: "100%",
            }}
          >
            <Item>
              <Typography variant="h6" gutterBottom>
                Total Product
              </Typography>
              <div
                style={{
                  fontSize: 20,
                }}
              >
                {overview?.totalProduct}
              </div>
            </Item>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              height: "100%",
            }}
          >
            <Item>
              <Typography variant="h6" gutterBottom>
                Total Revenue
              </Typography>
              <div
                style={{
                  fontSize: 20,
                }}
              >
                {overview?.totalRevenue}
              </div>
            </Item>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              height: "100%",
            }}
          >
            <Item>
              <Typography variant="h6" gutterBottom>
                Total Ordered
              </Typography>
              <div
                style={{
                  fontSize: 20,
                }}
              >
                {overview?.totalOrdered}
              </div>
            </Item>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              height: "100%",
            }}
          >
            <Item>
              <Typography variant="h6" gutterBottom>
                Total User
              </Typography>
              <div
                style={{
                  fontSize: 20,
                }}
              >
                {overview?.totalUser}
              </div>
            </Item>
          </Grid>
        </Grid>
        <ResponsiveContainer width="100%" height={300}>
      <LineChart data={overview?.dailySales}>
        <CartesianGrid />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(tick) => formatCurrency(tick)} />
        <Tooltip formatter={(value) => formatCurrency(value as number)} />
        <Line
          dot={false}
          dataKey="totalSales"
          type="monotone"
          name="Total Sales"
        />
      </LineChart>
    </ResponsiveContainer>
       
      </Box>
    </>
  );
};

export default Admin;
