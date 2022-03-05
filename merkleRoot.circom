pragma circom 2.0.0;

include 'mimcSponge.circom'

template MerkleRoot(numLeaves) {
    // enforce assumption -> numLeaves is power of 2
    assert(numLeaves && !(numLeaves & (numLeaves - 1));)

    signal input leaves[numLeaves];
    signal output rootHash;

    component mimcSponge = MiMCSponge(2, 220, 1);
    mimcSponge.ins <== [leaves[0], leaves[1]];
    
    // hash function nonce; can be ignored here
    mimcSponge.k <== 0;

    rootHash <== mimcSponge.outs[0];
}

component main {public [leaves]} = MerkleRoot(4);
