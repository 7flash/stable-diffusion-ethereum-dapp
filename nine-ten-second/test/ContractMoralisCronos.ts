/* eslint-disable no-undef */
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ContractMoralisCronos", () => {
    async function deployFixture() {
        const [owner] = await ethers.getSigners();

        const Contract = await ethers.getContractFactory("ContractMoralisCronos");
        const contract = await Contract.deploy();

        return { contract, owner }
    }

    describe("First Suite", () => {
        it("first case", async () => {
            const { contract, owner } = await loadFixture(deployFixture);

            expect(await contract.balanceOf(owner.address)).to.equal(0);

            const firstUri = "ipfs://";
            const firstPrompt = "prompt";
            await contract.draw(firstUri, firstPrompt);
            expect(await contract.balanceOf(owner.address)).to.equal(1);

            const secondUri = "ipfs://";
            const secondPrompt = "prompt";
            await contract.fork(1, secondPrompt);
            expect(await contract.balanceOf(owner.address)).to.equal(2);
        })
    })
})