# Space

Space is some kind of generative ambient music machine inspired by a bunch of tiling images I created using [ImaginAIry](https://github.com/brycedrennan/imaginAIry/). It’s available online at [spitlo.com/space/](https://spitlo.com/space/).

The spinning logo thing is done with [Zdog](https://github.com/metafizzy/zdog) and [Zfont](https://github.com/jaames/zfont). The "music" is generated with [Tone.js](https://github.com/Tonejs/Tone.js). Colors are extracted from the current background image using [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant).

## To do

- [x] Use [Vibrant](https://jariz.github.io/vibrant.js/) or similar to extract colors from background images?
- [ ] Move Vibrant logic to a bin script and generate a .js mapping between images and colors?
- [x] Only run animation once every X seconds
- [ ] ~~Create more animations and a way to switch between them~~
- [x] Remove images that don’t look good enough
- [ ] Use better sounds
- [ ] Add a few more kits and load a random one on each reload
- [ ] Make the last channel an instrument that plays a note from a randomized scale picked on reload?
- [ ] Set an initial background while loading image
