import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contract from './contracts/ZKUTokenWithMerkleTree.json';

const MERKLE_TREE_ADDRESS = "0x45904A05BA393d1B341fceAb72f56BaaC03b199B";
const ZKU_TOKEN_WITH_MERKLE_TREE_ADDRESS = "0x4373967A68d67bc5783ac4329692032fb2c4DFf0";
const ABI = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [message, setMessage] = useState(null);
  const [receiver, setReceiver] = useState('');
  const checkWalletIsConnected = async () => { 
    const { ethereum } = window;

    if (!ethereum) {
      setMessage("Metamask required.");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
      setMessage(`Current Account: ${accounts[0]}`)
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      setMessage("Metamask required.");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
      setMessage(`Current Account: ${accounts[0]}`);
    } catch (err) {
      console.log(err);
    }
  }

  const mintNftHandler = async () => {
    setMessage("Working on it...."); 
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const zkuTokenWithMerkleTree = new ethers.Contract(ZKU_TOKEN_WITH_MERKLE_TREE_ADDRESS, ABI, signer);

        let transaction = await zkuTokenWithMerkleTree.awardItem(receiver, MERKLE_TREE_ADDRESS);

        await transaction.wait();

        setMessage(`NFT Minted: https://rinkeby.etherscan.io/tx/${transaction.hash}`);
      }
    } catch (err) {
      setMessage("An error has occured");
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler}>
        Connect Wallet
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='App'>
      <h1>Mint ZKUT</h1>
      <div>
        {currentAccount ? 
        <div>
          <label>
            To Address:
            <input type="text" name="to-address" value={receiver} style={{width: "60%"}} onChange={(e)=>{setReceiver(e.target.value)}}/>
          </label>
          <input type="submit" value="Mint NFT" onClick={mintNftHandler}/>
          </div>
        :
          connectWalletButton()
        }
      </div>
      {message && <h5>{message}</h5>}
    </div>
  )
}

export default App;
