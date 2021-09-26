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

export async function validateVerifyEmail(token, email) {
  try {
    // Create a hash aka token
    const emailToken = await createVerifyEmailToken(email);
    // Compare hash with token
    const isValid = emailToken === token;
    // If successful, update user, to make them verified
    if (isValid) {
      // Update user to make them verified
      const { user } = await import("../user/user.js");
      await user.updateOne(
        {
          "email.address": email,
        },
        {
          $set: { "email.verified": true },
        }
      );
      // Return success
      return true;
    }
    // Return failed
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}
