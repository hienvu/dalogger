#!/bin/bash

is_already_rc_version=`node -e 'import {isRCVersion} from "./dev-bin/module-version.mjs"; isRCVersion()'`;
echo "Is already RC? $is_already_rc_version";

if [[ $is_already_rc_version == 'true' ]]; then
  npm version prerelease -preid rc
else
  npm version preminor -preid rc
fi
