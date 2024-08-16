'use client'
import nacl from "tweetnacl";
import { useState } from "react";
import { PrimaryButton } from "./components/ui/Buttons";
import {Keypair} from "@solana/web3.js"
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import axios from "axios";



export default function Home() {

  const [publickey, setPublickey] = useState([]);
  const [balance, setBalance] = useState([]);
  
  const [mnemonic, setMnemonic] = useState('');
  
  const createWallet = async () => {
    const newMnemonic = generateMnemonic();
    setMnemonic ( newMnemonic);
    const seed = mnemonicToSeedSync(newMnemonic);
    const newPublicKey:any = [];
    const newBalance:any = [];
    for(let i=0; i<4;i++){
      
    
    
    const path = `m/44'/501'/${i}'/0'`; 
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
   const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
   newPublicKey.push(publicKey);
   await axios.post('https://solana-mainnet.g.alchemy.com/v2/sleiRD8-KgsQ_uHYmWkD095z6E8wmSaP', {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getBalance",
    "params": [`${publicKey}`]
})
.then(response => {
    newBalance.push(response.data.result.value);
})
.catch(error => {
    console.error('Error:', error);
});

    
    }
    setPublickey(newPublicKey);
    setBalance(newBalance);
    console.log(newBalance)
    
    
    
  };
 


  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
       <div>
            <h1>Create your wallet</h1>
            <PrimaryButton onClick={createWallet}>Create</PrimaryButton>
            <p>mneonic:</p>
             <p>{mnemonic}</p>
             <div className="flex gap-3">
             <div className="">
            <p>PublicKey:</p>
            <ul>
              {publickey.map((key,index)=>(
                <li key={index}>{key}</li>
              ))}
              
            </ul></div>
            <div className="">
            <p>Balance:</p>
            <ul>
            {balance.map((bal,index)=>(
                <li key={index}>{bal} sol</li>
              ))}
              </ul>
              </div>
              </div>
        </div>

      
    </main>
  );
}
