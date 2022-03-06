# compile the circuit
circom merkleRoot.circom --r1cs --wasm --sym --c

# compute witness
cd merkleRoot_js
node generate_witness.js merkleRoot.wasm ../input.json ../witness.wtns

cd ..

# powers of tau ceremony - necessary randomness required for Groth16 zkSNARK setup
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v

snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
snarkjs groth16 setup merkleRoot.r1cs pot12_final.ptau 00.zkey
snarkjs zkey contribute 00.zkey 01.zkey --name="1st Contributor Name" -v

# export the verification key
snarkjs zkey export verificationkey 01.zkey verification_key.json

# generate proof
snarkjs groth16 prove 01.zkey witness.wtns proof.json public.json

# verify proof
snarkjs groth16 verify verification_key.json public.json proof.json
