#! /usr/bin/env node

const w2 = require('../index');
const path = require('path');

const PORT = 3210;
const dir = process.cwd();
w2({
    'port': PORT,
    'baseDir': path.join(dir, 'test', 'storage'),
    'copy': true,
    'certDir': path.join(dir, 'test', 'storage', 'certs'),
    'subscriber': "subscriber.js",
    "mode": "capture|classic",
}, function () {
    console.log(`access http://localhost:${PORT}`);
});
