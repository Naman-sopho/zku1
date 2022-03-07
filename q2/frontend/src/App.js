import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contract from './contracts/ZKUTokenWithMerkleTree.json';

const MERKLE_TREE_ADDRESS = "0x39Fa96f5bC6D9DA5F30bCbFF0D0Fd9e976e85c9a";
const ZKU_TOKEN_WITH_MERKLE_TREE_ADDRESS = "0x80878c0fAe3F64f65dd06d1e49608bBCFf049748";
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

  const generateProof = async (leaves) => {
    console.log(leaves);
    const snarkjs = require('snarkjs');
    const fs = require('fs');
    const { proof, publicSignals } = await snarkjs.groth16.fullProve({leaves: leaves}, "circuit.wasm", "circuit_final.zkey");

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

    const vKey = JSON.parse(fs.readFileSync("verification_key.json"));

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
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

        zkuTokenWithMerkleTree.on('MerkleLeaves', (leaves) => {
          setMessage(message + `\n Merkle Tree Leaves generated`);
          generateProof(leaves);
        });

        await transaction.wait();

        setMessage(`NFT Minted: <href a="https://rinkeby.etherscan.io/tx/${transaction.hash}"/>`);
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
