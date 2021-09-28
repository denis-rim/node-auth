import crypto from "crypto";

const { ROOT_DOMAIN, JWT_SIGNATURE } = process.env;

function createResetToken(email, expirationTimestamp) {
  // Auth string, JWT signature, email
  const authString = `${JWT_SIGNATURE}:${email}:${expirationTimestamp}`;
  return crypto.createHash("sha256").update(authString).digest("hex");
}

export async function createResetEmailLink(email) {
  try {
    // Encode url string
    const URIEncodedEmail = encodeURIComponent(email);
    // Create expiration timestamp
    const expirationTimestamp = Date.now() + 24 * 60 * 60 * 1000;
    // Create token
    const token = createResetToken(email, expirationTimestamp);
    // Link contains user email, token, token expiration date
    return `https://${ROOT_DOMAIN}/reset/${URIEncodedEmail}/${expirationTimestamp}/${token}`;
  } catch (e) {
    console.error(e);
  }
}

export async function createResetLink(email) {
  try {
    const { user } = await import("../user/user.js");
    // Check to see if a user exist with that email
    const foundUser = await user.findOne({
      "email.address": email,
    });
    // If user exist create email link. Link contains user email, token, token expiration date
    if (foundUser) {
      const link = await createResetEmailLink(email);
      return link;
    }

    return "";
  } catch (e) {
    console.error(e);
    return false;
  }
}
