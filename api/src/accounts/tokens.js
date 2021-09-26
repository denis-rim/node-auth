import jwt from "jsonwebtoken";

const JWTSignature = process.env.JWT_SIGNATURE;

export async function createTokens(sessionToken, userId) {
  try {
    // Create Refresh Token
    // Session Id
    const refreshToken = jwt.sign(
      {
        sessionToken,
      },
      JWTSignature
    );
    // Create Access Token
    // Session Id, User Id
    const accessToken = jwt.sign(
      {
        sessionToken,
        userId,
      },
      JWTSignature
    );
    // Return Refresh Token and Access Token
    return { refreshToken, accessToken };
  } catch (e) {
    console.error(e);
  }
}
