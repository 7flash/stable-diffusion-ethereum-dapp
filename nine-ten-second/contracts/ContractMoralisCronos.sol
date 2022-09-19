// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract ERC721PromptStorage is ERC721 {
    using Strings for uint256;

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => string) private _tokenPrompts;

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory _tokenURI = _tokenURIs[tokenId];

        return _tokenURI;
    }

    function tokenPrompt(uint256 tokenId) public view virtual returns (string memory) {
        _requireMinted(tokenId);

        string memory _tokenPrompt = _tokenPrompts[tokenId];

        return _tokenPrompt;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721PromptStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _setTokenPrompt(uint256 tokenId, string memory _tokenPrompt) internal virtual {
        require(_exists(tokenId), "ERC721PromptStorage: URI set of nonexistent token");
        _tokenPrompts[tokenId] = _tokenPrompt;
    }

    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
            delete _tokenPrompts[tokenId];
        }
    }
}

contract ContractMoralisCronos is ERC721PromptStorage {
    constructor() ERC721("MoralisCronos", "MSCS") {}

    event Created(uint256 indexed tokenId, address indexed assigneee, string tokenURI, string tokenPrompt);

    uint256 public nextTokenId = 1;

    mapping (uint256 => uint256) public forks;

    function draw(string calldata tokenImage, string calldata tokenPrompt) public {
        uint256 _tokenId = nextTokenId;

        _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, tokenImage);
        _setTokenPrompt(_tokenId, tokenPrompt);

        emit Created(_tokenId, msg.sender, tokenImage, tokenPrompt);

        nextTokenId++;
    }

    function fork(uint256 baseTokenId, string calldata tokenPrompt) public {
        uint256 _tokenId = nextTokenId;

        string memory tokenImage = tokenURI(baseTokenId);

        _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, tokenImage);
        _setTokenPrompt(_tokenId, tokenPrompt);
        
        forks[_tokenId] = baseTokenId;

        emit Created(_tokenId, msg.sender, tokenImage, tokenPrompt);

        nextTokenId++;
    }
    
    function exist(bytes calldata bytesId) public view returns (bool){
        uint256 _tokenId = abi.decode(bytesId, (uint256));
        return _exists(_tokenId);
    }
}