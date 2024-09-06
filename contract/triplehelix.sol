// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts@4.6.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.6.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.6.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.6.0/utils/Counters.sol";
import "@openzeppelin/contracts@4.6.0/utils/Strings.sol";
import "@openzeppelin/contracts@4.6.0/utils/Counters.sol";
import "@openzeppelin/contracts@4.6.0/utils/Base64.sol";



contract triplehelix is ERC721, ERC721URIStorage, Ownable {
    /// @dev Countersライブラリの全Functionを構造体Counter型に付与
    using Counters for Counters.Counter;


    /// 螺旋の色データ
    struct Color {
        uint256 col1;
        uint256 col2;
        uint256 col3;
    }
    
    // 付与したCounter型の変数_tokenIdCounterを定義
    Counters.Counter private _tokenIdCounter;

    // 色のデータをマッピング
    mapping(uint256 => Color) public Colors;

    constructor() ERC721("TripleHelix_OnChainNFT", "THON") {}

    function makeMetaData(uint256 tokenId) public view returns(bytes memory) {

        bytes memory ArtWorkData = abi.encodePacked(
            '<!DOCTYPE html>',
            '<html lang="en">',
            '  <head>',
            '    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.min.js"></script>',
            '    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.sound.min.js"></script>',
            '    <link rel="stylesheet" type="text/css" href="style.css" />',
            '    <meta charset="utf-8" />',
            '  </head>',
            '  <body>',
            '    <main></main>',
            '    <script>',
            '      let size = 35;',
            '      let num;',
            '      let circles1, circles2, circles3;',
            '      let col1, col2, col3;',
            '      let a = 0;',
            '      function setup() {',
            '        createCanvas(windowWidth, windowHeight);',
            '        colorMode(HSB);',
            '        background(0);',
            '        stroke(0, 100);',
            '        num = width;',
            '        circles1 = new Array(num);',
            '        circles2 = new Array(num);',
            '        circles3 = new Array(num);',
            '        col1 = ',
            Strings.toString(Colors[tokenId].col1),
            ';',
            '        col2 = ',
            Strings.toString(Colors[tokenId].col2),
            ';',
            '        col3 = ',
            Strings.toString(Colors[tokenId].col3),
            ';',
            '        for (let i = 0; i <= num; i++) {',
            '          circles1[i] = new cir(i, 1);',
            '          circles2[i] = new cir(i, 2);',
            '          circles3[i] = new cir(i, 3);',
            '        }',
            '      }',
            '      function draw() {',
            '        background(2);',
            '        strokeWeight(0.5);',
            '        noFill();',
            '        for (let i = 0; i <= num; i++) {',
            '          stroke(col1, 100, 100);',
            '          circle(circles1[i].posx, circles1[i].posy, size * noise(i * 0.1 + a));',
            '          stroke(col2, 100, 100);',
            '          circle(circles2[i].posx, circles2[i].posy, size * noise(i * 0.1 + a));',
            '          stroke(col3, 100, 100);',
            '          circle(circles3[i].posx, circles3[i].posy, size * noise(i * 0.1 + a));',
            '          if (i != num) {',
            '            circles1[i].posy = circles1[i + 1].posy;',
            '            circles2[i].posy = circles2[i + 1].posy;',
            '            circles3[i].posy = circles3[i + 1].posy;',
            '          } else {',
            '            circles1[i].posy = circles1[0].posy;',
            '            circles2[i].posy = circles2[0].posy;',
            '            circles3[i].posy = circles3[0].posy;',
            '          }',
            '        }',
            '        a += 0.01;',
            '      }',
            '      class cir {',
            '        constructor(i, type) {',
            '          this.posx = i;',
            '          let theta = map(i, 0, width, 0, TAU);',
            '          if (type == 1) this.posy = height / 2 + 100 * sin(theta);',
            '          else if (type == 2)',
            '            this.posy = height / 2 + 100 * sin(theta + (2 / 3) * PI);',
            '          else this.posy = height / 2 + 100 * sin(theta + (4 / 3) * PI);',
            '        }',
            '      }',
            '    </script>',
            '  </body>',
            '</html>'
        );

        bytes memory metadata =abi.encodePacked(
            '{"name":"',
            'TripleHelix_OnChainNFT #',
            Strings.toString(tokenId),
            '","description":"This NFT is fully on-chain and is a triple-helix structure made of your tokenID original unique color combinations.",',
            '"animation_url": "data:text/html;base64,',
            Base64.encode(ArtWorkData),
            '"}'
        );

        return metadata;
    }

    /**
     *@dev
     * - このコントラクトをデプロイしたアドレスだけがmint可能 onlyOwner
     * - tokenIdをインクリメント
     * - nftMint関数の実行アドレスにtokenIdを紐づけ
     * - mintの際にURIを設定
    */

    function nftMint(uint256 col1,uint256 col2,uint256 col3) public {

        // tokenIdを1増やす。tokenIdは1から始まる
        _tokenIdCounter.increment();
        // 現時点のtokenIdを取得
        uint tokenId = _tokenIdCounter.current();

        Colors[tokenId].col1 = col1;
        Colors[tokenId].col2 = col2;
        Colors[tokenId].col3 = col3;

        string memory metadata = string(abi.encodePacked("data:application/json;base64,",Base64.encode(makeMetaData(tokenId))));

        // NFTmint
        _mint(msg.sender, tokenId);
        // tokenURIを設定
        _setTokenURI(tokenId, metadata);

    }

    /// @dev 以下は全てoverride重複の整理
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage){
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns(string memory) {
        return super.tokenURI(tokenId);
    }
}