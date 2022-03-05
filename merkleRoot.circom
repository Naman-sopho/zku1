pragma circom 2.0.0;

include "helpers/mimcsponge.circom";

template MerkleParent() {
    signal input inputs[2];
    signal output parentHash;

    component mimcSponge = MiMCSponge(2, 220, 1);
    mimcSponge.ins[0] <== inputs[0];
    mimcSponge.ins[1] <== inputs[1];
    // hash function nonce; can be ignored
    mimcSponge.k <== 0;

    parentHash <== mimcSponge.outs[0];
}

template MerkleRoot(nLeaves) {
    // enforce assumption -> numLeaves is power of 2
    assert(nLeaves && !(nLeaves & (nLeaves - 1)));

    signal input leaves[nLeaves];
    signal output rootHash;

    // stores the intermediate and final result values
    component merkleParent[nLeaves - 1];
    for (var i = 0; i < (nLeaves - 1); i++) merkleParent[i] = MerkleParent();
    
    for (var i = 0; i < (nLeaves - 1); i += 2) {
        merkleParent[i/2].inputs[0] <== leaves[i];
        merkleParent[i/2].inputs[1] <== leaves[i+1]; 
    }

    var p = 0;

    for (var i = nLeaves/2; i < (nLeaves - 1); i++) {
        merkleParent[i].inputs[0] <== merkleParent[p].parentHash;
        merkleParent[i].inputs[1] <== merkleParent[p + 1].parentHash;

        p += 2;
    }
    

    rootHash <== merkleParent[nLeaves - 2].parentHash;
}

component main {public [leaves]} = MerkleRoot(4);
