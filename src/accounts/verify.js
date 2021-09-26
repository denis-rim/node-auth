import crypto from "crypto";

const { ROOT_DOMAIN, JWT_SIGNATURE } = process.env;

export async function createVerifyEmailToken(email) {
  try {
    // Auth string, JWT signature, email
    const authString = `${JWT_SIGNATURE}:${email}`;
    return crypto.createHash("sha256").update(authString).digest("hex");
  } catch (e) {
    console.error(e);
  }
}

export async function createVerifyEmailLink(email) {
  try {
    // Create token
    const emailToken = await createVerifyEmailToken(email);
    // Encode url string
    const URIEncodedEmail = encodeURIComponent(email);
    // Return link for verification
    return `https://${ROOT_DOMAIN}/verify/${URIEncodedEmail}/${emailToken}`;
  } catch (e) {
    console.error(e);
  }
}
