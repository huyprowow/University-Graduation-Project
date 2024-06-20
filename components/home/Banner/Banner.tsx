import { Box, Grid } from "@mui/material";
import { Image } from "@nextui-org/react";
import Typewriter from "typewriter-effect";
const Banner = () => {
  return (
    <Grid
      container
      // sx={{
      //   background:
      //     "linear-gradient(184deg, rgba(33,33,36,1) 65%, rgba(41,46,57,1) 100%)",
      // }}
    >
      <Grid item className="grow flex items-center justify-center">
        <Box
          sx={{
            width: 260,
            height: 105,
          }}
        >
          <h1 style={{ fontSize: 65, fontWeight: "bolder" }}>
            <span style={{ color: "#FF00E2" }}>IA</span>
            <span
              style={{
                color: "rgba(0,0,0,0.6)",
                textShadow: "2px 2px 3px rgba(255,255,255,0.5)",
              }}
            >
              Store
            </span>
          </h1>
          <Typewriter
            options={{
              autoStart: true,
              loop: true,
            }}
            onInit={(typewriter) => {
              typewriter
                .pauseFor(2500)
                .typeString("<span>The leading ecommerce platform</span>")
                .pauseFor(1000)
                .start();
            }}
          />
        </Box>
      </Grid>
      <Grid item className="grow flex items-center justify-center">
        <Image
          radius="none"
          alt="banner"
          className="object-cover"
          height={200}
          src="/banner_vr-removebg.png"
        />
      </Grid>
    </Grid>
  );
};

export default Banner;
