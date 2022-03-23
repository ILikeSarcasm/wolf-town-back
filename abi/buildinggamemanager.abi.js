const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256[4]",
				"name": "_pointRewards",
				"type": "uint256[4]"
			},
			{
				"internalType": "uint256[4][2]",
				"name": "_skillRewards",
				"type": "uint256[4][2]"
			},
			{
				"internalType": "uint256[]",
				"name": "_buildingSkillActionPerLevel",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_stealingSkillActionPerLevel",
				"type": "uint256[]"
			},
			{
				"internalType": "contract IERC721",
				"name": "_wtanimalContract",
				"type": "address"
			},
			{
				"internalType": "contract IERC20",
				"name": "_wtwoolContract",
				"type": "address"
			},
			{
				"internalType": "contract IWTMilk",
				"name": "_wtmilkContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_bankAddress",
				"type": "address"
			},
			{
				"internalType": "contract ISkillManager",
				"name": "_skillManagerContract",
				"type": "address"
			},
			{
				"internalType": "contract IWTOwnershipDeed",
				"name": "_wtownershipDeedContract",
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
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "participant",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum BuildingGameManager.PlayingAction",
				"name": "action",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum BuildingGameManager.PlayingResult",
				"name": "result",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "earnedPoints",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "MatchResult",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "participant",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "Participate",
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
		"name": "MATCH_MAKER",
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
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"components": [
					{
						"internalType": "uint80",
						"name": "inBNB",
						"type": "uint80"
					},
					{
						"internalType": "uint80",
						"name": "inWTWool",
						"type": "uint80"
					},
					{
						"internalType": "uint80",
						"name": "inWTMilk",
						"type": "uint80"
					}
				],
				"internalType": "struct BuildingGameManager.Costs",
				"name": "_costs",
				"type": "tuple"
			},
			{
				"internalType": "uint256",
				"name": "_cooldown",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_resetCooldownCost",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_maximumPoints",
				"type": "uint256"
			}
		],
		"name": "createGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			}
		],
		"name": "endGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "_animalIds",
				"type": "uint256[]"
			}
		],
		"name": "extractAnimalPoints",
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
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "gameNameToId",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "games",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "ended",
				"type": "bool"
			},
			{
				"components": [
					{
						"internalType": "uint80",
						"name": "inBNB",
						"type": "uint80"
					},
					{
						"internalType": "uint80",
						"name": "inWTWool",
						"type": "uint80"
					},
					{
						"internalType": "uint80",
						"name": "inWTMilk",
						"type": "uint80"
					}
				],
				"internalType": "struct BuildingGameManager.Costs",
				"name": "costs",
				"type": "tuple"
			},
			{
				"internalType": "uint256",
				"name": "cooldown",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "resetCooldownCost",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPoints",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maximumPoints",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "waitingListLength",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BuildingGameManager.PlayingAction",
				"name": "_action",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "_password",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_nonce",
				"type": "uint256"
			}
		],
		"name": "getBytesByAction",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_animalId",
				"type": "uint256"
			}
		],
		"name": "getGameAnimalData",
		"outputs": [
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
				"internalType": "struct BuildingGameManager.AnimalData",
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
				"name": "_gameId",
				"type": "uint256"
			}
		],
		"name": "getGameCosts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint80",
						"name": "inBNB",
						"type": "uint80"
					},
					{
						"internalType": "uint80",
						"name": "inWTWool",
						"type": "uint80"
					},
					{
						"internalType": "uint80",
						"name": "inWTMilk",
						"type": "uint80"
					}
				],
				"internalType": "struct BuildingGameManager.Costs",
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
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_animalId",
				"type": "uint256"
			}
		],
		"name": "getGameParticipationByAnimalId",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "participant",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "animalId",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "hashedAction",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "nonce",
						"type": "uint256"
					}
				],
				"internalType": "struct BuildingGameManager.Participation",
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
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getGameParticipationByIndex",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "participant",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "animalId",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "hashedAction",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "nonce",
						"type": "uint256"
					}
				],
				"internalType": "struct BuildingGameManager.Participation",
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
				"name": "_gameId",
				"type": "uint256"
			}
		],
		"name": "getGameWaitingListLength",
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
		"name": "getPointRewards",
		"outputs": [
			{
				"internalType": "uint256[4]",
				"name": "",
				"type": "uint256[4]"
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
		"inputs": [],
		"name": "getSkillActionPerLevel",
		"outputs": [
			{
				"internalType": "uint256[][2]",
				"name": "",
				"type": "uint256[][2]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSkillRewards",
		"outputs": [
			{
				"internalType": "uint256[4][2]",
				"name": "",
				"type": "uint256[4][2]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSkills",
		"outputs": [
			{
				"internalType": "uint256[2]",
				"name": "",
				"type": "uint256[2]"
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
				"internalType": "string",
				"name": "_game",
				"type": "string"
			}
		],
		"name": "idOf",
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
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			},
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "_animalIds",
				"type": "uint256[]"
			},
			{
				"internalType": "enum BuildingGameManager.PlayingAction[]",
				"name": "_actions",
				"type": "uint8[]"
			},
			{
				"internalType": "bytes32[]",
				"name": "_passwords",
				"type": "bytes32[]"
			}
		],
		"name": "makeMatches",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "_animalIds",
				"type": "uint256[]"
			},
			{
				"internalType": "bytes32[]",
				"name": "_hashedActions",
				"type": "bytes32[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_nonces",
				"type": "uint256[]"
			}
		],
		"name": "participate",
		"outputs": [],
		"stateMutability": "payable",
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
				"name": "_address",
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
				"internalType": "uint256",
				"name": "_from",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "_skillActionPerLevel",
				"type": "uint256[]"
			}
		],
		"name": "setBuildingSkillActionPerLevel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_cooldown",
				"type": "uint256"
			}
		],
		"name": "setGameCooldown",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "uint80",
						"name": "inBNB",
						"type": "uint80"
					},
					{
						"internalType": "uint80",
						"name": "inWTWool",
						"type": "uint80"
					},
					{
						"internalType": "uint80",
						"name": "inWTMilk",
						"type": "uint80"
					}
				],
				"internalType": "struct BuildingGameManager.Costs",
				"name": "_costs",
				"type": "tuple"
			}
		],
		"name": "setGameCosts",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_maximumPoints",
				"type": "uint256"
			}
		],
		"name": "setGameMaximumPoints",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_resetCooldownCost",
				"type": "uint256"
			}
		],
		"name": "setGameResetCooldownCost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[4]",
				"name": "_pointRewards",
				"type": "uint256[4]"
			}
		],
		"name": "setPointRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[4][2]",
				"name": "_skillRewards",
				"type": "uint256[4][2]"
			}
		],
		"name": "setSkillRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_buildingSkill",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_stealingSkill",
				"type": "string"
			}
		],
		"name": "setSkills",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_from",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "_skillActionPerLevel",
				"type": "uint256[]"
			}
		],
		"name": "setStealingSkillActionPerLevel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ISkillManager",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "setskillManagerContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC721",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "setwtanimalContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IWTMilk",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "setwtmilkContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "setwtwoolContract",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "skillActionPerLevel",
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
		"name": "skillManagerContract",
		"outputs": [
			{
				"internalType": "contract ISkillManager",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "skillRewards",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "skills",
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
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "_animalIds",
				"type": "uint256[]"
			}
		],
		"name": "speedUpCooldown",
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
				"name": "_gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "_animalIds",
				"type": "uint256[]"
			}
		],
		"name": "takeBackAnimal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalGames",
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
		"name": "wtmilkContract",
		"outputs": [
			{
				"internalType": "contract IWTMilk",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "wtownershipDeedContract",
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
