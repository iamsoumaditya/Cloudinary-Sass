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

type Props = {
username?: string|null;
};

export default function NewsletterSubscribeEmail({ username="" }: Props) {
return (
  <Html>
    {" "}
    <Head /> <Preview>You're Subscribed to Media Refine Newsletter</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Welcome to Media Refine</Heading>

        <Text style={text}>Hi {username},</Text>

        <Text style={text}>
          Thank you for subscribing to the <b>Media Refine Newsletter</b>!
          You're now part of our creative community.
        </Text>

        <Text style={text}>Here's what you can expect from us:</Text>

        <Section style={listSection}>
          <Text style={listItem}>✨ Editing tips & pro techniques</Text>
          <Text style={listItem}>🆕 New tools & feature launches</Text>
          <Text style={listItem}>📚 Tutorials & learning guides</Text>
        </Section>

        <Button href={`${process.env.HOST_URL}/`} style={button}>
          Explore Media Refine
        </Button>

        <Hr style={hr} />

        <Text style={footer}>
          If you didn't subscribe, you can safely ignore this email.
        </Text>

        <Text style={footer}>— Team Media Refine 💙</Text>
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

const listSection = {
marginBottom: "20px",
};

const listItem = {
fontSize: "14px",
marginBottom: "8px",
color: "#444",
};

const button = {
backgroundColor: "#0ea5e9",
color: "#ffffff",
padding: "12px 20px",
borderRadius: "8px",
textDecoration: "none",
display: "inline-block",
marginTop: "10px",
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
