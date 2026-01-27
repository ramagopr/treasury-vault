// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title TreasuryVault
/// @notice Minimal vault contract to demonstrate production-style DevOps: events, access control, safe withdraw.
contract TreasuryVault {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Deposited(address indexed from, uint256 amount, uint256 newBalance);
    event Withdrawn(address indexed to, uint256 amount, uint256 newBalance);

    error NotOwner();
    error ZeroAddress();
    error ZeroAmount();
    error InsufficientBalance(uint256 requested, uint256 available);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        owner = initialOwner;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value, address(this).balance);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        address prev = owner;
        owner = newOwner;
        emit OwnershipTransferred(prev, newOwner);
    }

    function withdraw(address payable to, uint256 amountWei) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        if (amountWei == 0) revert ZeroAmount();

        uint256 bal = address(this).balance;
        if (amountWei > bal) revert InsufficientBalance(amountWei, bal);

        (bool ok, ) = to.call{value: amountWei}("");
        require(ok, "ETH_TRANSFER_FAILED");

        emit Withdrawn(to, amountWei, address(this).balance);
    }

    function balance() external view returns (uint256) {
        return address(this).balance;
    }
}
