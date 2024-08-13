'use client'
import nacl from "tweetnacl";
import { useState } from "react";
import { PrimaryButton } from "./components/ui/Buttons";
import {Keypair} from "@solana/web3.js"
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";



export default function Home() {

  const [publickey, setPublickey] = useState([]);
  const [mnemonic, setMnemonic] = useState('');
  
  const createWallet = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic ( newMnemonic);
    const seed = mnemonicToSeedSync(newMnemonic);
    const newPublicKey = [];
    for(let i=0; i<4;i++){

    
    
    const path = `m/44'/501'/${i}'/0'`; 
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
   const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
   newPublicKey.push(publicKey);
    
    
    }
    setPublickey(newPublicKey);
  
    
  };


  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
       <div>
            <h1>Create your wallet</h1>
            <PrimaryButton onClick={createWallet}>Create</PrimaryButton>
            <p>mneonic:</p>
             <p>{mnemonic}</p>
            <p>PublicKey:</p>
            <ul>
              {publickey.map((key,index)=>(
                <li key={index}>{key}</li>
              ))}
            </ul>
        </div>

      
    </main>
  );
}
