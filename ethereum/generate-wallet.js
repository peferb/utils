const fs = require('fs')
const ethers = require('ethers')
const minimist = require('minimist')
const hex42Regex = new RegExp(/[^a-fA-F 0-9]/g)

const defaultValues = {
  wallets: 1,
  endsWith: undefined,
  startsWith: undefined,
  includes: undefined,
  writeToFile: false,
  ignoreCasing: false
}
const args = {
  ...defaultValues,
  ...minimist(process.argv.slice(2), {
    number: ['wallets'],
    string: ['endsWith', 'startsWith', 'includes'],
    boolean: ['writeToFile', 'ignoreCasing'],
  })
}
delete args._
if (args.startsWith && hex42Regex.test(args.startsWith)) {
  throw new Error('BAD INPUT: --startsWith, only a-z, A-Z and 0-9 allowed')
}
if (args.endsWith && hex42Regex.test(args.endsWith)) {
  throw new Error('BAD INPUT, --endsWith, only a-z, A-Z and 0-9 allowed')
}
if (args.includes && hex42Regex.test(args.includes)) {
  throw new Error('BAD INPUT, --includes, only a-z, A-Z and 0-9 allowed')
}

if (args.ignoreCasing) {
  args.startsWith = args.startsWith ? args.startsWith.toLowerCase() : undefined
  args.endsWith = args.endsWith ? args.endsWith.toLowerCase() : undefined
  args.includes = args.includes ? args.includes.toLowerCase() : undefined
}

let wallets = [],
  iteration = 0
do {
  iteration++
  console.clear()
  console.log(`try #${iteration}`)
  console.log(`${wallets.length} of ${args.wallets} found`)

  const wallet = new ethers.Wallet.createRandom()
  const address = args.ignoreCasing ? wallet.address.toLowerCase() : wallet.address
  let match = false
  switch (true) {
    case !args.startsWith && !args.endsWith && !args.includes:
      match = true
      break
    case args.startsWith && address.startsWith(`0x${args.startsWith}`):
      match = true
    case args.endsWith && address.endsWith(args.endsWith):
      match = true
    case args.includes && address.includes(args.includes):
      match = true
  }

  if (match) {
    wallets.push(wallet)
  }
} while (wallets.length < args.wallets)

console.clear()
if (args.writeToFile) {
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp")
  }
  const unixTime = Math.floor(new Date().getTime() / 1000)
  const file = `./tmp/${unixTime}.txt`
  console.log(`Tried ${iteration} wallets, ${wallets.length} matched criteria\nWriting to file "${file}"`)
  let stream = fs.createWriteStream(file)
  stream.once('open', () => {
    stream.write(`ETHEREUM ADDRESSES\n`)
    stream.write(`generated ${new Date().toUTCString()}\n`)
    stream.write(`args: ${JSON.stringify(args, null, 4)}\n\n`)
    wallets.forEach(wallet => {
      stream.write(`ADDRESS: ${wallet.address}\n`)
      stream.write(`MNEMONIC: ${wallet.mnemonic.phrase}\n`)
      stream.write(`PRIVATE KEY: ${wallet.privateKey}\n\n`)
    })
    stream.end()
    console.log(`Done!`)
  })
} else {
  wallets.forEach(wallet => {
    console.log(`ADDRESS: ${wallet.address}`)
    console.log(`MNEMONIC: ${wallet.mnemonic.phrase}`)
    console.log(`PRIVATE KEY: ${wallet.privateKey}\n`)
  })
  console.log(`Done!\nTried ${iteration} wallets, ${wallets.length} matched criteria`)
}

