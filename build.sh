#!/bin/sh

bun build src/index.ts --outdir=dist --outfile=dist/index.mjs --target node --sourcemap=external --external '*' --minify
