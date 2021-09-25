import jwt from "jsonwebtoken";

const JWTSignature = process.env.JWT_SIGNATURE;

export async function logUserOut(request, reply) {
  try {
    const { session } = await import("../session/session.js");
    // Get refresh token
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      // Decode access token
      const { sessionToken } = jwt.verify(refreshToken, JWTSignature);
      // Delete database record for session
      await session.deleteOne({ sessionToken });
    }
    // Remove cookies
    reply.clearCookie("refreshToken").clearCookie("accessToken");
  } catch (e) {
    console.error(e);
  }
}
