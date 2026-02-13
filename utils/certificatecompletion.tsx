import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from "@react-email/components";

type Props = {
  username: string;
  certificateId: string;
};

export default function CertificateCompletionEmail({
  username,
  certificateId,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>🎉 Your Media Refine Certificate is Ready</Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>🎉 Certificate of Completion</Heading>

          <Text style={text}>Hi {username},</Text>

          <Text style={text}>
            Congratulations on completing the{" "}
            <b>Media Refine Editing Studio Course</b>! You've successfully
            finished all modules.
          </Text>

          <Text style={text}>
            📎 Your official certificate is attached to this email. Please
            download it from the attachment.
          </Text>

          <Hr style={hr} />

          <Section>
            <Row>
              <Column>
                <Text style={label}>Course</Text>
              </Column>
              <Column>
                <Text style={value}>Media Refine Editing Studio Mastery</Text>
              </Column>
            </Row>

            <Row>
              <Column>
                <Text style={label}>Certificate ID</Text>
              </Column>
              <Column>
                <Text style={value}>{certificateId}</Text>
              </Column>
            </Row>

            <Row>
              <Column>
                <Text style={label}>Issued To</Text>
              </Column>
              <Column>
                <Text style={value}>{username}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            You can showcase this certificate in your portfolio, resume, or
            social profiles.
          </Text>

          <Text style={footer}>— Team Media Refine 🚀</Text>
        </Container>
      </Body>
    </Html>
  );
}


const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "12px",
  maxWidth: "600px",
};

const heading = {
  fontSize: "26px",
  fontWeight: "bold",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const text = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#333",
  marginBottom: "16px",
};

const label = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#555",
};

const value = {
  fontSize: "14px",
  color: "#111",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "24px 0",
};

const footer = {
  fontSize: "14px",
  marginTop: "24px",
  color: "#666",
  textAlign: "center" as const,
};
