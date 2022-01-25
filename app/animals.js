import Web3 from 'web3';

export function tokenURI(id, req, res) {
    var web3 = new Web3(process.env.RPC_PROVIDER);
    const address = process.env.OLD_TRAITS_CONTRACT;
    const contract = new web3.eth.Contract(oldTraitsABI, address);

    // Loop from traitData[0] to traiData[8] and from traitData[x][0] to traitData[x][y] = ""
    contract.methods.traitData(0, 0).call((err, result) => {
        res.status(200).json({
            balance: result
        });
    });
}

const animals = { tokenURI };

export default animals;
