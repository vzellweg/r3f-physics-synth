# r3f-physics-synth

React Three Fiber implementation of an audio-visual, interactive physics playground project

[Read the proposal document to understand the project's goals](PROPOSAL.md)

## Journal

### Day 1

I scaffolded the project out and added controls for instantiating geometries onto the plane. I also implemented physics with react-three/cannon. For scaffolding, I decided to use vite to create a react typescript project.

I really started to get a grasp on the functional react components and how much they can do to clean up and modularize your code. I also am getting more comfortable using typescipt since I don't get too many chances to work with it.

### Day 2

Today I implemented the audio cues for collisions in the 3d scene. Setting up events took the longest, because I initially started setting them up with redux, before deciding to use the React Context. I also did some visual polish to the scene by adding a background gradient and a reallly cool Material in the drei library called MeshTransmissionMaterial.

I learned about usign the React Context hook today, it seems super useful for smaller projects that have components that need to communicate state and don't lie in a parent-child relationship.

### Day 3

Some cool examples I found that I can take inspiration from:

- [react-three/cannon physics examples](https://cannon.pmnd.rs/#/demo/MondayMorning)
- [cool lamina stuff](https://codesandbox.io/embed/github/pmndrs/lamina/tree/main/examples/complex-materials)

I did not work on this project much today, but I got a cool dynamic environment map going that gives the glass-like materials some cool colors to refract.

### Day 4

Today I learned even more benefits to using R3F over vanilla three.js. The drei geometry components allow you to set `onClick` listeners on your meshes, just like you would on any other html element. This is a huge benefit over vanilla three.js where you have to setup a raycaster and parse the intersections, before determining which object to act on. The code for this project is turning out much more concise and organized than a vanilla three.js project.

# Boilerplate README content

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
