var INFURA_ROPSTEN_URL = 'https://ropsten.infura.io/gmXEVo5luMPUGPqg6mhy';
var INFURA_MAINNET_URL = 'https://mainnet.infura.io/gmXEVo5luMPUGPqg6mhy';

var deployedContractInfo = require('../contracts/DeployedContractInfo.json');
var tokenContract = require('../contracts/NametagToken.json');

var embeddedWeb3 = require('web3')

var web3utils = require('web3-utils')

const _IDEAL_BLOCK_TIME_SECONDS = 900;
const _BLOCKS_PER_READJUSTMENT = 1024;

export default class EthHelper {


    init( alertRenderer ){
        this.alertRenderer = alertRenderer;


        return this.connectWeb3(new embeddedWeb3());
    }

    connectWeb3(web3){
      if (typeof web3 !== 'undefined') {

            window.web3 = new Web3(new Web3.providers.HttpProvider(INFURA_MAINNET_URL));
            console.log('connected to web3!')
            return window.web3;

      } else {

            this.alertRenderer.renderError('No web3? You should consider trying MetaMask!')
            return {}
          // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
          //window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

      }
    }



    async connectToContract(web3, dashboardRenderer, callback)
    {
      var tokenContract = this.getWeb3ContractInstance(
        web3,
        this.getContractAddress(),
        this.getContractABI()
      )

       console.log(tokenContract)



       var contractAddress = this.getContractAddress() ;

       var difficulty = await tokenContract.getMiningDifficulty().toNumber() ;

       var challenge_number = await tokenContract.getChallengeNumber()  ;

       var amountMined = await tokenContract.tokensMinted()

       var totalSupply = await tokenContract._totalSupply()


       var lastRewardAmount = await tokenContract.lastRewardAmount()


        var lastRewardTo = await tokenContract.lastRewardTo()

       var lastRewardEthBlockNumber = await tokenContract.lastRewardEthBlockNumber()
       var latestDifficultyPeriodStarted = await tokenContract.latestDifficultyPeriodStarted()
       //0x1d00ffff code

        var epoch_count = await tokenContract.epochCount()

       var rewards_since_readjustment = epoch_count % _BLOCKS_PER_READJUSTMENT ;


       var current_eth_block = web3.eth.blockNumber;

       var eth_blocks_since_last_difficulty_period = current_eth_block - latestDifficultyPeriodStarted;
       var seconds_since_readjustment = eth_blocks_since_last_difficulty_period * 15;


       var seconds_per_reward = seconds_since_readjustment / rewards_since_readjustment;


       var hashrateEstimate = this.estimateHashrateFromDifficulty(  difficulty, seconds_per_reward  )


      var decimals = Math.pow(10,8);
       var renderData = {
         contractUrl: 'https://etherscan.io/address/'+contractAddress,
         contractAddress : contractAddress,
         difficulty: difficulty,
         challenge_number: challenge_number,
         amountMined: (parseInt(amountMined) / decimals),
         totalSupply: (parseInt(totalSupply) / decimals),
         hashrateEstimate: hashrateEstimate,
         lastRewardTo: lastRewardTo,
         lastRewardAmount: (parseInt(lastRewardAmount) / decimals),
         lastRewardEthBlockNumber: lastRewardEthBlockNumber


       }

       //dashboardRenderer.renderContractData(renderData);


       callback(renderData);

    }

    estimateHashrateFromDifficulty(difficulty, seconds_per_reward){

      //hashrate *= (_IDEAL_BLOCK_TIME_SECONDS / seconds_per_reward)


        var hashrate = web3utils.toBN(difficulty)
              .mul( web3utils.toBN(2)
              .pow(  web3utils.toBN(22) ))
              .div( web3utils.toBN(_IDEAL_BLOCK_TIME_SECONDS ))

              //???
     hashrate *= (_IDEAL_BLOCK_TIME_SECONDS / seconds_per_reward)

      var gigHashes = hashrate / ( parseFloat( web3utils.toBN(10).pow( web3utils.toBN(9) )) )

       console.log('hashrate is ',hashrate )
     return gigHashes.toFixed(2).toString() + " GH/s"

    }

    getWeb3ContractInstance(web3, contract_address, contract_abi )
    {
      if(contract_address == null)
      {
        contract_address = this.getContractAddress();
      }

      if(contract_abi == null)
      {
        contract_abi = this.getContractABI();
      }

        return web3.eth.contract(contract_abi).at(contract_address)


    }


    getContractAddress()
    {
       return deployedContractInfo.contracts.NametagToken.blockchain_address;
    }

    getContractABI()
    {
       return tokenContract.abi;
    }


}
