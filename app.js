const API_URL = "https://bsc-dataseed1.ninicoin.io"
const PRIVATE_KEY = "your private key"
const adminWallet = "owner address"

const bnbAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"

const Web3 = require("web3")


const CLOVER_SEEDS_TOKEN = require("./abi/clover_seeds_token_abi.json")

const ABI = CLOVER_SEEDS_TOKEN.abi
const contractAddress = CLOVER_SEEDS_TOKEN.contractAddress

const web3 = new Web3(new Web3.providers.HttpProvider(API_URL))
const contract = new web3.eth.Contract(ABI, contractAddress)

const query = contract.methods.swapFee()
const releaseDuration = 3600 * 1000
const encodeABI = query.encodeABI()
const queryLP = contract.methods.transferLP2Owner()
const encodeLPABI = queryLP.encodeABI()
function releaseTax() {
    console.log()
    web3.eth.accounts.signTransaction({
        data: encodeABI,
        from: adminWallet,
        gas: 3000000,
        to: contractAddress
    },
    PRIVATE_KEY
    ).then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        sentTx.on("receipt", receipt => {
            console.log("Release tax success!")
        });
        sentTx.on("error", err => {
            console.log("Release tax failed!")
        })
    })

    web3.eth.accounts.signTransaction({
        data: encodeLPABI,
        from: adminWallet,
        gas: 3000000,
        to: contractAddress
    },
    PRIVATE_KEY
    ).then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        sentTx.on("receipt", receipt => {
            console.log("LP tokens succesfully transfered!")
        });
        sentTx.on("error", err => {
            console.log("LP transfer failed!")
        })
    })

}

setInterval(releaseTax, releaseDuration)


