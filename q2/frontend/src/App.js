import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contract from './contracts/ZKUTokenWithMerkleTree.json';
import vKey from './circuits/verification_key.json';

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

  // const generateProof = async (leaves) => {
  //   const { snarkjs } = window;
  //   setMessage(message + `\n Generating proof...`);
  //   const wasm = "http://localhost:8000/circuits/merkleRoot.wasm"
  //   const zkey = "http://localhost:8000/circuits/01.zkey"
  //   const { proof, publicSignals } = await snarkjs.groth16.fullProve({leaves: leaves}, wasm, zkey);

  //   console.log(proof);

  //   setMessage(`Proof generatate....see proof.json in console`)
  //   console.log(JSON.stringify(proof, null, 1));

  //   const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  //   if (res === true) {
  //       console.log("Verification OK");
  //       setMessage(message + `\n Proof valid!`);
  //   } else {
  //       console.log("Invalid proof");
  //       setMessage(message + `\n Proof invalid!`);
  //   }
  // }

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
          console.log(leaves);
          setMessage(message + `\n Merkle Tree Leaves generated.. see console`);
          // generateProof(leaves);
        });

        await transaction.wait();

        setMessage(message + `\n NFT Minted: https://rinkeby.etherscan.io/tx/${transaction.hash}`);
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
      {message && <h5 className="message">{message}</h5>}
    </div>
  )
}

export default App;
