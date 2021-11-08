const ethers = require('ethers');
const Web3 = require('web3');
const bigNumberToString = require('bignumber-to-string')
const secrets = require('./secrets.json');

const BUSD = "";
const WBNB = "";
const PancakeRouter = "";



const provider = new ethers.providers.WebSocketProvider(secrets.provider,56);
const wallet = new ethers.Wallet(secrets.privatekey);
const signer = wallet.connect(provider);




const tokenABI = [{
  "constant": true,
  "inputs": [
    {
      "name": "_owner",
      "type": "address"
    }
  ],
  "name": "balanceOf",
  "outputs": [
    {
      "name": "balance",
      "type": "uint256"
    }
  ],
  "payable": false,
  "type": "function",
  "gas": "1000000"
}]



const routerContract = new ethers.Contract(
    PancakeRouter,
    [
        'function getAmountsOut(uint amountIn, address[] memory path) public view returns(uint[] memory amounts)',
        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ],
    signer
);


const busdContract = new ethers.Contract(
    BUSD,
    [
        'function approve(address spender, uint256 amount) public returns (bool success)'
    ],
    signer
);

async function main() {

    const BUSDamountIn = ethers.utils.parseUnits('.011', 18);
    let amounts = await routerContract.getAmountsOut(BUSDamountIn, [BUSD, WBNB]);
    const WBNBamountOutMin = amounts[1].sub(amounts[1].div(10));

    console.log(ethers.utils.formatEther(BUSDamountIn));
    console.log(ethers.utils.formatEther(WBNBamountOutMin));

    const contract =  new ethers.Contract("", tokenABI, provider);
    balance = await contract.balanceOf("");


    console.log(ethers.utils.formatEther(balance));


      const approveTx = await busdContract.approve(
          PancakeRouter,
          BUSDamountIn,
          {gasLimit: 325522, gasPrice: 5e9}
      );
      let reciept = await approveTx.wait();
      console.log(reciept);

    const swapTx = await routerContract.swapExactTokensForTokens(
        BUSDamountIn,
        WBNBamountOutMin,
        [BUSD, WBNB],
        wallet.address,
        Date.now() + 1000 * 60 * 10,
        {gasLimit: 325522}
    )

    receipt = await swapTx.wait();
    console.log(receipt);
}

main().then().finally(() => {});
