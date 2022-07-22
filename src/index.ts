import * as core from "@actions/core";
import {setupNomadPack} from "./setup-nomad-pack";

async function main() {
  try {
    await setupNomadPack();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

main();
