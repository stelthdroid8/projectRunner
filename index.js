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
    } catch (err) {
      throw new Error(`Could not find the file: ${name}`);
    }
    let pid;
    const start = debounce(event => {
      if (pid) {
        console.log(chalk.red('------- Ending Process -------'));
        pid.kill();
      }
      console.log(chalk.green('------- Starting Process -------'));
      //   console.log(event);
      pid = spawn('node', [name], { stdio: 'inherit' });
      //   console.log(pid);
    }, 100);

    chokidar
      .watch('.', {
        ignored: /.git.|node_modules/
      })
      .on('add', start)
      .on('change', start)
      .on('unlink', start);
  });

prog.parse(process.argv);
