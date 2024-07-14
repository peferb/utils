# ethereum
_Generate Ethereum wallet script_

## Features
- generate n wallets
- log addresses or write to file (logs by default)
- output includes private key, address and mnemonic
- can require match in end
- can require match in start
- can require chars included in address
- case-sensitive or case-insensitive 

## Install
```zsh
npm i
```

## How to use
### Examples
#### Generate a wallet
```zsh
node generate-wallet
```

#### Address including word (case insensitive) 
```zsh
node generate-wallet --includes=ETH --ignoreCasing
```

#### Output three wallets with addresses which ends with "42" to file 
```zsh
node generate-wallet --wallets=3 --endsWith=42 --writeToFile
# Outputs to "./tmp/unixtime.txt"
```

### Available args
```
--wallets=10
# number of wallets you want to generate

--startsWith=42
# filter addresses starting with string
# output example: 0x4249E400a2FdbdcD81a7F44bBD7da099Ce7423E6

--endsWith=42
# filter addresses ending with string
# output example: 0x8b7B7Eec6e3dEFE6e14A44C66d7DBa8D5Ef44E42

--includes=42
# filter adresses on text string included anywhere in the adresses 
# output example: 0x8eCbc28b7B5DE037787536EE404209F676aD2e56

--ignoreCasing
# optional when using text filtering args  

--writeToFile
# output to temp file "./tmp/{unixtime}.txt" instead of log  
```
