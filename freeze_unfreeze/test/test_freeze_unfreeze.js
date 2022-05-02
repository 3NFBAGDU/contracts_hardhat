const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Test Mint", function () {
  it("Test Mint", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const freezeUnfreeze = await ethers.getContractFactory("FreezeUnfreeze");

    const hardhatToken = await freezeUnfreeze.deploy();

    await hardhatToken.mint(addr1.address, 2)
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(2);


    await hardhatToken.mint(addr1.address, 1)
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(3);

  });
})

describe("Test pause", function () {
  it("Test Pause", async function () {
      const [owner, addr1] = await ethers.getSigners();

      const freezeUnfreeze = await ethers.getContractFactory("FreezeUnfreeze");
  
      const hardhatToken = await freezeUnfreeze.deploy();

      // test pause
      await hardhatToken.pause();
      await expect(hardhatToken.mint(addr1.address, 2)).to.be.revertedWith("Pausable: paused");        

      // test unpause 
      await hardhatToken.unpause();
      await hardhatToken.mint(addr1.address, 2)

      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(2);
  });
});


describe("Test Freeze/Unfreeze", function () {
  it("Test Freeze/Unfreeze", async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();

      const freezeUnfreeze = await ethers.getContractFactory("FreezeUnfreeze");
  
      const hardhatToken = await freezeUnfreeze.deploy();

      // test giving the owner adress
      await expect(hardhatToken.freeze([ethers.constants.AddressZero, addr1.address])).to.be.revertedWith("null address should not be in this list");   

      // test freeze
      await hardhatToken.freeze([addr1.address]);
      await expect(hardhatToken.mint(addr1.address, 1)).to.be.revertedWith("account is frozen");   

      // test freeze
      await hardhatToken.unFreeze([addr1.address]);
      await hardhatToken.mint(addr1.address, 1)    
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);
  });
});
