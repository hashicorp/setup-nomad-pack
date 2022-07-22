import * as core from "@actions/core";
import * as hc from "@hashicorp/js-releases";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import * as sys from "./system";
import cp from "child_process";
import path from "path";
import {ok} from "assert";

const USER_AGENT = "setup-nomad-pack (GitHub Actions)";

export async function setupNomadPack() {
  const versionSpec = core.getInput("packer-version");

  let packerPath = await fetchPacker(versionSpec);

  core.info(`Adding Packer to PATH.`);
  core.addPath(packerPath);

  let packer = await io.which("packer");
  let packerVersion = (cp.execSync(`${packer} version`) || "").toString();
  core.info(packerVersion);

  core.setOutput("packer-version", parsePackerVersion(packerVersion));
}

export async function fetchPacker(versionSpec: string): Promise<string> {
  const osPlatform = sys.getPlatform();
  const osArch = sys.getArch();
  const tmpDir = getTempDir();

  let packerPath: string;

  core.info(
    `Finding a Packer version that matches version spec '${versionSpec}'.`
  );
  let release = await hc.getRelease("packer", versionSpec, USER_AGENT);

  const version = release.version;
  core.info(`Found Packer ${version}.`);

  core.info(`Checking cache for Packer ${version}.`);
  const cacheToolName = `packer_${osPlatform}`;
  packerPath = tc.find(cacheToolName, version);
  core.debug(`Cache tool name: ${cacheToolName}`);

  if (packerPath) {
    core.info(`Found Packer ${version} in cache at ${packerPath}.`);
    return packerPath;
  }
  core.info(`Packer ${version} not found in cache.`);

  core.info(`Getting download URL for Packer ${version}.`);
  let build = release.getBuild(osPlatform, osArch);
  core.debug(`Download url: ${build.url}`);

  core.info(`Downloading ${build.filename}.`);
  let downloadPath = path.join(tmpDir, build.filename);
  await release.download(build.url, downloadPath, USER_AGENT);
  core.debug(`Download path: ${downloadPath}`);

  core.info(`Verifying ${build.filename}.`);
  await release.verify(downloadPath, build.filename);

  core.info(`Extracting ${build.filename}.`);
  const extractedPath = await tc.extractZip(downloadPath);
  core.debug(`Extracted path: ${extractedPath}`);

  packerPath = await tc.cacheDir(extractedPath, cacheToolName, version);
  core.info(`Cached Packer ${version} at ${packerPath}.`);

  return packerPath;
}

export function parsePackerVersion(version: string): string {
  return version.split("\n")[0].split(" ")[1];
}

function getTempDir(): string {
  const tmpDir = process.env["RUNNER_TEMP"] || "";
  ok(tmpDir, "Expected RUNNER_TEMP to be defined");
  return tmpDir;
}
