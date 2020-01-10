#!/usr/bin/env node
const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const prog = require('caporal');
const chalk = require('chalk');
const fs = require('fs');
const { spawn } = require('child_process');

prog
  .version('0.0.1')
  .argument('[filename]', 'Name of a file to execute')
  .action(async ({ filename }) => {
    const name = filename || 'index.js';

    try {
      await fs.promises.access(name);
    } catch (error) {
      throw new Error(`Could not find the file: ${name}`);
    }
    let pid;
    const start = debounce(() => {
      if (pid) {
        console.log(chalk.red('------- Ending Process -------'));
        pid.kill();
      }
      console.log(chalk.green('------- Starting Process -------'));
      pid = spawn('node', [name], { stdio: 'inherit' });
    }, 100);

    chokidar
      .watch('.')
      .on('add', start)
      .on('change', start)
      .on('unlink', start);
  });

prog.parse(process.argv);
