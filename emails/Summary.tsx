import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { SummaryProps } from "@/types";
import { formatFullDate, formatISODateToDDMMYYYY } from "@/utils/functs";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/static/logo.png`
  : "https://i.postimg.cc/vm9R1YNT/logo.png";

export default function Summary({
  id,
  startTime,
  endTime,
  first_name,
}: SummaryProps) {
  return (
    <Html>
      <Head />
      <Preview>Session #{id?.toString() || "12"} Summary</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* <Section style={imageSection}> */}
          <Img
            style={image}
            src={baseUrl}
            width="90"
            height="90"
            alt="Xaminate's Logo"
          />
          {/* </Section> */}
          <Section style={mainSection}>
            <Text style={salutation}>Dear {first_name || "Isaac"},</Text>
            <Text style={mainText}>
              Session #{id?.toString() || "12"} started on{" "}
              <Text style={boldenText}>
                {formatFullDate(startTime || new Date().toISOString())}
              </Text>{" "}
              <Text style={subText}>and ended on</Text>{" "}
              <Text style={boldenText}>
                {formatFullDate(endTime || new Date().toISOString())}
              </Text>
              .
              <Text style={summaryText}>
                Kindly find attached is a pdf containing a summary of the
                session.
              </Text>
            </Text>
            {/* <Text style={codeText}>{otp}</Text>
            <Text style={validityText}>This code is valid for 15 minutes</Text> */}
          </Section>
          <Hr style={hr} />
          <Section style={lowerSection}>
            <Text style={cautionText}>
              Ignore this email if you didn't make this request
            </Text>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Xaminate. All Rights Reserved
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#1E1E1E",
  color: "#FFFFFF",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const container = {
  padding: "20px",
  width: "500px",
  maxWidth: "100%",
  backgroundColor: "#2C2C2C",
  borderRadius: "0.6rem",
  margin: "2rem auto",
};

const image = {
  textAlign: "center" as const,
  margin: "0 auto",
};

const mainSection = {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "stretch",
};

const h1 = {
  color: "#FFFFFF",
  fontSize: "1.9rem",
  fontWeight: "500",
  textAlign: "center" as const,
};

const text = {
  color: "#FFF",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
};

const salutation = { ...text, fontWeight: "300" };
const boldenText = { ...text, fontWeight: "500", display: "inline" };

const subText = { ...text, fontWeight: "300", display: "inline" };

const summaryText = {
  ...text,
  fontWeight: "300",
  margin: "1.5rem 0",
};
const mainText = {
  ...text,
  fontWeight: "300",
  textAlign: "center" as const,
  display: "inline",
};

const codeText = {
  ...text,
  fontWeight: "500",
  fontSize: "36px",
  color: "#4CAF50",
  margin: "1.5rem auto 0.5rem",
  textAlign: "center" as const,
};

const validityText = {
  ...text,
  margin: "0 auto",
  fontSize: "13px",
  fontWeight: "200",
  textAlign: "center" as const,
};

const hr = {
  borderTop: "7px dotted #888",
  borderBottom: "none",
  width: "100%",
  margin: "1rem auto 0.8rem" as const,
};

const lowerSection = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  gap: "0.8rem",
  margin: "0 auto",
};

const cautionText = {
  ...text,
  fontSize: "13px",
  color: "gray",
  margin: "0 auto",
  textAlign: "center" as const,
};

const footerText = {
  ...text,
  fontSize: "10px",
  fontWeight: "500",
  textAlign: "center" as const,
};
