# Space

Space is some kind of generative ambient music machine inspired by a bunch of tiling images I created using [ImaginAIry](https://github.com/brycedrennan/imaginAIry/). It’s available online at [spitlo.com/space/](https://spitlo.com/space/).

Space also has a sibling of sorts, /'siːkwənt/, available online at [spitlo.com/sikwent/](https://spitlo.com/sikwent/).

## The look

Background images are picked at random on load, from a bank of about 80. The spinning logo thing is done with [Zdog](https://github.com/metafizzy/zdog) and [Zfont](https://github.com/jaames/zfont). Colors are extracted from the current background image using [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant). Random song and band names are based on [Synthgen 2000](https://github.com/tirdadc/synthwave).

## The sound

The "music" is generated with [Tone.js](https://github.com/Tonejs/Tone.js), mostly from samples created with [Dance Diffusion](https://huggingface.co/spaces/harmonai/dance-diffusion) using the `glitch-440k` model and then automatically split on transients.

The samples are organized in kits, of which there are nine at the moment. Kits one through six contain the Dance Diffusion samples, kits seven through nine contain more traditional drum sounds of the 707/808/909 variety, and some keys. Those kits are generally more pleasant to listen to, but since the kits are chosen at random on load, Space is only pleasant about every third visit.

Each sample in a kit is represented by a channel. On load, a pattern is semi-randomly set on each channel. As long as "Auto-evolve" is ticked, this pattern will change over time, creating a never*-repeating soundscape.
(* Never as in "very seldom")

If you want to create your own sequence, simply clear the playing sequence, disable auto-evolve and create your own sequence by clicking the corresponding dots.

Hitting "Save" will save the current state of your composition in the URL, copy it from the address bar to share or to keep it safe somewhere. Or bookmark it!

Channel 10 has a special role (no, it’s not a drum track, sorry MIDI heads) -- everytime a note is struck on it, it either plays the sample for that track, or a short sine note. The sine note is picked randomly on each play, from an array of notes (usually a scale) picked randomly on each load. The octave is also set randomly for each note, ranging from 2 to 7. Finally, the duration is set randomly from an eighth note to a sixty-fourth note, with shorter notes being a bit more likely.

## To do

- [ ] Add possibility to render a loop as ogg? Possible way [described here](https://www.youtube.com/watch?v=VHCv3waFkRo)
- [ ] Expose some settings (like BPM) through global functions? So that entering f. ex. `setBPM(55)` would change the BPM of the song?
- [ ] Move Vibrant logic to a bin script and generate a .js mapping between images and colors?
- [x] Add "Help" button
- [x] Add a few more kits and load a random one on each reload
- [-] Enable "saving" all settings in a URI fragment
  - [ ] ~~If user has cleared and then saves, promt for band and song name before setting save URL?~~
  - [x] Include auto-evolve value in save
- [x] Leave octave out of scales and set at random on play?
- [x] Make the last channel an instrument that plays a note from a randomized scale picked on reload?
- [x] Only run animation once every X seconds
- [x] Play the correct sound when user clicks a dot
- [x] Randomize effects on load
- [x] Remove images that don’t look good enough
- [x] Set an initial background while loading image
- [x] Use [Vibrant](https://jariz.github.io/vibrant.js/) or similar to extract colors from background images?
- [x] Use better sounds
- [ ] ~~Create more animations and a way to switch between them~~

