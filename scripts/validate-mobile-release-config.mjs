import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

const metadata = readJson('version.json');
const appConfig = readJson('apps/mobile/app.json');
const easConfig = readJson('apps/mobile/eas.json');
const expo = appConfig.expo ?? {};
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const releaseVersion = metadata.channel === 'stable'
  ? metadata.version
  : `${metadata.version}-${metadata.channel}.${metadata.iteration}`;

expect(expo.name === 'Vanta', 'Expo app name must be Vanta.');
expect(expo.slug === 'vanta-mobile', 'Expo slug must remain vanta-mobile.');
expect(expo.scheme === 'vanta', 'Native deep-link scheme must be vanta.');
expect(expo.version === metadata.version, `Native marketing version must be ${metadata.version}.`);
expect(expo.ios?.bundleIdentifier === 'com.marcosmxp.vanta', 'Unexpected iOS bundle identifier.');
expect(expo.ios?.buildNumber === String(metadata.build), `iOS build number must be ${metadata.build}.`);
expect(expo.android?.package === 'com.marcosmxp.vanta', 'Unexpected Android application ID.');
expect(expo.android?.versionCode === metadata.build, `Android versionCode must be ${metadata.build}.`);

const expectedProfiles = {
  development: { environment: 'development', publicEnvironment: 'development', apk: true },
  preview: { environment: 'preview', publicEnvironment: 'staging', apk: true },
  production: { environment: 'production', publicEnvironment: 'production', apk: false },
};

for (const [name, expected] of Object.entries(expectedProfiles)) {
  const profile = easConfig.build?.[name];
  expect(Boolean(profile), `Missing EAS build profile: ${name}.`);
  if (!profile) continue;

  expect(profile.environment === expected.environment, `${name} must use EAS environment ${expected.environment}.`);
  expect(
    profile.env?.EXPO_PUBLIC_VANTA_ENV === expected.publicEnvironment,
    `${name} must set EXPO_PUBLIC_VANTA_ENV=${expected.publicEnvironment}.`,
  );

  if (expected.apk) {
    expect(profile.distribution === 'internal', `${name} must use internal distribution.`);
    expect(profile.android?.buildType === 'apk', `${name} Android builds must be installable APKs.`);
  } else {
    expect(profile.distribution !== 'internal', 'production must not use internal distribution.');
    expect(profile.android?.buildType !== 'apk', 'production must keep the store-oriented Android AAB default.');
  }

  expect(
    profile.env?.EXPO_PUBLIC_VANTA_API_URL === undefined,
    `${name} must not hard-code EXPO_PUBLIC_VANTA_API_URL in eas.json; inject it through the matching EAS environment.`,
  );

  const secretLike = /(secret|password|token|private|database|redis|encryption|lookup|credential|api[_-]?key)/i;
  for (const key of Object.keys(profile.env ?? {})) {
    expect(!secretLike.test(key), `${name} contains a secret-like environment key in source control: ${key}.`);
  }
}

expect(easConfig.cli?.requireCommit === true, 'EAS CLI must require a committed working tree before remote builds.');

if (failures.length > 0) {
  console.error('Vanta native release configuration validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Vanta native release configuration is valid for ${releaseVersion} build ${metadata.build}.`);
console.log('API URLs remain externally injected and regulated mutation surfaces remain outside build configuration.');
