// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/**
 * @title ExampleRecipient
 * @notice Demonstrates gasless transactions using EIP-2771
 */
contract ExampleRecipient is ERC2771Context {
    mapping(address => uint256) public userCounters;

    event CounterIncremented(address indexed user, uint256 newValue);

    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    /**
     * @notice Increments the caller's counter
     * @dev Uses _msgSender() to get the original transaction signer
     */
    function incrementCounter() external {
        address user = _msgSender();
        userCounters[user] += 1;
        emit CounterIncremented(user, userCounters[user]);
    }

    function getCounter(address user) external view returns (uint256) {
        return userCounters[user];
    }
}