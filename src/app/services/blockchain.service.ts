import { Injectable } from '@angular/core';
// Import the page's CSS. Webpack will know what to do with it.

// Import libraries we need.
const Web3 = require('web3');
const contract = require('truffle-contract');
const voting_artifacts = require('../../../build/contracts/Voting.json');
/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */
@Injectable()
export class BlockchainService {

  Voting = contract(voting_artifacts);
  candidates = {};
  tokenPrice = null;
  web3: any;

  constructor() {
    if (typeof this.web3 !== 'undefined') {
      console.warn("Using web3 detected from external source like Metamask")
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    console.log("this.web3 in constructor = ", this.web3);

    this.Voting.setProvider(this.web3.currentProvider);
    this.populateCandidates();

 }


  voteForCandidate = function(candidate, tokens) {
    let candidateName = candidate.name;
    let voteTokens = tokens.count;
    //$("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
    //$("#candidate").val("");
    //$("#vote-tokens").val("");

    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
    this.Voting.deployed().then( (contractInstance) => {
      contractInstance.voteForCandidate(candidateName, voteTokens, {gas: 140000, from: this.web3.eth.accounts[0]}).then( () => {
        let div_id = this.candidates[candidateName];
        return contractInstance.totalVotesFor.call(candidateName).then( (v) => {
          console.log("vote successful", v)
          //$("#" + div_id).html(v.toString());
          //$("#msg").html("");
        });
      });
    });
  };

  /* The user enters the total no. of tokens to buy. We calculate the total cost and send it in
   * the request. We have to send the value in Wei. So, we use the toWei helper method to convert
   * from Ether to Wei.
   */

  buyTokens = function(tokensToBuy) {
    let price = tokensToBuy * this.tokenPrice;
    //$("#buy-msg").html("Purchase order has been submitted. Please wait.");
    this.Voting.deployed().then( (contractInstance) => {
      contractInstance.buy({value: this.web3.toWei(price, 'ether'), from: this.web3.eth.accounts[0]}).then( (v) => {
        //$("#buy-msg").html("");
        this.web3.eth.getBalance(contractInstance.address, (error, result) => {
          console.log("account balance", result)
          //$("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
        });
      })
    });
    this.populateTokenData();
  };

  lookupVoterInfo = function(address) {
    //let address = $("#voter-info").val();
    this.Voting.deployed().then( (contractInstance) => {
      contractInstance.voterDetails.call(address).then( (v) => {
        //$("#tokens-bought").html("Total Tokens bought: " + v[0].toString());
        console.log("tokens bought", v)
        let votesPerCandidate = v[1];
        //$("#votes-cast").empty();
        //$("#votes-cast").append("Votes cast per candidate: <br>");
        let allCandidates = Object.keys(this.candidates);
        for(let i=0; i < allCandidates.length; i++) {
          //$("#votes-cast").append(allCandidates[i] + ": " + votesPerCandidate[i] + "<br>");
        }
      });
    });
  };

  /* Instead of hardcoding the candidates hash, we now fetch the candidate list from
   * the blockchain and populate the array. Once we fetch the candidates, we setup the
   * table in the UI with all the candidates and the votes they have received.
   */
  populateCandidates = function () {
    this.Voting.deployed().then( (contractInstance) => {
      console.log("contractInstance response from innitial call of populateCanditdates = ", contractInstance)
      contractInstance.allCandidates.call().then( (candidateArray) => {
        console.log("response from contractInstance.allCandidates.call() = ", candidateArray);
        for(let i=0; i < candidateArray.length; i++) {
          /* We store the candidate names as bytes32 on the blockchain. We use the
           * handy toUtf8 method to convert from bytes32 to string
           */
          this.candidates[this.web3.toUtf8(candidateArray[i])] = "candidate-" + i;
        }
        console.log("after looping and populating this.candidates[] ", this.candidates)
        console.log("last part of this function calls, this.setupCandidateRows(), this.populateCandidateVotes(); this.populateTokenData()");
        this.setupCandidateRows();
        this.populateCandidateVotes();
        this.populateTokenData();
      });
    });
  };

  populateCandidateVotes = function () {
    let candidateNames = Object.keys(this.candidates);
    for (var i = 0; i < candidateNames.length; i++) {
      let name = candidateNames[i];
      this.Voting.deployed().then( (contractInstance) => {
        contractInstance.totalVotesFor.call(name).then( (v) => {
          console.log("total votes for", v);
          //$("#" + candidates[name]).html(v.toString());
        });
      });
    }
  }

  setupCandidateRows = function () {
    Object.keys(this.candidates).forEach( (candidate) => {
      //$("#candidate-rows").append("<tr><td>" + candidate + "</td><td id='" + candidates[candidate] + "'></td></tr>");
    });
  }

  /* Fetch the total tokens, tokens available for sale and the price of
   * each token and display in the UI
   */
  populateTokenData = function () {
    this.Voting.deployed().then( (contractInstance) => {
      contractInstance.totalTokens().then( (v) => {
        console.log("total tokens", v)
        //$("#tokens-total").html(v.toString());
      });
      contractInstance.tokensSold.call().then( (v) => {
        console.log("tokens sold", v)
        //$("#tokens-sold").html(v.toString());
      });
      contractInstance.tokenPrice().then( (v) => {
        this.tokenPrice = parseFloat(this.web3.fromWei(v.toString()));
        console.log("total cost", v)
        //$("#token-cost").html(tokenPrice + " Ether");
      });
      this.web3.eth.getBalance(contractInstance.address, (error, result) => {
        console.log("get balance", result)
        //$("#contract-balance").html(this.web3.fromWei(result.toString()) + " Ether");
      });
    });
  }

}
