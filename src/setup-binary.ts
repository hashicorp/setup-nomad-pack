import * as core from "@actions/core";
import * as hc from "@hashicorp/js-releases";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import * as sys from "./system";
import cp from "child_process";
import path from "path";
import {ok} from "assert";

const USER_AGENT = "setup-nomad-pack (GitHub Actions)";
const BINARY_NAME = "nomad-pack";

export async function setupBinary() {
  const versionSpec = core.getInput("version");

  let binaryPath = await fetchBinary(versionSpec);

  core.info(`Adding ` + BINARY_NAME + ` to PATH.`);
  core.addPath(binaryPath);

  let binary = await io.which(BINARY_NAME);
  let binaryVersion = (cp.execSync(`${binary} version`) || "").toString();
  core.info(binaryVersion);

  core.setOutput("version", parseVersion(binaryVersion));
}

export async function fetchBinary(versionSpec: string): Promise<string> {
  const osPlatform = sys.getPlatform();
  const osArch = sys.getArch();
  const tmpDir = getTempDir();

  let binaryPath: string;

  core.info(
    `Finding an application version that matches version spec '${versionSpec}'.`
  );
  let release = await hc.getRelease(BINARY_NAME, versionSpec, USER_AGENT);

  const version = release.version;
  core.info(`Found ` + BINARY_NAME + ` ${version}.`);

  core.info(`Checking cache for ` + BINARY_NAME + ` ${version}.`);
  const cacheToolName = BINARY_NAME + `_${osPlatform}`;
  binaryPath = tc.find(cacheToolName, version);
  core.debug(`Cache tool name: ${cacheToolName}`);

  if (binaryPath) {
    core.info(
      `Found ` + BINARY_NAME + ` ${version} in cache at ${binaryPath}.`
    );
    return binaryPath;
  }

  core.info(BINARY_NAME + ` ${version} not found in cache.`);

  core.info(`Getting download URL for ` + BINARY_NAME + ` ${version}.`);
  let build = release.getBuild(osPlatform, osArch);
  core.debug(`Download URL: ${build.url}`);

  core.info(`Downloading ${build.filename}.`);
  let downloadPath = path.join(tmpDir, build.filename);
  await release.download(build.url, downloadPath, USER_AGENT);
  core.debug(`Download path: ${downloadPath}`);

  core.info(`Verifying ${build.filename}.`);
  await release.verify(downloadPath, build.filename);

  core.info(`Extracting ${build.filename}.`);
  const extractedPath = await tc.extractZip(downloadPath);
  core.debug(`Extracted path: ${extractedPath}`);

  binaryPath = await tc.cacheDir(extractedPath, cacheToolName, version);
  core.info(`Cached ` + BINARY_NAME + `_${version} at ${binaryPath}.`);

  return binaryPath;
}

export function parseVersion(version: string): string {
  return version.split("\n")[0].split(" ")[1];
}

function getTempDir(): string {
  const tmpDir = process.env["RUNNER_TEMP"] || "";
  ok(tmpDir, "Expected RUNNER_TEMP to be defined");
  return tmpDir;
}
