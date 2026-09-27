import { createApp } from "./app.js";
const port = Number(process.env.PORT || 3000);
const production = process.env.NODE_ENV === "production";
if (production && !process.env.APP_ORIGIN)
  throw new Error("Set APP_ORIGIN to your HTTPS website URL.");
const { app, db } = await createApp({
  production,
  origin: process.env.APP_ORIGIN || `http://localhost:${port}`,
  dataDir: process.env.DATA_DIR,
  encryptionKey: process.env.DATA_KEY,
});
const server = app.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.log(`Portfolio running at http://localhost:${port}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(() => {
      db.close();
      process.exit(0);
    }),
  );
