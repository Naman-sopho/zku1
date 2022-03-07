require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/7f62d5e6167c494386e0b24a31e19c47",
      accounts: ["a8537cf3e5aa70faf283486cb580209bd447b7f4a782a8821a124a868cce22d5"]
    }
  }
};
