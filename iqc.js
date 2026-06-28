const {
	createCanvas,
	GlobalFonts,
	loadImage
} = require('@napi-rs/canvas');
const fs = require('fs');
const EmojiDbLib = require('emoji-db');
const emojiImageByBrand = require('./lib/emoji-image');
const path = require('path');

const FONT_PATH = path.join(
	typeof __dirname !== 'undefined' ? __dirname : process.cwd(),
	'assets', 'SFPRODISPLAYREGULAR.otf'
);
GlobalFonts.registerFromPath(FONT_PATH, 'SFPRODISPLAYREGULAR');

const emojiDb = new EmojiDbLib({
	useDefaultDb: true
});
const emojiImageJson = emojiImageByBrand.apple;
const fallbackEmojiImageJson = emojiImageByBrand.google;

const ICONS_B64 = {
	reply: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADsElEQVRoQ+2YV6gUWRCGv6surmCGxYARVjHsGlERxXUxK4gPggF9cxeRXRFE8UkEHwwI+qCID/qgqLAgBkTRxRwQzIg5R8SAGVcFlZ9bc25v9/R090wPMxfme7lV1dye+ufUqVNnqqjlVNXy/CsCSk6lhEpNmitQD/gF+ARcA765J0UkLQFDgc1Aa/PPAhOBe+YXjTQEjAa2Az+6SDXngb7FXolCBfiTfwk0Bn4wv6uVU9EoRIA/+btWShuB3ywm/4jZRSFfAaOAHZ7k7wO/m4hDlrhQ7LDZRSEfAbmSF2UtICp5UbYCwmr+gfkZvAI2APuA0z6RqRG3hOImL5TwSOfVoDPhH2A9cMNFCySOgCTJiznASucF0blwDFhl7y2IKAFJk8+gA6w/0MPGi55AI/e0hgPAbOCKiyQkl4BhwO48ks+G3jEWmAKMAxq4J/AFWAosAr66aEzCBDS0Om1lfiHJ+2kBLAT+8JzYQis9HfjgIjEIEzAC2G/2I2BQSsl76QSstZXOoPlJrfq5i0QQJmA48K/ZD4HBRRAg6gKLgQWeXE6YKI3lkYQJ0ECmsmlufpollI1JNo5LkJCtcoqcZMMECJXRrpQ2cRz+BNY5D/4C1jgvhFwCRD5ttA7wK/DZxusXCbrLEisn8Q7oAjwxPytRAkRSETrEdJhlUJtUn79gfV+t+ZV7+n/qA5dsgwtt8llmZyWOAJFExEEb8MKQoG3Acus6frwd8D+gja1kVuIKEHFFeIe5j75Dy4s2qOaiecBrF63mHNDb7L+B1WYHSCJAxBHhH6cv29VStzSdxgN8n3sLGA9cdRGYC6wwW8OhPjcrSQWIKBF+Af4bmWaj+cA0z+fr4BriuT+39bzvvbX1rC01HwEil4goARlU6+r3P5l/G+gDvDX/qY0dooNdngLkK0CEiUhyqe9mAjMivF3njE21op/5AQoRIPwi/D+rdAZumh3GGGCP2epQ2i9ajeM2gwmNMhoxAhQqQPhFZDgFDHRebvT/E8xWZ5oBXLT7hNBfnQ8B0hAgVCqbrGcLfXuTgcfmRyGhJ81WS20JXAfaW6ydDZUB0hIgNIh1t02Yz2+id4COZqvdbgWamK+y1GgRIE0BhaINPNPsLcBUs/WFNE27jRYD7QHtBaHNnGkERz1dLUA5CdClX13Me80Umk6XOc9HOQkQe31jg+r+Z+CZi/goNwG9bJptZsnrVrbTZZuFchMg1HF0kVEbfWN5hlKOAhJREVBqKitQamr9CnwH0gXZMa3m8EwAAAAASUVORK5CYII=',
	forward: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADsklEQVRoQ+2Y2YsVRxjFf+OKggRMVBQhBhIVI4rJg6hRI6KERBEVMYjLiyiCLyaI+B+IWxBFfcmLC4qo8cEEIgm4gaB5cIu7EIgEQQQV3DAunJnTPXd6uvv2vd33XgfuD4aur4aZ/k5X1VenqoUuTksXz78poOE0p1CjqdcIdAc+B94A1/wshHoI+AI4CHzmd94EFgKXHOei1gL6AHeAIWFPG4+AGcBfYU+V1FrATOB3t5966vRzXIiIWgtYDOx1ez+wEfgT+Mh9uUXUWsASYI/bErIUGBMR8dgjdd5xRTRCgChMRKMEiEJE1ErAKGAcMB+Y675gCpUSFVHxmihSgBJe7oQHh73t/OzfRxkL/FGtiLwCugHLgNXQumEl8RZYABwJezpStYg8AiYA24Evw552lMBF4CpwBThrC5FGVSKqEdAb2AasiPz9E+AYcMCJ/B/+JjtxIqYClx13olIBA4CjwFdhDzwDfvImJRF5iYrQCKpP07ATlQj4FDgBfBL2wCFgDfBf2FMMSvgU8IHjkTaBncgqoD9wDhju+BWw1lOpFqi8ni4RMAK45XYHsgjoZUP2tWNNme+Ak46LJro3KHHtK68ddyCLgM3Aj25rYarOH3dcNNHktYinuaLFUk6ANqcL0HqiEquA3W6Xo4cT+dDx334mEZd87jL6K/Ct25qTmkax1QAYBMxx2ZNwrZdAuPjB1SqOqpIXaQI074KvpkWrpOK+4hRgHfCNd+YkZKu1a0epOnmRJmCLv5rQBhWYsgAdE3fE9Jfy3MdKUXczd8PlS8jHHHZbTAR+AQaGPW0L/Azwm62D6vasmANNQK4vH5A0AvqnD9xW2dRCfOFYu7DKal/HSnwXsBX4x30BcScyUUjyIkmA5rV2QqEDxni3h7qkBZXlLvB9yovjBBSWvEgSMK/E+mqqKBaq/9rExG1XpTQbUXqo3wdsKjJ5kSRAX1WuUui5CJjsUipeelTKXU5NtzETdb1W0VcOdls9ZzsRJSRUz4MKlYastxbzx2FPG7m/fEDSCExyJRGqLLoKvOc6L08yzHEWdCeqq8XRjnWw0YiWG71MJAnQy+TDhQ4TqjL6ETJx8ieVoPfoblT24nrKbl4xSQJknx+6rfKp2h4s5PXABrcbTpIAoZoezF1ZiZ5uy1IkusN6kyZgp91nKfdtIQqbAnlJE6DFp4VW6ihlpaOiGkqaALHSx0aVw3/tgbJWn7pQToDQTYTKpqy0fNF7RRYB7zVNAY2mOQKNpsuPwDtTxdoxFswl9AAAAABJRU5ErkJggg==',
	copy: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADiUlEQVRoQ+2YSagVRxSGPyfEgIhjiAO4cSOKSkI0qDjgrFHEhaLRBIniwkAIwQlFBcWFAwiKIM4bcRNBUUHECUyMsyK4EgUnnOcJR/73Tpfl9Xbd7ttP+wn327xzzutbXX/XqapTVYevnDpfef8rAnKnkkJ5UxmBAhoAg4GOFF8gbgDbgccukpFiLymXTsA/QAcXKc514GfglItkoKYENAXOA61dJMxdoK/9JhM1JWAWsMTsR8Bm4Jn5ERMLBCqdegMXXaQMakrADksL8Tuw3myf/4Aezqvmsom46iIpqSkBBywlRD/goNk+xQSIC0Af4LaLpCAvAfOAuUBD68c5+wD3zU9MWgH1gQnAMKCZi8L3NpHFUmA+8Nz8CH8EfgLaANuAehY7AgwqMneCpBHQGNgD9HSReE7YfnDPReBf67joZR3+Ddjg9WMvMBJ4aX5J0gjYaC9Myv/AAOCJ+dojRpt9GNht9jigq9lCz40FXrtIgKQClB63LIXE4iITtQuwzHnV7AeGAy+AoV6nS7EQWOC8AEkFaOiVAuIM0M1sH01CrUaF7ATGAK+gavJqfkR5H4dSqDnw1EViSCrA75y+vJbKQvxnNIEbmS22Ar8Ab63k0Pxo6f77gfFAO7O7A8fMjuVzCdAzGrE55otNwGTgnYt8SpL95CM+pwA9sxz4y2JiJfCn8z4lVwEqCbS6iJPAD0BdW70mWVxoHixy3sfkKuA74Jo3qspfFXZauVQq+KP9B7DKeR/IVYBYA0yzzoTQGv8jcNpFqsldwDfACmBqgvm1GpjuvGpyFxChul8nMx0xffzNbh8w0OyIWiMgjmIrlc8XF6AOKJdDaFddZzVRrRPwAGjiuhqP1n7tAaUEqExRmgmVL0fNjqXURIuIe/FMqzhDqL7XZqazr9/OWeBvs0V/YLbZqptaQdUHCpJVQFr8dkIo5aY4L0BtFHAIGOGdI4JkFbDLjpch1BHdWOh3fjs6/6rkiLhj7alyfeOiJcgq4BLQ3uwQvwJbAu2UTVYBLWzVCLXzEDhudlw7ZRN6sY9uHXRQF7qM0i6b6MxagCbmWrN1GTbK7LJJKkD3Nze9NV9ls24Q0oj41m7tdLshZtgVTCaSChBaszO/0LgCdLb0ykQaAXpWBxF9ueh2ohx0lahDvv5mJo2ACK06Q4C2KYXoa2v3TZt6QcoRUKuoCMibygjkTWUE8uY9E/3WMUTEZiUAAAAASUVORK5CYII=',
	star: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAETElEQVRoQ+2YR6gtRRCGv2fAZ/Yp5oCi+BRURFBQwYUJMSCmhagL0WfOLkxgBHVjzpjAgGIE0YVxIehCFFFRxICKEQVzznyc6nbO4c45Mz1zuF64H1xOVc+d8M9UV1X3AuY4C+b4888LmHXmQ2gMKwBXAP8AZwK/5CM9Ms0vcClwTsU+L+xemZaA5YGPgTXC/xrYEPg5/N6YloBjgFuyN2AJcFv2emJaAl4DtsnegDeBrWNO9MY0BOwGPBP2D/G7cvx67Lmwe2EaAh4D9gv7urjHSeF7bP+we6FvAZsA7wJLR6hsCfwNvA0sFfbmwPv5jI70LeBq4NSwnwD2rdh7h30VcEbYnelTgHFu6lw1/D2Bpyv2k2E7LzYAvg+/E30KOAW4Jux3gC0qGcf7mIUMKTkZuD7sTnQVsGK8zXUix28W4ycAN4WdOB64Mez3gKOBL4BPgJ9ivDXjBKwZE25dYH1gvYrtrw+e0mOVb6Lqjj6UYg2xRXnkPwwrhXwOfBq/n1Vsv+hX+b8r1Ak4Kiqp2aQtlwHnZm+Yan/Uhr+AY4Hb80hQJ+BB4ODs1fNrvKn0tqzAVwK/5f8YZrnoTK3S6av6tzD/Rz0PAYdkL6gTsENkkFXyCLwcE8+49WF9aJu0Plg9hCjK+XQisH0+OshYewAv5ZGgToBsFfl7ozwC1wKn9d3PjHBWhGF6Nl+U9eTV8IcYJ0CcrI8D2+URuCs6y9/zSD8sA9wQnWziDWCfmPwzMkmArATcHxdK2JAdBHybR7phNnsA2CuPDELYeTi24DURIGYjGzNzeeKtaA8+yiNlGPd+5W3zCNwBHAf8kUdqaCogYZ9jlrExEye08flK+G0xGznPrCni3LoYuDD8ibQVIIcCd0ZKlB+BnYHXw2+KD/9ChKiYeo8E7gu/ESUCZBfg0Uh/cj5wSdhN8ZyLwjYdHwA8H35jSgWIcZsm9uHAvWE3xXPuDttrpUVQK7oIMP7XDntx9Ctt8BwXOvJl5VqtKBVgcUvZ57sIJVdbbfDehs5q4XvN2nxfR6mAA4GHw7YmuFifiU3jt24J+Sywa9jWlUfCbkypgMuj5Cd7tMO0ZTYVupj3HvdEEzfaEk+6zkRKBYx7c3aMNn1r5ZEBrhPOBm6t9FKea5cpXnP3sBtTIqAudl2NueKyaxyHqdKKbiXvPJdKBIxmD1dfp0dOT8VNbLmt3K4Z/CIb5yODFsGKbph92CWblQg4LGJaPoiHcemZ0Hd7RUFpWely8oJoxZeNMfFh9d1Pktb1pESAOw/uQMyEPZFNmIufmXBv9GZgpzwyjNdWZGNKBLwI7Ji9AbbVhoOh4vp1HN7ziAihtP2e8Nr2VY0pEWA2SRNYbL7cabMyt8GloyJsDhNeO/VXjSgRkLYJLU7u/zyVj5Thrp3Zy6LXuicqEeDixh02M9GfebQbTmR38kytk0JwiBIB/yvmBcw2819gtpnzX+BfkCbQMXaLFi0AAAAASUVORK5CYII=',
	info: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEBUlEQVRoQ+2ZS8hVVRiGH4VSrIaKkxKjslIbpYGXGqZmpuagNCgaSGlEpKVGoRFeuhhEF20SkZSBlYiB1qy8YNQkCrSsIGtSDdVMCpOX867N4vfsvdfa++jhh/NM/m8tzjl7v2t9t7X+EQxzRgzz9x8I6DsDF+o3gx3owgRgCjARuMJzp4FfgO+BE57rCb3agcnAw8Aiv3gVEvIJ8A5wtJhtSFsBNwIvAnc3+K3/gT3AWuCHYjaT3IcGRgLPAM8BlxezHc4AXwO/AX96bhxwNTAdGO25wFngeS/EuWI2kSYC5Ne7gLnFTAet5nvAZ/b5bui7c4AHvWsxnwL3VXy3K7kC9AKfAzOKGTgCrAIOFzNpzAS2ArcVM3AIuDNHRI4AuY1WKV75N4EngP+KmTwuA14DHi1mOs+4J9WdcgQ8C7xQjDqr/moxasdq4OVi1ImvzcWoglQByjbfRgGrlX/MdhXX++9x/61iG/CIbQX2LcCPHpeSKkABusC2fH52gtu8FbmG7JW2y5A7KQameaxaca/tUlIEqEh9F31WwVcXsFr5oat3Q8JOaGG+tK0YUEWvLHYpAl6xvwvtxELbVTQVIPYC822/BKyx3ZUUASr9oT1YDOy2XYfiZEVkp8SMkNt8ZPunKI66UifgGuBX26qwY3NydGYQB64E/ooqtir477YvoE7AXc7LQr55h+2LjZ6leBDzgH22L6BOgLb9ddsfAMtsp6DCt9T2+27eUtGz7ret7KUs1pU6AeuATbZV9lVwUnkA2BHZEpFKnDgqi1qdAH15o+1cARuA9bbVbWqcip71pO1WArR9b9jOdaE2Ana6MxWtXKhNELcRcACYZbtVEMdp9B+n0VMe19FUwFVOo6M8bpVGxc/AtbZVZNSjpNBUwBIfmITqhyp4KSkC1OaG4FWZD01dHU0FyGXlukLHTJ2ZS0kRcLOvQ8JnVWAO2q6iiYDbgS9sq5lTI3nM466kCBDqf0IT95VF/OtxGXENqUyFRu20utxbPf7Y7lRJqoBJPtCEwNLhIzRqZVzn7KEKrGOoYqmKt4HltpUwprqZqyRVgIhXVDzlitkLnra/B9RCq5WuJUeAehudB0KvLrYDjye4UxlyGxXKsPJCz9ANX1LvlCNAjPG1ik5lAV1iqW9R8clBAauWIfi80G/o3ujvYqaGXAFCd0MfDtkJoRSri639FcVOvb5e8KEoVQa08upek19eNBEg5E7yU6XJENgBBeA3voX+w3PjXVF1YO/2ef2O6k2S28Q0FRBQldziiyiJykF5XulZhao225TRVkDgJruFzsxKn1WoPVA78m5dkUqhVwJi5CrhHxxqzMTJ6B8cpY1ZEy6GgEvKQEC/GexAvxnsQL85DwlLxzH/k/6QAAAAAElFTkSuQmCC',
	report: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD10lEQVRoQ+2YXahUVRiGn+Mv/iCUQgopGtqvFhYK/nVhoiaYFUqZCipeSGJBYGYgpReKepGo5VUmWCkGat2kQV1oGhiakuYvIopoFyaooWZavPTuw2KY2bNmzx52B+a52e835+zZ69trrff71rTQxmlp4+NvJlA4zSVUNM0ZKJpGz0B7X+/5mjuNSuBRYB0w1vH3wFvAGce50YgEegNHgIdaP/mPK8BQX3OjEQlsAWZa3/e1na+fA7OscyHvBEYA+4PvneDrHl//AUYBPzmumzwT0FvWwIY73g68Fuhp1oeBYcHs1EWeCcwBNlnfAp4EzjvuC5wEujrW/262rou8EugOnAb6OF4OfGCdoM+WWv9up7ruODN5JbASeM/6EvAY8KfjhC6ehX6Odc/71pnJI4FHgN+Azo7lQF8AA4AVLmJLgIvADDuRuONlds5xJvJIYAfwirU2sVxGbrMt2MRfevB6nlxKbiV2Aq9aZ6LeBFRpVWWFXEUDO+hY1jneejfwovWzwM9BbZDVfmddM/UkoD7nF2CI48+AudbiG2Cy9a5gloT+d7a1lt8zwN+Oa6KeBBYAG6xveONediy+AqZaazlNtxZqM+RaPRzruz6xromsCTzgAfRyLAdaZZ2gjfyGtTxf3h+ie+RE4g/b6lXH0WRNQJ3mQmu5yFPAbccJKmrJoDcCb1ondAKOAYMc6zvfto4mSwJPAEeBjo61trXGS9Gg51t/BLxjHaJ75WJCe0Ab/FfHUWRJQI6SNGk/AC9Yl7I2eKNpRSt0KznaOOsoak1gSvC2VaDU31d6Y6uBRdYfAsusS1Ex04x2cKxnyMGiqCWB0jUr15B7VCLsfRY7oUp8HOwRndoGA385TqWWBPQ2k0HEuMbLrrRiYnAmKEdPu9qDjt8F1linEptAqW/rfLveOg0VKKElUg25mpxIqEvVC1LXmkpsAp8GVfaEB3bXcV5oD+iwk1R2PXOedUViEnjO/U2tvcvD3rh6hjbxhda/VEZulCw19VY63R1yXJZqCejve4HRjuUOcokYQrvVoLQPYvgaeMn6R+B5d7dlqZbA68BWa7mCKu5Zx9VQ2zzS+oDb7BgGAsftekI9lHqpsqQloCVzyl8o5Apyh1ie9qbUM1TQ9FtRLGENka2qUSw7C2kJ6CYdAcU1oH8eZ9hI5Hb6QUBNo5Ajlf1VLy0B3aQZEPJ9uVDpObdRdPOZoa4EtIRkmbq5SFR/Hs+yhMQY4Fu/kSK4CUwC9lV6eLUEhGZAPY/2RPJzeaNRo6j9px6p7NJJiEngf00zgaJpzkDRNGegaNr8DPwLCKqxMZFRjaYAAAAASUVORK5CYII=',
	trash: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEdUlEQVRoQ+2YZcgtVRSGn2uhKIgFKoKIgdigKGJ3t1g/7BYDC/uHgd3YetUfdisGih2YYGCiIljYgt3ywDvD+HnmumfO4X5c/J5f71qz9zrzMnP2XnsmMY0zaRq//wkD487EK9RgOmAPYDNgljr7T34E7gGuAv6qs0Mwqifgzd8FbFpnpowmtgT+rDM9GZWBvYDL66iMPfMkhmJUBu7OqyNXADdHj2W7mBXnbBHdm1EZeBRYM3ot4LHosTjGseIYxw7F/8LAEsApwGy17X+zPDBH9EvAN9FjcYxjxTGObeN74BjgzTozgJIncDuwVR1NXfztbab0kyUGjgVOrqOpi0/g1Cn9ZIkBWQ6YGzgaWDu504CHo4dlHeCo6Edy018CLyfXSqmBisuAvaP3TTwKrHVJtDWNi+hq4Ezg8OgjE48Ca50ebU3jIroaOA44KdqVyVgWAXYGrgfeSs7a1dNqPilXtR2Aa4H3kvM/5n9Nju/yn+tq4CDg/OgLE8v9wIbA08Cqya3R2NDUT0Q/A6ycORsndwFwYPTBiYvoamA3YHL0NYnlydz4+8DCydms3RHtMnxntGMWypzVk7PWLtHWNC6iqwHX5Fujm2v0g8B6wKfA/Mm1GXDMvJmzQXLNvcaaxkV0NbAu8FC0S6ix2EpvDnzb2JHbDDhm9sxxjFirWp6tWbw8dzWwIvBc9AuJ5UZge+AXYObk2gw4ZqbM2TE5a60QbU3jIroaWLzRm7ydWK4Gdo2ePgeVQQY8+PyRnHN2j7bWYtHWNC6iqwHf74+jm+/7xcB+0bPm6DjIgNds0sQ5B0RX/wuxpnERXQ3YkX4X7U16Q3I2cGi0LcdXLQa89kVyzqk2RWtV52h/44fo/6SrAcf/CsyQeEbg9zEb0QJ5SoMMeO3D5JzjpmWt35Kzlv+P4gN/VwPydWOlmStxc4deFHi3xYDX3knOOe7m1rBxE2sZF9PHwAfAgtFuSMaHAWcltwzwWosBr72SnHPOSQ03N7GWcTF9DLwKLB29bOL9gYuSWwl4vsWA155Nzjl2oNao2mZrGRfTx8BTwCrRqyVuthge3B9vMdA81FctgzWqPslaxsX0MXAfsFG0H7LuTXd5Q3Jee6DFgNecL865KTX80CVe2yS6iD4GvFF/XHZK7Pcdb1C2zo0PMuC125Jzjt+GrHFdctYyLqaPgUGnMhs5mzOpTNkb2e9IdbO2Dp4ZZP30VfsAlybn1z3jYvoYGHQqmycrj32QPY3LqDvri1nTzX2WdsE+x43LhcDl8wjgjNRzJTMupo8BN58To6vNSNxJ7YOqVkHsfaT5Eded1n7op8TuH9XJ7oTGflJEHwOemM6Lbp7K+tI8jR3SOPEV0cfAtsAt0b42tr8/J+6Kr5yv1FKJrV39yYvoY2BO4KNG8/UJ8EZ0V5YE5ov2f2Gv1PZZciB9DIiP+tw6Gg2dDvMVfQ2I3/ltxlyBhuHzdLJX1pkODGNAbIV9f+3z++DZ4PW00b0Y1sC4M2FgvJl4AuPNNP8E/gYxlgJAIuFKTgAAAABJRU5ErkJggg=='
};

function emojiToUnicodeKey(emoji) {
	return [...emoji].map(c => c.codePointAt(0).toString(16)).join('-');
}

function resolveEmojiB64(emoji) {
	const base = emojiToUnicodeKey(emoji);
	const variants = [
		base,
		base.replace(/-fe0f/g, ''),
		base.toUpperCase(),
		base.replace(/-fe0f/g, '').toUpperCase(),
	];
	for (const v of variants) {
		if (emojiImageJson[v]) return emojiImageJson[v];
		if (fallbackEmojiImageJson[v]) return fallbackEmojiImageJson[v];
	}
	return null;
}

async function drawEmoji(ctx, emoji, cx, cy, size) {
	const b64 = resolveEmojiB64(emoji);
	if (!b64) {
		ctx.fillText(emoji, cx - size / 2, cy + size / 4);
		return;
	}
	const img = await loadImage(Buffer.from(b64, 'base64'));
	ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
}

async function preloadEmojis(text) {
	const emojis = emojiDb.searchFromText({
		input: text,
		fixCodePoints: true
	});
	const emojiCache = new Map();
	const promises = [];

	for (const emoji of emojis) {
		if (!emojiCache.has(emoji.found)) {
			promises.push((async () => {
				try {
					const b64 = emojiImageJson[emoji.found] || fallbackEmojiImageJson[emoji.found];
					if (b64) {
						const img = await loadImage(Buffer.from(b64, 'base64'));
						emojiCache.set(emoji.found, img);
					}
				} catch {}
			})());
		}
	}

	await Promise.all(promises);
	return { emojis, emojiCache };
}

async function preloadReactionEmojis(emojiList) {
	const cache = new Map();
	await Promise.all(emojiList.map(async (em) => {
		if (cache.has(em)) return;
		try {
			const b64 = resolveEmojiB64(em);
			if (b64) {
				const img = await loadImage(Buffer.from(b64, 'base64'));
				cache.set(em, img);
			}
		} catch {}
	}));
	return cache;
}

async function loadIcons() {
	const icons = {};
	for (const [key, b64] of Object.entries(ICONS_B64)) {
		try {
			icons[key] = await loadImage(Buffer.from(b64, 'base64'));
		} catch (e) {
			console.error('[ICON FAIL]', key, e.message);
		}
	}
	return icons;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
}

function validateInput(text, time, opts = {}) {
	if (!opts.sticker && (!text || typeof text !== 'string' || text.trim() === ''))
		throw new Error('Parameter "text" wajib diisi dan tidak boleh kosong (kecuali pakai sticker).');
	if (!time || typeof time !== 'string' || time.trim() === '')
		throw new Error('Parameter "time" wajib diisi (contoh: "10:30").');
}

async function validateSticker(stickerPath) {
	const STICKER_MIN = 64;
	const STICKER_MAX = 1024;

	let img;
	try {
		img = await loadImage(stickerPath);
	} catch (e) {
		throw new Error(`Sticker gagal dimuat: ${e.message}`);
	}

	const w = img.width;
	const h = img.height;

	if (w !== h)
		throw new Error(`Sticker harus rasio 1:1. Ukuran kamu: ${w}×${h}px.`);
	if (w < STICKER_MIN)
		throw new Error(`Sticker terlalu kecil (${w}×${h}px). Minimal ${STICKER_MIN}×${STICKER_MIN}px.`);
	if (w > STICKER_MAX)
		throw new Error(`Sticker terlalu besar (${w}×${h}px). Maksimal ${STICKER_MAX}×${STICKER_MAX}px.`);

	return img;
}

async function drawStickerChat(ctx, stickerImg, time, bubbleY = 300, reply = null) {
	const STICKER_SIZE = 220;
	const bubbleX = 22;

	let currentY = bubbleY;

	if (reply) {
		const replyBubbleW = 260;
		const replyBubbleH = 88;

		ctx.fillStyle = '#1a1a1a';
		ctx.beginPath();
		ctx.roundRect(bubbleX, currentY, replyBubbleW, replyBubbleH, 14);
		ctx.fill();

		drawReplyBlock(ctx, reply, bubbleX, currentY + 10, replyBubbleW);
		currentY += replyBubbleH + 8;
	}

	ctx.drawImage(stickerImg, bubbleX, currentY, STICKER_SIZE, STICKER_SIZE);

	ctx.font = '18px SFPRODISPLAYREGULAR';
	const timeWidth = ctx.measureText(time).width;
	const timePad = 14;
	const timeH = 30;
	const pillW = timeWidth + timePad * 2;
	const pillX = bubbleX + STICKER_SIZE - pillW;
	const pillY = currentY + STICKER_SIZE + 8;

	ctx.fillStyle = '#2a2a2a';
	ctx.beginPath();
	ctx.roundRect(pillX, pillY, pillW, timeH, timeH / 2);
	ctx.fill();

	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'right';
	ctx.fillText(time, pillX + pillW - timePad, pillY + timeH - 8);
	ctx.textAlign = 'left';

	const totalH = (currentY - bubbleY) + STICKER_SIZE + 8 + timeH;
	return { bubbleWidth: STICKER_SIZE, bubbleHeight: totalH, bubbleX, bubbleY };
}

function getTextSegments(text, emojis) {
	const segments = [];
	let currentIndex = 0;

	const sortedEmojis = [...emojis].sort((a, b) => a.offset - b.offset);

	for (const emoji of sortedEmojis) {
		if (currentIndex < emoji.offset) {
			const textBefore = text.substring(currentIndex, emoji.offset);
			for (const char of textBefore) {
				segments.push({ type: 'text', value: char });
			}
		}

		segments.push({
			type: 'emoji',
			value: emoji.found,
			code: emoji.found
		});

		currentIndex = emoji.offset + emoji.length;
	}

	if (currentIndex < text.length) {
		const remaining = text.substring(currentIndex);
		for (const char of remaining) {
			segments.push({ type: 'text', value: char });
		}
	}

	return segments;
}

function drawReplyBlock(ctx, reply, bubbleX, startY, bubbleWidth) {
	const BORDER_W = 4;
	const REPLY_PAD = 12;
	const LINE_H = 22;
	const MAX_LINES = 3;
	const blockX = bubbleX + 12;
	const blockW = bubbleWidth - 24;
	const ACCENT = '#ff4d6d';
	const maxW = blockW - BORDER_W - REPLY_PAD * 2;

	ctx.font = '18px SFPRODISPLAYREGULAR';

	function wrapText(text, maxWidth) {
		const words = text.split(' ');
		const lines = [];
		let currentLine = '';

		for (const word of words) {
			if (lines.length >= MAX_LINES) break;

			const testLine = currentLine ? currentLine + ' ' + word : word;

			if (ctx.measureText(testLine).width <= maxWidth) {
				currentLine = testLine;
			} else {
				if (ctx.measureText(word).width > maxWidth) {
					if (currentLine) { lines.push(currentLine); currentLine = ''; }
					if (lines.length >= MAX_LINES) break;

					let charLine = '';
					for (const char of word) {
						if (lines.length >= MAX_LINES) break;
						const testChar = charLine + char;
						if (ctx.measureText(testChar).width <= maxWidth) {
							charLine = testChar;
						} else {
							if (charLine) lines.push(charLine);
							charLine = char;
						}
					}
					currentLine = charLine;
				} else {
					if (currentLine) lines.push(currentLine);
					currentLine = word;
				}
			}
		}

		if (currentLine && lines.length < MAX_LINES) lines.push(currentLine);
		return lines;
	}

	const fullText = reply.text || '';
	let replyLines = wrapText(fullText, maxW);

	const renderedText = replyLines.join(' ');
	if (renderedText.length < fullText.length) {
		let last = replyLines[replyLines.length - 1];
		while (last.length > 0 && ctx.measureText(last + '...').width > maxW) {
			last = last.slice(0, -1);
		}
		replyLines[replyLines.length - 1] = last + '...';
	}

	const REPLY_H = 28 + replyLines.length * LINE_H + 12;

	ctx.fillStyle = '#2a2a2a';
	ctx.beginPath();
	ctx.roundRect(blockX, startY, blockW, REPLY_H, 8);
	ctx.fill();

	ctx.fillStyle = ACCENT;
	ctx.beginPath();
	ctx.roundRect(blockX, startY, BORDER_W, REPLY_H, [8, 0, 0, 8]);
	ctx.fill();

const totalLines = replyLines.length;
const t = (totalLines - 1) / (MAX_LINES - 1);

const senderRatio = 0.41 - t * (0.41 - 0.28);
const textGapRatio = 0.36 - t * (0.36 - 0.22);

ctx.fillStyle = ACCENT;
ctx.font = 'bold 20px SFPRODISPLAYREGULAR';
ctx.fillText(reply.sender, blockX + BORDER_W + REPLY_PAD, startY + REPLY_H * senderRatio);

ctx.fillStyle = '#cccccc';
ctx.font = '18px SFPRODISPLAYREGULAR';
for (let i = 0; i < replyLines.length; i++) {
	ctx.fillText(
		replyLines[i],
		blockX + BORDER_W + REPLY_PAD,
		startY + REPLY_H * senderRatio + REPLY_H * textGapRatio + i * LINE_H
	);
	}

	return REPLY_H;
}

function measureBubble(ctx, text, emojis, rbWidth, reply) {
	ctx.font = '24px SFPRODISPLAYREGULAR';
	const fontSize = 24;
	const maxBubbleWidth = rbWidth > 0 ? Math.round(rbWidth * 0.82) : 460;
	const padding = 40;
	const lineHeight = 48;
	const LINE_H = 22;
	const MAX_LINES = 3;

	let minBubbleWidth = 100;
	let REPLY_H = 0;

	if (reply) {
	ctx.font = 'bold 20px SFPRODISPLAYREGULAR';
	const senderW = ctx.measureText(reply.sender).width;

	ctx.font = '18px SFPRODISPLAYREGULAR';
	const approxMaxW = maxBubbleWidth - 80 - 4 - 24;

	function countLines(text, maxWidth) {
		const words = text.split(' ');
		const lines = [];
		let cur = '';
		for (const word of words) {
			if (lines.length >= MAX_LINES) break;
			const test = cur ? cur + ' ' + word : word;
			if (ctx.measureText(test).width <= maxWidth) {
				cur = test;
			} else {
				if (ctx.measureText(word).width > maxWidth) {
					if (cur) { lines.push(cur); cur = ''; }
					if (lines.length >= MAX_LINES) break;
					let cl = '';
					for (const ch of word) {
						if (lines.length >= MAX_LINES) break;
						if (ctx.measureText(cl + ch).width <= maxWidth) { cl += ch; }
						else { if (cl) lines.push(cl); cl = ch; }
					}
					cur = cl;
				} else {
					if (cur) lines.push(cur);
					cur = word;
				}
			}
		}
		if (cur && lines.length < MAX_LINES) lines.push(cur);
		return lines.length;
	}

	const lineCount = countLines(reply.text || '', approxMaxW);
	REPLY_H = 28 + lineCount * LINE_H + 12 + 12;

	const replyTextW = ctx.measureText(reply.text || '').width;
	const replyContentW = Math.min(Math.max(senderW, replyTextW), maxBubbleWidth - 80) + 80;
	minBubbleWidth = replyContentW;

	ctx.font = '24px SFPRODISPLAYREGULAR';
}

	const segments = getTextSegments(text, emojis);

	function measureSegment(seg) {
		return seg.type === 'emoji' ? fontSize * 1.22 : ctx.measureText(seg.value).width;
	}

	let lines = [], currentLine = [], currentWidth = 0, currentWord = [], currentWordWidth = 0;

	for (const segment of segments) {
		const segW = measureSegment(segment);
		if (segment.type === 'text' && (segment.value === ' ' || segment.value === '\n')) {
			if (currentWidth + currentWordWidth > maxBubbleWidth - padding) {
				if (currentLine.length > 0) lines.push(currentLine);
				currentLine = [...currentWord]; currentWidth = currentWordWidth;
			} else {
				currentLine.push(...currentWord); currentWidth += currentWordWidth;
			}
			currentWord = []; currentWordWidth = 0;
			if (segment.value === ' ' && currentWidth + segW <= maxBubbleWidth - padding) {
				currentLine.push(segment); currentWidth += segW;
			}
			if (segment.value === '\n') { lines.push(currentLine); currentLine = []; currentWidth = 0; }
		} else { currentWord.push(segment); currentWordWidth += segW; }
	}

	if (currentWord.length > 0) {
		if (currentWidth + currentWordWidth > maxBubbleWidth - padding) {
			if (currentLine.length > 0) lines.push(currentLine);
			lines.push(currentWord);
		} else {
			currentLine.push(...currentWord);
			if (currentLine.length > 0) lines.push(currentLine);
		}
	} else if (currentLine.length > 0) lines.push(currentLine);

	let maxLineWidth = 0;
	for (const line of lines) {
		let lw = 0;
		for (const seg of line) lw += measureSegment(seg);
		maxLineWidth = Math.max(maxLineWidth, lw);
	}

	const bubbleWidth = Math.max(minBubbleWidth, Math.min(maxBubbleWidth, maxLineWidth + padding + 58));
	const bubbleHeight = Math.max(60, lines.length * lineHeight + 22) + REPLY_H;

	return { bubbleWidth, bubbleHeight, lines };
}

function drawBubbleChat(ctx, text, time, emojis, emojiCache, bubbleY = 300, reply = null, rbWidth = 0) {
	ctx.font = '24px SFPRODISPLAYREGULAR';

	const fontSize = 24;
	const lineHeight = 48;

	const { bubbleWidth, bubbleHeight, lines } = measureBubble(ctx, text, emojis, rbWidth, reply);

	const REPLY_H = reply ? (bubbleHeight - Math.max(60, lines.length * lineHeight + 22)) : 0;

	const bubbleX = 22;
	const radius = 26;

	ctx.fillStyle = '#1a1a1a';
	ctx.beginPath();
	ctx.moveTo(bubbleX + radius, bubbleY);
	ctx.lineTo(bubbleX + bubbleWidth - radius, bubbleY);
	ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + radius);
	ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - radius);
	ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - radius, bubbleY + bubbleHeight);
	ctx.lineTo(bubbleX + radius, bubbleY + bubbleHeight);
	ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - radius);
	ctx.lineTo(bubbleX, bubbleY + radius);
	ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
	ctx.closePath();
	ctx.fill();

	if (reply) {
		drawReplyBlock(ctx, reply, bubbleX, bubbleY + 10, bubbleWidth);
		ctx.font = `${fontSize}px SFPRODISPLAYREGULAR`;
	}

	ctx.fillStyle = '#ffffff';
	let y = bubbleY + 40 + REPLY_H;

	for (const line of lines) {
		let x = bubbleX + 24;
		for (const segment of line) {
			if (segment.type === 'emoji') {
				const emojiImage = emojiCache.get(segment.code);
				if (emojiImage) {
					ctx.drawImage(emojiImage, x, y - fontSize + fontSize * 0.15, fontSize * 1.22, fontSize * 1.22);
					x += fontSize * 1.22;
				}
			} else {
				ctx.fillStyle = '#ffffff';
				ctx.fillText(segment.value, x, y);
				x += ctx.measureText(segment.value).width;
			}
		}
		y += lineHeight;
	}

	ctx.fillStyle = '#999999';
	ctx.font = '18px SFPRODISPLAYREGULAR';
	ctx.textAlign = 'right';
	ctx.fillText(time, bubbleX + bubbleWidth - 14, bubbleY + bubbleHeight - 8);
	ctx.textAlign = 'left';

	return { bubbleWidth, bubbleHeight, bubbleX, bubbleY };
}

async function generateIQC(text, time, opts = {}) {
	validateInput(text, time, opts);

	const width = 680;
	const height = 1209;

	const reactionEmojis = opts.reactionEmojis !== undefined ?
		opts.reactionEmojis :
		['👍', '❤️', '😂', '😮', '😢', '🙏', '🤦'];

	if (reactionEmojis.length !== 6 && reactionEmojis.length !== 7)
		throw new Error(`Reaction emoji harus tepat 6 atau 7. Kamu memasukkan ${reactionEmojis.length}.`);

	const showReactionBar = reactionEmojis.length > 0;
	const showPlusBtn = opts.showPlusBtn !== false;

	const RB_HEIGHT = 80;
	const RB_EMOJI_SZ = 50;
	const EMOJI_SPACING = 70;
	const RB_PAD = 20;
	const PLUS_DIAMETER = 52;
	const PLUS_RADIUS = PLUS_DIAMETER / 2;
	const PLUS_GAP = -22;
	const RB_GAP = 8;

	let rbWidth = 0;
	if (showReactionBar) {
		if (reactionEmojis.length < 7) {
			const slot7CenterX = RB_PAD + RB_EMOJI_SZ / 2 + 6 * EMOJI_SPACING;
			rbWidth = slot7CenterX + PLUS_RADIUS + RB_PAD;
		} else {
			const emojiAreaWidth = 6 * EMOJI_SPACING + RB_EMOJI_SZ;
			rbWidth = RB_PAD + emojiAreaWidth + PLUS_GAP + PLUS_DIAMETER + RB_PAD;
		}
	}

	const [{ emojis, emojiCache }, reactionCache, icons] = await Promise.all([
		preloadEmojis(text),
		showReactionBar ? preloadReactionEmojis(reactionEmojis) : Promise.resolve(new Map()),
		loadIcons(),
	]);

	const ITEM_H = 80;
	const MENU_ITEM_COUNT = 7;
	const MENU_H = MENU_ITEM_COUNT * ITEM_H;
	const menuX = 20;
	const menuWidth = 400;
	const menuRadius = 15;

	const STICKER_SIZE = 220;
	const STICKER_TIME_H = 30;
	const REPLY_EXTRA = opts.reply ? 96 : 0;
	const stickerBubbleH = STICKER_SIZE + 8 + STICKER_TIME_H + REPLY_EXTRA;

	const menuY = height - MENU_H - 10;

	const estimatedBubbleH = opts.sticker
		? stickerBubbleH
		: measureBubble(createCanvas(width, height).getContext('2d'), text, emojis, rbWidth, opts.reply || null).bubbleHeight;

	const bubbleY = menuY - estimatedBubbleH - 10;
	const rbX = 20;
	const rbY = showReactionBar ? bubbleY - RB_HEIGHT - RB_GAP : bubbleY;

	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	const bgImg = await loadImage(path.join(
		typeof __dirname !== 'undefined' ? __dirname : process.cwd(),
		'assets', 'background.png'
	));
	const scale = 1.05;
	const bsw = width * scale, bsh = height * scale;
	const box = (width - bsw) / 2, boy = (height - bsh) / 2;

	ctx.save();
	ctx.rect(0, 0, width, height);
	ctx.clip();
	ctx.drawImage(bgImg, box, boy, bsw, bsh);
	ctx.filter = 'blur(6px)';
	ctx.drawImage(bgImg, box, boy, bsw, bsh);
	ctx.filter = 'none';
	ctx.restore();

	ctx.fillStyle = 'rgba(13,13,13,0.7)';
	ctx.fillRect(0, 0, width, height);

	if (showReactionBar) {
		ctx.fillStyle = '#272B2A';
		drawRoundedRect(ctx, rbX, rbY, rbWidth, RB_HEIGHT, RB_HEIGHT / 2);
		ctx.fill();

		const emojiCY = rbY + RB_HEIGHT / 2;
		for (let i = 0; i < reactionEmojis.length; i++) {
			const em = reactionEmojis[i];
			const ecx = rbX + RB_PAD + RB_EMOJI_SZ / 2 + i * EMOJI_SPACING;
			const img = reactionCache.get(em);
			if (img) {
				ctx.drawImage(img, ecx - RB_EMOJI_SZ / 2, emojiCY - RB_EMOJI_SZ / 2, RB_EMOJI_SZ, RB_EMOJI_SZ);
			} else {
				ctx.font = `${RB_EMOJI_SZ * 0.85}px SFPRODISPLAYREGULAR`;
				ctx.fillStyle = '#ffffff';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(em, ecx, emojiCY);
				ctx.textAlign = 'left';
				ctx.textBaseline = 'alphabetic';
			}
		}

		if (showPlusBtn) {
			const lastEmojiRight = rbX + RB_PAD + (reactionEmojis.length - 1) * EMOJI_SPACING + RB_EMOJI_SZ;
			const plusCX = reactionEmojis.length < 7
				? rbX + RB_PAD + RB_EMOJI_SZ / 2 + 6 * EMOJI_SPACING
				: lastEmojiRight + PLUS_GAP + PLUS_RADIUS;
			const plusCY = rbY + RB_HEIGHT / 2;
			const arm = 7;

			ctx.save();
			ctx.beginPath();
			ctx.rect(0, plusCY - PLUS_RADIUS, plusCX, PLUS_RADIUS * 2);
			ctx.clip();
			ctx.filter = 'drop-shadow(-4px 0px 4px rgba(0,0,0,0.8))';
			ctx.beginPath();
			ctx.arc(plusCX, plusCY, PLUS_RADIUS, 0, Math.PI * 2);
			ctx.fillStyle = '#4A4E4D';
			ctx.fill();
			ctx.filter = 'none';
			ctx.restore();

			ctx.beginPath();
			ctx.arc(plusCX, plusCY, PLUS_RADIUS, 0, Math.PI * 2);
			ctx.fillStyle = '#4A4E4D';
			ctx.fill();
			ctx.strokeStyle = '#272B2A';
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.strokeStyle = '#C0C0C0';
			ctx.lineWidth = 3;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(plusCX - arm, plusCY);
			ctx.lineTo(plusCX + arm, plusCY);
			ctx.moveTo(plusCX, plusCY - arm);
			ctx.lineTo(plusCX, plusCY + arm);
			ctx.stroke();
		}
	}

	const reply = opts.reply || null;

	let bubbleWidth, bubbleHeight;
	if (opts.sticker) {
		const stickerImg = await validateSticker(opts.sticker);
		({ bubbleWidth, bubbleHeight } = await drawStickerChat(ctx, stickerImg, time, bubbleY, reply));
	} else {
		({ bubbleWidth, bubbleHeight } = drawBubbleChat(ctx, text, time, emojis, emojiCache, bubbleY, reply, rbWidth));
	}

	const menuItems = [
		{ text: 'Balas', icon: icons.reply, color: '#ffffff' },
		{ text: 'Teruskan', icon: icons.forward, color: '#ffffff' },
		{ text: 'Salin', icon: icons.copy, color: '#ffffff' },
		{ text: 'Beri Bintang', icon: icons.star, color: '#ffffff' },
		{ text: 'Info', icon: icons.info, color: '#ffffff' },
		{ text: 'Laporkan', icon: icons.report, color: '#ffffff' },
		{ text: 'Hapus', icon: icons.trash, color: '#ff3b30' },
	];

	const ICON_SZ = 42;

	ctx.fillStyle = '#2a2a2a';
	drawRoundedRect(ctx, menuX, menuY, menuWidth, MENU_H, menuRadius);
	ctx.fill();

	menuItems.forEach((item, i) => {
		const itemY = menuY + i * ITEM_H;
		const midY = itemY + ITEM_H / 2;

		ctx.fillStyle = item.color;
		ctx.font = '28px SFPRODISPLAYREGULAR';
		ctx.fillText(item.text, menuX + 30, midY + 10);

		const ix = menuX + menuWidth - 40 - ICON_SZ / 2;
		const iy = midY - ICON_SZ / 2;

		if (item.icon) {
			const tmp = createCanvas(ICON_SZ, ICON_SZ);
			const tmpCtx = tmp.getContext('2d');
			tmpCtx.drawImage(item.icon, 0, 0, ICON_SZ, ICON_SZ);
			tmpCtx.globalCompositeOperation = 'source-in';
			tmpCtx.fillStyle = item.color;
			tmpCtx.fillRect(0, 0, ICON_SZ, ICON_SZ);
			ctx.drawImage(tmp, ix, iy);
		}

		if (i < menuItems.length - 1) {
			ctx.strokeStyle = '#3a3a3a';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(menuX + 25, itemY + ITEM_H);
			ctx.lineTo(menuX + menuWidth - 25, itemY + ITEM_H);
			ctx.stroke();
		}
	});

	return {
		success: true,
		image: canvas.toBuffer('image/png'),
		mimeType: 'image/png',
		timestamp: Date.now(),
		message: 'Created by Hann Universe npm:iqc-canvas',
	};
}

module.exports = {
	generateIQC
};
