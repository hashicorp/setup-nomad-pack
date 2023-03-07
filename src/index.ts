/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import * as core from "@actions/core";
import {setupBinary} from "./setup-binary";

async function main() {
  try {
    await setupBinary();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

main();
