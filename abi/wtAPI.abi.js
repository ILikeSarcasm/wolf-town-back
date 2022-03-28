const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user_",
				"type": "address"
			},
			{
				"internalType": "contract ERC20[]",
				"name": "erc20s_",
				"type": "address[]"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "ERC20Allowance",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "balances",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "allowance",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user_",
				"type": "address"
			},
			{
				"internalType": "contract ERC20[]",
				"name": "erc20s_",
				"type": "address[]"
			}
		],
		"name": "ERC20Balances",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "balances",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user_",
				"type": "address"
			},
			{
				"internalType": "contract ERC721Enumerable",
				"name": "erc721_",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "from_",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "to_",
				"type": "uint256"
			}
		],
		"name": "ERC721TokenIds",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "ids_",
				"type": "uint256[]"
			},
			{
				"internalType": "contract ERC721Enumerable",
				"name": "erc721_",
				"type": "address"
			}
		],
		"name": "ERC721TokenURIs",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "list",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ERC721Enumerable",
				"name": "_erc721",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "_ids",
				"type": "uint256[]"
			}
		],
		"name": "ERC721TransferManyTo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "ids_",
				"type": "uint256[]"
			},
			{
				"internalType": "contract APIAnimal",
				"name": "erc721_",
				"type": "address"
			},
			{
				"internalType": "contract APISkill",
				"name": "skill_",
				"type": "address"
			},
			{
				"internalType": "contract APIBuildingGame",
				"name": "buildingGame_",
				"type": "address"
			}
		],
		"name": "WTAnimalData",
		"outputs": [
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
				"internalType": "struct Struct.WTAnimalTraits[]",
				"name": "traits",
				"type": "tuple[]"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "skillId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "points",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "level",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastSkillLevelUpdate",
						"type": "uint256"
					}
				],
				"internalType": "struct Struct.Skill[][]",
				"name": "skills",
				"type": "tuple[][]"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "waitingListIndex",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "points",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastPlay",
						"type": "uint256"
					}
				],
				"internalType": "struct Struct.Ownership[][]",
				"name": "ownership",
				"type": "tuple[][]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "ids_",
				"type": "uint256[]"
			},
			{
				"internalType": "contract APIAnimal",
				"name": "erc721_",
				"type": "address"
			}
		],
		"name": "WTAnimalURIs",
		"outputs": [
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
				"internalType": "struct Struct.WTAnimalTraits[]",
				"name": "list",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user_",
				"type": "address"
			},
			{
				"internalType": "contract ERC721Enumerable",
				"name": "wolf_",
				"type": "address"
			},
			{
				"internalType": "contract IAPIBarn",
				"name": "barn_",
				"type": "address"
			},
			{
				"internalType": "contract IAPIBarn",
				"name": "barn2_",
				"type": "address"
			}
		],
		"name": "oldTokenIds",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "tokenIds",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user_",
				"type": "address"
			},
			{
				"internalType": "contract IAPIBarn",
				"name": "barn_",
				"type": "address"
			}
		],
		"name": "pending",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "blockNum",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "tokenIds",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "wools",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "milks",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export default abi;
