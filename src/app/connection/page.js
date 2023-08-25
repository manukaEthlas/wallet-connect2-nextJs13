"use client";
import Button from "@/components/Button";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useWalletClient } from "wagmi";
import { disconnect } from "@wagmi/core";
const Web3 = require("web3");

export default function Connection() {
  const { open, close } = useWeb3Modal();
  const { address, isConnected, isDisconnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const disconnectWallet = async () => {
    await disconnect();
  };

  const forceReconnectMetamask = async () => {
    await walletClient?.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
  };

  const signMessage = async () => {
    const web3 = new Web3(walletClient);
    const message = "Hello World";
    const signature = await web3.eth.personal.sign(message, address);
    alert(signature);
  };

  const getErc20TokenName = async () => {
    const contractAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
    const abi = [
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const web3 = new Web3(walletClient);
    const contract = new web3.eth.Contract(abi, contractAddress);
    const name = await contract.methods.name().call();
    alert(name);
  };

  const increaseAllowanceErc20Token = async () => {
    const contractAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
    const spenderAddress = "0x26707D61391B9064477d02b34a9cda1db58d0AeF";

    const erc20ApproveAbi = [
      {
        constant: false,
        inputs: [
          {
            name: "_spender",
            type: "address",
          },
          {
            name: "_value",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            name: "success",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const web3 = new Web3(walletClient);
    const contract = new web3.eth.Contract(erc20ApproveAbi, contractAddress);

    const ctxTx = await contract.methods.approve(spenderAddress, "0");

    const gasLimit = await ctxTx.estimateGas({
      from: address,
    });

    let gasPrice = await web3.eth.getGasPrice();

    gasPrice = web3.utils.toHex(
      web3.utils
        .toBN(gasPrice)
        .mul(web3.utils.toBN(13))
        .div(web3.utils.toBN(10))
        .toString()
    );

    const contractRes = await ctxTx.send({
      from: address,
      gasLimit,
      gasPrice,
    });

    alert(JSON.stringify(contractRes));
  };

  return (
    <div className="flex h-[100vh] flex-col bg-white justify-center items-center p-4 gap-4">
      <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white">
        <p>Address - {address}</p>
        <p>Is Connected - {isConnected.toString()}</p>
        <p>Is Disconnected - {isDisconnected.toString()}</p>
      </div>
      <Button onClick={open}>Connect</Button>

      <Button onClick={disconnectWallet}>Disconnect</Button>

      <Button onClick={forceReconnectMetamask}>Force reconnect metamask</Button>

      <Button onClick={signMessage}>Sign Message</Button>

      <Button onClick={getErc20TokenName}>Get ERC20 Token Name</Button>

      <Button onClick={increaseAllowanceErc20Token}>
        Increase Allowance ERC20 Token
      </Button>
    </div>
  );
}
