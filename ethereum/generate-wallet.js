const fs = require('fs');
const ethers = require('ethers')
const minimist = require('minimist')

const defaultValues = {
  wallets: 1,
  endsWidth: false,
  startsWidth: false,
  writeToFile: false,
}
const argv = {...defaultValues, ...minimist(process.argv.slice(2))}

let wallets = [],
  iteration = 0
do {
  iteration++
  console.clear()
  console.log(`try #${iteration}`)
  console.log(`${wallets.length} of ${argv.wallets} found`)

  const wallet = new ethers.Wallet.createRandom()
  let match = false
  switch (true) {
    case !argv.startsWidth && !argv.endsWidth:
      match = true
      break
    case argv.startsWidth && wallet.address.startsWith(argv.startsWidth):
      match = true
    case argv.endsWidth && wallet.address.endsWith(argv.endsWidth):
      match = true
  }

  if (match) {
    wallets.push(wallet)
  }
} while (wallets.length < argv.wallets)

console.clear()
if (argv.writeToFile) {
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp");
  }
  const unixTime = Math.floor(new Date().getTime() / 1000)
  const file = `./tmp/${unixTime}.txt`
  console.log(`Tried ${iteration} wallets, ${wallets.length} matched criteria\nWriting to file "${file}"`)
  let stream = fs.createWriteStream(file);
  stream.once('open', function (fd) {
    stream.write(`ETHEREUM ADDRESSES\n`)
    delete argv._
    stream.write(`args: ${JSON.stringify(argv, null, 4)}\n\n`)
    wallets.forEach(wallet => {
      stream.write(`ADDRESS: ${wallet.address}\n`)
      stream.write(`MNEMONIC: ${wallet.mnemonic.phrase}\n`)
      stream.write(`PRIVATE KEY: ${wallet.privateKey}\n\n`)
    })
    stream.end();
    console.log(`Done!`)
  });
} else {
  wallets.forEach(wallet => {
    console.log(`ADDRESS: ${wallet.address}`)
    console.log(`MNEMONIC: ${wallet.mnemonic.phrase}`)
    console.log(`PRIVATE KEY: ${wallet.privateKey}\n`)
  })
  console.log(`Done!\nTried ${iteration} wallets, ${wallets.length} matched criteria`)
}

