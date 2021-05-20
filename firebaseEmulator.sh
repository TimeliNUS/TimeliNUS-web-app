firebase emulators:start --token 1//0geD3sD-B0sdmCgYIARAAGBASNwF-L9IrseqfihLsr1syZ-JhZxBkYBx1bW5ES6jlocLhjyC0AuglV9TlXvyWRLIgITtJpzWx0j0 &
P1=$!
sleep 15 & P2=$!
wait $P2
npm run test:unit
