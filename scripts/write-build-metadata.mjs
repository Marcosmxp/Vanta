import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const target = process.argv[2] ?? '.release/build-metadata.json';
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8'));
const releaseVersion = metadata.channel === 'stable'
  ? metadata.version
  : `${metadata.version}-${metadata.channel}.${metadata.iteration}`;

const gitSha = process.env.GITHUB_SHA || process.env.VANTA_GIT_SHA || 'unknown';
const shortSha = gitSha === 'unknown' ? 'unknown' : gitSha.slice(0, 7);
const buildDate = process.env.VANTA_BUILD_DATE || new Date().toISOString();
const platform = process.env.VANTA_BUILD_PLATFORM || 'unknown';
const environment = process.env.EXPO_PUBLIC_VANTA_ENV || process.env.VANTA_BUILD_ENVIRONMENT || 'unknown';

const manifest = {
  schemaVersion: 1,
  app: 'Vanta',
  productVersion: metadata.version,
  releaseVersion,
  channel: metadata.channel,
  iteration: metadata.channel === 'stable' ? null : metadata.iteration,
  buildNumber: metadata.build,
  gitSha,
  gitShortSha: shortSha,
  buildDate,
  environment,
  platform,
};

const absoluteTarget = path.join(root, target);
fs.mkdirSync(path.dirname(absoluteTarget), { recursive: true });
fs.writeFileSync(absoluteTarget, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Wrote Vanta build provenance to ${target}.`);
console.log(`${releaseVersion} build ${metadata.build} commit ${shortSha}`);
