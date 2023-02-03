# Space

Space is some kind of generative ambient music machine inspired by a bunch of tiling images I created using [ImaginAIry](https://github.com/brycedrennan/imaginAIry/). It’s available online at [spitlo.com/space/](https://spitlo.com/space/).

The spinning logo thing is done with [Zdog](https://github.com/metafizzy/zdog) and [Zfont](https://github.com/jaames/zfont). Colors are extracted from the current background image using [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant). Random song and band names are based on [Synthgen 2000](https://github.com/tirdadc/synthwave).

The "music" is generated with [Tone.js](https://github.com/Tonejs/Tone.js) from samples created with [Dance Diffusion](https://huggingface.co/spaces/harmonai/dance-diffusion) using the `glitch-440k` model and then split on transients. Channel 10 has a special role (no, it’s not a drum track, sorry MIDI heads) -- everytime a note is struck on it, it either plays the sample for that track, or a short sine note. The sine note is picked randomly on each play, from an array of notes (usually a scale) picked randomly on each load. The octave is also set randomly for each note, ranging from 2 to 7. Finally, the duration is set randomly from an eighth note to a sixty-fourth note, with shorter notes being a bit more likely.

## To do

- [x] Use [Vibrant](https://jariz.github.io/vibrant.js/) or similar to extract colors from background images?
- [ ] Move Vibrant logic to a bin script and generate a .js mapping between images and colors?
- [x] Only run animation once every X seconds
- [ ] ~~Create more animations and a way to switch between them~~
- [x] Remove images that don’t look good enough
- [x] Use better sounds
- [x] Add a few more kits and load a random one on each reload
- [x] Make the last channel an instrument that plays a note from a randomized scale picked on reload?
- [x] Set an initial background while loading image
- [x] Leave octave out of scales and set at random on play?
- [x] Randomize effects on load
- [ ] Enable "saving" all settings in a URI fragment
