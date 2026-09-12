#!/usr/bin/env node

import { program } from 'commander';
import packageJson from '../package.json' with { type: 'json' };

program
	.name('gtsync')
	.description(packageJson.description)
	.version(packageJson.version);

program.parse();
