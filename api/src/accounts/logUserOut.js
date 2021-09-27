import jwt from "jsonwebtoken";

const { ROOT_DOMAIN, JWT_SIGNATURE } = process.env;

export async function logUserOut(request, reply) {
  try {
    const { session } = await import("../session/session.js");
    // Get refresh token
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      // Decode access token
      const { sessionToken } = jwt.verify(refreshToken, JWT_SIGNATURE);
      // Delete database record for session
      const res = await session.deleteOne({ sessionToken });
    }
    // Remove cookies
    const cookieOptions = {
      path: "/",
      domain: ROOT_DOMAIN,
      httpOnly: true,
      secure: true,
    };

    reply
      .clearCookie("refreshToken", cookieOptions)
      .clearCookie("accessToken", cookieOptions);
  } catch (e) {
    console.error(e);
  }
}
