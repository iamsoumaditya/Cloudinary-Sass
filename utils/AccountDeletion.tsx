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
Button,
} from "@react-email/components";


export default function AccountDeletionEmail({username=""}: {username?:string|null}) {
return (
  <Html>
    {" "}
    <Head />{" "}
    <Preview>Your account deletion request has been initiated </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Account Deletion Requested</Heading>

        <Text style={text}>Hi {username},</Text>

        <Text style={text}>
          We've received a request to delete your <b>Media Refine</b> account.
        </Text>

        <Text style={text}>
          Your account is now scheduled for permanent deletion.
        </Text>

        <Text style={text}>
          If this request was made by mistake or you change your mind, you can
          cancel the deletion request before we complete the final step.
        </Text>

        <Section style={buttonSection}>
          <Button
            href={`${process.env.HOST_URL}/account-status`}
            style={button}
          >
            Cancel Deletion Request
          </Button>
        </Section>

        <Text style={warning}>
          ⚠️ When your account and all associated data will be permanently
          deleted it cannot be recovered again.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          If you did not request this deletion, please cancel immediately using
          the button above or contact our support team.
        </Text>

        <Text style={footer}>— Team Media Refine</Text>
      </Container>
    </Body>
  </Html>
);
}

/* Styles */

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
fontSize: "24px",
fontWeight: "bold",
textAlign: "center" as const,
marginBottom: "20px",
color: "#dc2626",
};

const text = {
fontSize: "15px",
lineHeight: "1.6",
color: "#333",
marginBottom: "16px",
};

const buttonSection = {
textAlign: "center" as const,
margin: "24px 0",
};

const button = {
backgroundColor: "#0ea5e9",
color: "#ffffff",
padding: "12px 22px",
borderRadius: "8px",
textDecoration: "none",
display: "inline-block",
fontSize: "14px",
};

const warning = {
fontSize: "14px",
color: "#b91c1c",
marginTop: "10px",
lineHeight: "1.6",
};

const hr = {
borderColor: "#e6ebf1",
margin: "24px 0",
};

const footer = {
fontSize: "13px",
color: "#666",
textAlign: "center" as const,
marginTop: "12px",
};
