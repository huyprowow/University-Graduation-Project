// import { Divider } from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { Stack } from "@mui/material";
import { Divider } from "@nextui-org/react";
import "./FooterPage.css";
const FooterPage = () => {
  return (
    <>
      <Divider></Divider>
      <div className="home_footer p-2">
        <section id="contact">
          <div>
            <h2>Contact with me:</h2>
          </div>
          <Stack gap={2} justifyContent={"center"} alignContent={"center"}>
            <a href="tel:+84395534600">
              <PhoneIphoneIcon />
              +84395534600
            </a>
            <a
              href="https://www.facebook.com/huyprowow"
              target="_blank"
              title="Facebook"
              className="flex  gap-2 align-middle"
            >
              <FacebookIcon />
              https://www.facebook.com/huyprowow
            </a>
            <a
              href="mailto:huyprowow@gmail.com"
              className="flex  gap-2 align-middle"
              title="Email for me"
            >
              <AlternateEmailIcon />
              huyprowow@gmail.com
            </a>
            <a
              href="https://github.com/huyprowow"
              target="_blank"
              className="flex  gap-2 align-middle"
              title="GitHub"
            >
              <GitHubIcon />
              https://github.com/huyprowow
            </a>
            <a
              href="https://www.linkedin.com/in/huyprowow"
              target="_blank"
              className="flex  gap-2 align-middle"
              title="linkedin"
            >
              <LinkedInIcon />
              https://www.linkedin.com/in/huyprowow
            </a>
          </Stack>
        </section>
        <p>Huyprowow • Shinigami • Bùi Quang Huy © 2024</p>
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shape-rendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(255,255,255,0.7"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(255,255,255,0.5)"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(255,255,255,0.3)"
            />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
    </>
  );
};

export default FooterPage;
