const abi = [
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_wtWoolContract",
				"type": "address"
			},
			{
				"internalType": "contract IERC721",
				"name": "_wtAnimalContract",
				"type": "address"
			},
			{
				"internalType": "contract IWTOwnershipDeed",
				"name": "_wtOwnershipDeedContract",
				"type": "address"
			},
			{
				"internalType": "contract IBuildingGameManager",
				"name": "_buildingGameManagerContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_bankAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_projectFoundsAddress",
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
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_earnedWTWool",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_timestamp",
				"type": "uint256"
			}
		],
		"name": "TokenClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_timestamp",
				"type": "uint256"
			}
		],
		"name": "TokenStaked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_timestamp",
				"type": "uint256"
			}
		],
		"name": "TokenUnstaked",
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
		"name": "DISTRIBUTER",
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
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"internalType": "uint256[]",
				"name": "_indexes",
				"type": "uint256[]"
			}
		],
		"name": "adminEmergencyUnstake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"internalType": "uint256[]",
				"name": "_indexes",
				"type": "uint256[]"
			}
		],
		"name": "adminUnstake",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"inputs": [],
		"name": "buildingGameManagerContract",
		"outputs": [
			{
				"internalType": "contract IBuildingGameManager",
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
		"name": "buildingStakes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalStakedPoints",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "wtWoolPerPoint",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "burnAddress",
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
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "claim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum IBuildingStakeManager.TokenType[]",
				"name": "_tokenTypes",
				"type": "uint8[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_tokenIds",
				"type": "uint256[]"
			}
		],
		"name": "claimMany",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_buildingName",
				"type": "string"
			}
		],
		"name": "createBuildingStake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_wtWoolAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_bankAddress",
				"type": "address"
			}
		],
		"name": "distributeFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_from",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_to",
				"type": "uint256"
			}
		],
		"name": "getEarningsByUserByTokenType",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "wtWoolEarnings",
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
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_from",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_to",
				"type": "uint256"
			}
		],
		"name": "getStakesByUserByTokenType",
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
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "getTokenPoints",
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
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			}
		],
		"name": "getTotalStakesByUserByTokenType",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalStakes",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "onERC721Received",
		"outputs": [
			{
				"internalType": "bytes4",
				"name": "",
				"type": "bytes4"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "projectFoundsAddress",
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
				"internalType": "address",
				"name": "_bankAddress",
				"type": "address"
			}
		],
		"name": "setBankAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IBuildingGameManager",
				"name": "_buildingGameManagerContract",
				"type": "address"
			}
		],
		"name": "setBuildingGameManagerContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_projectFees",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_burnFees",
				"type": "uint256"
			}
		],
		"name": "setFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_projectFoundsAddress",
				"type": "address"
			}
		],
		"name": "setProjectFoundsAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC721",
				"name": "_wtAnimalContract",
				"type": "address"
			}
		],
		"name": "setWTAnimalContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IWTOwnershipDeed",
				"name": "_wtOwnershipDeedContract",
				"type": "address"
			}
		],
		"name": "setWTOwnershipDeedContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_wtWoolContract",
				"type": "address"
			}
		],
		"name": "setWTWoolContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "stake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_buildingId",
				"type": "uint256"
			},
			{
				"internalType": "enum IBuildingStakeManager.TokenType[]",
				"name": "_tokenTypes",
				"type": "uint8[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_tokenIds",
				"type": "uint256[]"
			}
		],
		"name": "stakeMany",
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tokenToBuildingId",
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
				"internalType": "enum IBuildingStakeManager.TokenType",
				"name": "_tokenType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "unstake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum IBuildingStakeManager.TokenType[]",
				"name": "_tokenTypes",
				"type": "uint8[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_tokenIds",
				"type": "uint256[]"
			}
		],
		"name": "unstakeMany",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "wtAnimalContract",
		"outputs": [
			{
				"internalType": "contract IERC721",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "wtOwnershipDeedContract",
		"outputs": [
			{
				"internalType": "contract IWTOwnershipDeed",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "wtWoolContract",
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
