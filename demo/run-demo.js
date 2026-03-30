const path = require("path");
const gitclaw = require("gitclaw");

async function main() {
  const agentRoot = path.join(__dirname, "..");
  const targetFile = path.join(__dirname, "bad-code.js");

  const runnerFn = gitclaw.runAgent || (gitclaw.default && gitclaw.default.runAgent);
  if (typeof runnerFn === "function") {
    const review = await runnerFn({ agentPath: agentRoot, target: targetFile });
    console.log(JSON.stringify(review, null, 2));
    return;
  }

  const AgentRunner = gitclaw.AgentRunner || (gitclaw.default && gitclaw.default.AgentRunner);
  if (AgentRunner) {
    const runner = new AgentRunner({ agentPath: agentRoot });
    const review = await (typeof runner.reviewFile === "function"
      ? runner.reviewFile(targetFile)
      : runner.run({ target: targetFile }));
    console.log(JSON.stringify(review, null, 2));
    return;
  }

  throw new Error(
    "gitclaw API not recognized. Please update run-demo.js to call the correct runner."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
