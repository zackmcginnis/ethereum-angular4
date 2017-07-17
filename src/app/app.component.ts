import { Component } from '@angular/core';
// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
const Web3 = require('web3');
const contract = require('truffle-contract');
import { BlockchainService } from './services/blockchain.service';
const voting_artifacts = require('../../build/contracts/Voting.json');

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  Voting = contract(voting_artifacts);
  let candidates = {};
  let tokenPrice = null;
  web3 : any;

  constructor(private BlockchainService: BlockchainService) {

  }



};
