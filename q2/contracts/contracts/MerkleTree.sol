// boilerplate source: https://solidity-by-example.org/app/merkle-tree/
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract MerkleTree {
    bytes32[] public hashes;

    function generateTree(string[4] memory transactions) public returns (bytes32[4] memory) {
        uint n = transactions.length;

        // we cannot skip anything if the hashes array is empty
        if(hashes.length != 0) {
            uint startIndex = n;
            
            for (uint i = 0; i < n - 1; i+=2) {
                bytes32 hash0 = keccak256(abi.encodePacked(transactions[i]));
                bytes32 hash1 = keccak256(abi.encodePacked(transactions[i+1]));

                if (hash0 == hashes[i] && hash1 == hashes[i+1]){
                    // we can skip hash calculation for this parent
                    startIndex += 1;
                } else {
                    // overwriting both is more efficient here
                    // than two extra else if statements
                    hashes[i] = hash0;
                    hashes[i+1] = hash1;
                }
                
            }

            // tree is already up to date
            if(startIndex == n + n/2) revert('No leaf changed, tree already up to date.');

            // update the required parents
            for (uint i = startIndex; i < 2 * n - 1; i++) {
                hashes[i] = keccak256(
                    abi.encodePacked(hashes[2 * (i - n)], hashes[2 * (i - n) + 1])
                );
            }
            
        } else {
            // when generating tree for the first time
            for (uint i = 0; i < n; i++) {
                hashes.push(keccak256(abi.encodePacked(transactions[i])));
            }
            uint offset = 0;

            while (n > 0) {
                for (uint i = 0; i < n - 1; i += 2) {
                    hashes.push(
                        keccak256(
                            abi.encodePacked(hashes[offset + i], hashes[offset + i + 1])
                        )
                    );
                }
                offset += n;
                n = n / 2;
            }
        }

        return [hashes[0], hashes[1], hashes[2], hashes[3]];
    }

    function getRoot() public view returns (bytes32) {
        return hashes[hashes.length - 1];
    }
}
