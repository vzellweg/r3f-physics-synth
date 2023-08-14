# r3f-physics-synth
React Three Fiber implementation of an audio-visual, interactive physics playground project

This project is intended to familiarize myself with development in React Three Fiber. React Three Fiber (R3F) is a high level interface to the Three.js library (which is itself a high-level interface to the WebGL language) made for react projects.

I have experience using three.js in Vue projects, and experience with React, but have never tried building any 3d projects using React Three Fiber (R3F).

## Purpose

### R3F abstractions and defaults
R3F creates abstractions for most three.js components, setting reasonable defaults on many settings and objects that often create significant overhead when building a vanilla three.js project. 
Compared to vanilla three.js projects, the source code for R3F projects is much more elegant.
### Increased speed of development
Due to the abstractions and defaults that R3F provides, 3D projects should be much faster to sketch up compared to using vanilla three.js.
### Expanded features

[drei](https://github.com/pmndrs/drei) is a commonly used, well-maintained, library of R3F helpers. This expands on the features already provided by three.js, enabling more capabilities with less code.

## Goals
### Primary
- recreate a project I've already made with vanilla three.js, so the two sets of code can be compared 
- from that point, add some more "eye candy" to the project like reflections, shadows, lighting, background, psychedelic colors. 
- Add some interactivity or audio-reactive components that did not exist in the previous project
- use one or more utilities provided in drei
### Stretch
- integrate R3F scene into the web team's Vue boilerplate
	- Use performance metrics to see if any performance issues arise
	- explore options for passing data between vue and react
		- this does not have to be reactive data (ie. vue passes data to react on component mount, and react passes data to vue on component unmount)
## Journal

### Day 1

