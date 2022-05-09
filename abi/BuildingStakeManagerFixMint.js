const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "contract IWTOwnershipDeed",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_buildingId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_points",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "createOwn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "erc721",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "_nonces",
        "type": "uint256[]"
      }
    ],
    "name": "getNonces",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "addresses",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "isSheep",
        "type": "bool"
      },
      {
        "internalType": "uint8",
        "name": "alpha",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getTarget",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "targetSeed",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "isSheep",
            "type": "bool"
          },
          {
            "internalType": "uint8",
            "name": "fur",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "head",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "ears",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "eyes",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "nose",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "mouth",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "neck",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "feet",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "alpha",
            "type": "uint8"
          }
        ],
        "internalType": "struct IWTAnimalTraitsGenerator.WTAnimalTraits",
        "name": "traits",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserResults",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "list",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastMintUser",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "nonces",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_sup",
        "type": "uint256"
      }
    ],
    "name": "random",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "random",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "random22",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "seedList",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "seedMintIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "seedResultList",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "isSheep",
            "type": "bool"
          },
          {
            "internalType": "uint8",
            "name": "fur",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "head",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "ears",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "eyes",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "nose",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "mouth",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "neck",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "feet",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "alpha",
            "type": "uint8"
          }
        ],
        "internalType": "struct IWTAnimalTraitsGenerator.WTAnimalTraits[]",
        "name": "_traits",
        "type": "tuple[]"
      },
      {
        "internalType": "bool",
        "name": "repeat",
        "type": "bool"
      }
    ],
    "name": "setTraits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "list",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "_seedMintIndex",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "lastUser",
        "type": "address"
      }
    ],
    "name": "setUserSeed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract SkillManager",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "tokenId",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "skillId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "points",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      }
    ],
    "name": "skillUpToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
export default abi;
