pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FreezeUnfreeze is ERC20, Ownable, Pausable{
    using SafeMath for uint256;

    // freeze accounts mapping
    mapping(address=>bool) frozen;

    constructor() ERC20("MyToken", "MTK") {}

    function freeze(address[] calldata addrs) external onlyOwner{
        for (uint256 i = 0; i < addrs.length; ++ i) {
            frozen[addrs[i]] = true;
        }
    }

    function unFreeze(address[] calldata addrs) external onlyOwner {
        for (uint256 i = 0; i < addrs.length; ++ i) {
            delete frozen[addrs[i]];
        }
    }


    // modifier to give access on some actions only not freezed accounts
    modifier whenNotFrozen(address from, address to) {
        require(frozen[from]==false);
        require(frozen[to]==false);
        _;
    }


    function mint(address addr, uint256 count) 
        external 
        whenNotPaused
        onlyOwner
    {
        _mint(addr, count);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotFrozen(from, to)
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

}
