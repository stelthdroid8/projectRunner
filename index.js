#!/usr/bin/env node
const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const prog = require('caporal');

prog
  .version('0.0.1')
  .argument('[filename]', 'Name of a file to execute')
  .action(({ filename }) => {
    const name = filename || 'index.js';
    const start = debounce(() => {
      console.log('starting');
    }, 100);
    chokidar
      .watch('.')
      .on('add', start)
      .on('change', start)
      .on('unlink', start);
  });

prog.parse(process.argv);
