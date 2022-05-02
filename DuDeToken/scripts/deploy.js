async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token20 = await ethers.getContractFactory("FreezeUnfreeze");
  const token20 = await Token20.deploy();

  await token20.mint(deployer.address, 2)
  console.log("Token address:", token20.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);  
  });
