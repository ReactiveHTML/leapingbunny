#!/bin/sh

bun build \
    src/index.ts \
    --outdir=dist \
    --outfile=dist/index.js \
    --target node \
    --sourcemap=external \
    --external 'rxjs-marbles' \
    --minify \
    --watch \
#    &

# tsc --watch --emitDeclarationOnly --project tsconfig.json

wait
