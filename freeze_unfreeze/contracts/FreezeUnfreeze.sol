pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FreezeUnfreeze is ERC20, Ownable, Pausable{

    using Counters for Counters.Counter;

    // freeze accounts mapping
    mapping(address=>bool) freezed;

    // mapping token and its owner
    mapping(uint256=>address) tokenOwner;


    // cost mint
    uint256 public cost = 1;

    // token counter
    Counters.Counter private _tokenIds;

    constructor() ERC20("MyToken", "MTK") {}

    function freeze(address[] calldata addrs) external onlyOwner returns(bool){
        for (uint256 i = 0; i < addrs.length; ++ i) {
            freezed[addrs[i]] = true;
        }
        return true;
    }

    function unFreeze(address[] calldata addrs) external onlyOwner {
        for (uint256 i = 0; i < addrs.length; ++ i) {
            delete freezed[addrs[i]];
        }
    }


    // modifier to give access on some actions only not freezed accounts
    modifier whenNotFreezed() {
        require(freezed[msg.sender]==false);
        _;
    }


    function mint() external payable whenNotPaused whenNotFreezed {
        require(
            msg.value >= cost, 
            "Not enough ether to purchase NFTs."
        );

        uint256 newTokenID = _tokenIds.current();
        _mint(msg.sender, 1);
        tokenOwner[newTokenID] = msg.sender;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

}
