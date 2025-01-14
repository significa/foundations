import packageJson from "@/../package.json";

export async function GET() {
  return new Response(
    process.env.APP_VERSION || packageJson.version || "unknown version",
    { status: 200 }
  );
}
