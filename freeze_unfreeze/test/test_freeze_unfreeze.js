const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Test Mint", function () {
  it("Test Mint", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const freezeUnfreeze = await ethers.getContractFactory("FreezeUnfreeze");

    const hardhatToken = await freezeUnfreeze.deploy();

    await hardhatToken.connect(addr1).mint({
      value: 1
    })
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);

  });
})

describe("Test pause", function () {
  it("Test Pause", async function () {
      const [owner, addr1] = await ethers.getSigners();

      const freezeUnfreeze = await ethers.getContractFactory("FreezeUnfreeze");
  
      const hardhatToken = await freezeUnfreeze.deploy();

      // test pause
      await hardhatToken.pause();
      await expect(hardhatToken.connect(addr1).mint({
        value: 1
      })).to.be.reverted;        

      // test unpause 
      await hardhatToken.unpause();
      await hardhatToken.connect(addr1).mint({
        value: 1
      })
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);
  });
});


describe("Test Freeze/Unfreeze", function () {
  it("Test Freeze/Unfreeze", async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();

      const freezeUnfreeze = await ethers.getContractFactory("FreezeUnfreeze");
  
      const hardhatToken = await freezeUnfreeze.deploy();

      // test freeze
      await hardhatToken.freeze([addr1.address]);
      await expect(hardhatToken.connect(addr1).mint({
        value: 1
      })).to.be.reverted;        

      // test freeze
      await hardhatToken.unFreeze([addr1.address]);
      await hardhatToken.connect(addr1).mint({
        value: 1
      })
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);
  });
});
