// Local UI fixture. No API request or write is ever forwarded to the application.
// Run the app on 4013, then this server on 4015. Type success/reject/busy/error
// into stdin to choose the next validation response. Nothing is saved.
import http from "node:http";
import readline from "node:readline";

let scenario = "success";
readline.createInterface({ input: process.stdin }).on("line", value => {
  if (["success", "reject", "busy", "error"].includes(value.trim())) {
    scenario = value.trim();
    console.log(`Mock validation: ${scenario}`);
  }
});
http.createServer((req, res) => {
  const path = new URL(req.url, "http://127.0.0.1:4015").pathname;
  const json = (status, body) => {
    res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(JSON.stringify(body));
  };
  if (path.startsWith("/api/")) {
    req.resume(); // Discard test inputs without logging or storing them.
    console.log(`Intercepted ${req.method} ${path}`);
    if (path === "/api/challenge-token") return json(200, { token: "local-ui-fixture" });
    if (path === "/api/submit-smile") return setTimeout(() => json(200, { ok: true }), 600);
    if (path === "/api/validate-smile") {
      const status = scenario === "busy" ? 429 : scenario === "error" ? 503 : 200;
      return setTimeout(() => json(status, { valid: scenario === "success", reason: "Test response: please try a clearer photo." }), 800);
    }
    return json(403, { error: "API blocked by local UI fixture" });
  }
  if (!["GET", "HEAD"].includes(req.method)) return json(405, { error: "Writes blocked" });
  const upstream = http.request({ hostname: "127.0.0.1", port: 4013, path: req.url, method: req.method, headers: { ...req.headers, host: "localhost:4013" } }, response => {
    res.writeHead(response.statusCode, response.headers);
    response.pipe(res);
  });
  upstream.on("error", () => json(502, { error: "Start the website on port 4013 first" }));
  upstream.end();
}).listen(4015, "127.0.0.1", () => console.log("Mock-only preview: http://127.0.0.1:4015/en#assessment"));
