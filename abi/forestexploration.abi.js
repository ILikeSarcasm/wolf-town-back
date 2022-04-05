const abi = [
	{
		"inputs": [
			{
				"internalType": "contract IWTAnimal",
				"name": "_wtanimalContract",
				"type": "address"
			},
			{
				"internalType": "contract IERC20",
				"name": "_wtwoolContract",
				"type": "address"
			},
			{
				"internalType": "contract IERC20",
				"name": "_wtmilkContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_bankAddress",
				"type": "address"
			},
			{
				"internalType": "contract IPancakeRouter02",
				"name": "_pancakeRouter02",
				"type": "address"
			},
			{
				"internalType": "contract IWETH",
				"name": "_WETH",
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
				"internalType": "uint256",
				"name": "wolfId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "seed",
				"type": "bytes32"
			}
		],
		"name": "CreateRound",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "seed",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "costTotal",
				"type": "uint256"
			}
		],
		"name": "JoinRound",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "seed",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "seedResult",
				"type": "bytes32"
			}
		],
		"name": "Publish",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "nonce",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "seed",
				"type": "bytes32"
			}
		],
		"name": "SpeedUp",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DEFAULT_SEED",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_seed",
				"type": "bytes32"
			}
		],
		"name": "GetCharges",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_wolfId",
				"type": "uint256"
			}
		],
		"name": "InvitationCreateRound",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_BALANCE",
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
		"name": "PUBLISH_GAS",
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
				"internalType": "bytes32",
				"name": "_seed",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			}
		],
		"name": "PublishSeed",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "RANDOM_GETTER",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SPEED_UP_PER_INC",
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
				"internalType": "bytes32",
				"name": "_seed",
				"type": "bytes32"
			}
		],
		"name": "StopRound",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "_seed",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_mintNumber",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_useETH",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "_speedUp",
				"type": "bool"
			}
		],
		"name": "UserJoinRound",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WETH",
		"outputs": [
			{
				"internalType": "contract IWETH",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "bankAddress",
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
				"internalType": "bytes32",
				"name": "_seed",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "_seedResult",
				"type": "bytes32"
			}
		],
		"name": "emergencyPublishSeed",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_seed",
				"type": "bytes32"
			}
		],
		"name": "emergencyWolfLeave",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_mintNumber",
				"type": "uint256"
			}
		],
		"name": "getAmountsIn",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "amountsWool",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amountsMilk",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_seed",
				"type": "bytes32"
			}
		],
		"name": "getRound",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "withdrawal",
						"type": "bool"
					},
					{
						"internalType": "enum ForestExploration.RoundStage",
						"name": "stage",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "invitation",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "seed",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "wolfId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "beginTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "costTotal",
						"type": "uint256"
					}
				],
				"internalType": "struct ForestExploration.Round",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_wolfId",
				"type": "uint256"
			}
		],
		"name": "getTax",
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
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "from",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "to",
				"type": "uint256"
			}
		],
		"name": "getUserJoinRounds",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "withdrawal",
						"type": "bool"
					},
					{
						"internalType": "enum ForestExploration.RoundStage",
						"name": "stage",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "invitation",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "seed",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "wolfId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "beginTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "costTotal",
						"type": "uint256"
					}
				],
				"internalType": "struct ForestExploration.Round[]",
				"name": "roundList",
				"type": "tuple[]"
			},
			{
				"internalType": "bytes32[]",
				"name": "seeds",
				"type": "bytes32[]"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "mintedNonce",
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
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_max",
				"type": "uint256"
			}
		],
		"name": "getUserMintingRound",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "withdrawal",
						"type": "bool"
					},
					{
						"internalType": "enum ForestExploration.RoundStage",
						"name": "stage",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "invitation",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "seed",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "wolfId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "beginTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "costTotal",
						"type": "uint256"
					}
				],
				"internalType": "struct ForestExploration.Round[]",
				"name": "roundList",
				"type": "tuple[]"
			},
			{
				"internalType": "bytes32[]",
				"name": "seeds",
				"type": "bytes32[]"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "mintedNonce",
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
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserRoundLength",
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
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "from",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "to",
				"type": "uint256"
			}
		],
		"name": "getUserRounds",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "withdrawal",
						"type": "bool"
					},
					{
						"internalType": "enum ForestExploration.RoundStage",
						"name": "stage",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "invitation",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "seed",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "wolfId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "beginTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "costTotal",
						"type": "uint256"
					}
				],
				"internalType": "struct ForestExploration.Round[]",
				"name": "roundList",
				"type": "tuple[]"
			},
			{
				"internalType": "bytes32[]",
				"name": "seeds",
				"type": "bytes32[]"
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
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mintId",
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
		"name": "pancakeRouter02",
		"outputs": [
			{
				"internalType": "contract IPancakeRouter02",
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
				"name": "",
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
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "rounds",
		"outputs": [
			{
				"internalType": "bool",
				"name": "withdrawal",
				"type": "bool"
			},
			{
				"internalType": "enum ForestExploration.RoundStage",
				"name": "stage",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "invitation",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "seed",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "wolfId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "beginTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "costTotal",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "v",
				"type": "uint256"
			}
		],
		"name": "set_MAX_BALANCE",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "v",
				"type": "uint256"
			}
		],
		"name": "set_PUBLISH_GAS",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "v",
				"type": "uint256"
			}
		],
		"name": "set_SPEED_UP_PER_INC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "v",
				"type": "uint256"
			}
		],
		"name": "set_WETH_approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "v",
				"type": "address"
			}
		],
		"name": "set_bankAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IPancakeRouter02",
				"name": "v",
				"type": "address"
			}
		],
		"name": "set_pancakeRouter02",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "v",
				"type": "uint256[]"
			}
		],
		"name": "set_taxs",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IWTAnimal",
				"name": "v",
				"type": "address"
			}
		],
		"name": "set_wtanimalContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "v",
				"type": "address"
			}
		],
		"name": "set_wtmilkContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "v",
				"type": "address"
			}
		],
		"name": "set_wtwoolContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
		"name": "taxs",
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
		"name": "userNonce",
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
		"name": "userNonceRound",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
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
		"name": "userNonceUse",
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
		"name": "wtanimalContract",
		"outputs": [
			{
				"internalType": "contract IWTAnimal",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "wtmilkContract",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "wtwoolContract",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export default abi;
