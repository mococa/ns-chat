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
  - prisma
  - @prisma/client
  - bcryptjs

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

#### Install the dependencies:

`npm install` or `yarn`
#### Fix webpack issues

Add
```js
externals: ['_http_common', 'encoding'],
```

on Nullstack webpack config. You can put it in the return of the `server` function, as we're using prisma.

#### Migrate your database

run `yarn db:migrate`, and choose migration name, like "init".

#### Run the app in development mode

Cool! Now you'll be able to run the app in development mode:

For this, run `npm start` or `yarn start`

Finanly, open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to build this project

#### Fix webpack issues

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

(Around line ~225)

#### Files

After running `yarn build`,

To run it in production you will need the following folders and files:
  - `/node_modules`
  - `/.production`
  - `/prisma`
  - `/db-scripts`
  - `/public`
  - `package.json`
  - `yarn.lock` or `package-lock.json`

Then, run `yarn prod`. It will be listening to port 3000.

---

## Thoughts on Nullstack:
  - Nullstack has got a very nice and helpful community on discord, just not active enough as it's still undergroundish.
  - Documentation is pretty ok
  - IT'S FAST. My computer (4th gen i5, 16gb) builds this project is less than 10s
  - It has an interesting different approach for serverside stuff
  - Typescript is not implemented by default yet, and you cannot create a project with a typescript template yet
  - It is missing some custom webpack configurations. You need to use the default one.
  - Atomic design will not work very well here out of the box
  - It does not come with lint, prettier, neither jest by default
  - It **might** be production ready.

---

## How it looks:

![image](https://user-images.githubusercontent.com/13316723/159837006-e282bb13-2bad-42cf-a808-c304dafdabf9.png)
![image](https://user-images.githubusercontent.com/13316723/159837035-c8dbc7e6-4cc4-41ef-9b5d-2d0d090257ea.png)
![image](https://user-images.githubusercontent.com/13316723/159837085-1a8849fb-2830-40d0-8198-1b556d36ce00.png)

---

## To do list:
  - [x] Design pages
  - [x] Read Nullstack documentation
  - [x] Host project with random/mocked data
  - [x] Implement an actual database to store messages
  - [ ] Implement theming
  - [ ] Increase security (Not use sessionStorage)
  - [ ] Implement profile pages
  - [x] Implement DMs


## Learn more about Nullstack

[Read the documentation](https://nullstack.app/documentation)
