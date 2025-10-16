import modulePackage from '../package.json' with { type: 'json' };

export function version() {
  console.info(modulePackage.version);
}

//RC stands for Release Candidate
export function isRCVersion() {
  console.info(modulePackage.version.match(/-rc\.\d+/) ? true : false);
}
