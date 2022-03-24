# Ns Chat

<img src='https://raw.githubusercontent.com/nullstack/nullstack/master/nullstack.png' height='60' alt='Nullstack' />

[Preview](https://nschat.ml/)

## About

This is a fullstack chat application. It's still under development and I've been doing this to learn [Nullstack](https://nullstack.app).

#### External dependencies:
  - uuid
  - axios
  - socket.io
  - socket.io-client

#### Hosting
  - This project is currently hosted on [Replit](https://replit.com)
  - Registered name on freenom
  - Configured on cloudflare


#### Cool stuff

Uploads and voice recordings work and are uploaded on transfer.sh, with [this little thing](https://github.com/mococa/transfer-upload)

### Why

Why not?

Managed to work for the first time with sassy SaaS

Also, due to react fatigue.

## How to run this Project

Install the dependencies:

`npm install` or `yarn`

Then run the app in development mode:

`npm start` or `yarn start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


To build, due to PurgeCSS plugin, go to `/node_modules/nullstack/webpack.config.js` and comment these lines:

```js
if (argv.environment === 'production') {
  plugins.push(new PurgecssPlugin({
    paths: glob.sync(`src/**/*`, { nodir: true }),
    content: ['./**/*.njs'],
    safelist: ['script', 'body', 'html', 'style'],
    defaultExtractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
  }));
}
```

(Line ~225)


## Thoughts on Nullstack:
  - Nullstack has got a very nice and helpful community on discord, just not active enough as it's still undergroundish.
  - Documentation is pretty ok
  - IT'S FAST. My computer (4th gen i5, 16gb) builds this project is less than 10s
  - It has an interesting different approach to serverside stuff
  - Typescript is not implemented by default yet, and you cannot create a project with a typescript template yet
  - It is missing some custom webpack configurations. You need to use the default one.
  - Atomic design will not work very well here out of the box
  - It does not come with lint, prettier, neither jest by default
  - It **might** be production ready.


## Learn more about Nullstack

[Read the documentation](https://nullstack.app/documentation)
