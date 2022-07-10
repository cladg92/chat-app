# chat-app

Chat app for mobile devices built using React Native. The app provides users with a chat interface and options to share images and their location.

## Features

- A page where users can enter their name and choose a background color for the chat screen
  before joining the chat.
- A page displaying the conversation, as well as an input field and submit button.
- The chat provides users with two additional communication features: sending images
  and location data.
- Data gets stored online (Firestore) and offline (Local storage).

## Set up

### App

- Install expo by running `npm install expo-cli --global` in the terminal.
- Next, you’ll need the Expo app for your phone to run your project on. Search for the Expo app in the relevant app store for your device (iOS or Android). Once you’ve found the Expo app, download it onto your device.
- Head over to the [Expo signup page](https://expo.dev/) and follow the instructions to create an account. Once that’s done, you should be able to log in to Expo from your browser and mobile app.
- Clone the repository running `git clone https://github.com/cladg92/chat-app.git` in the terminal.
- Install dependencies with `npm i`.
- Navigate to the root folder and run `npm start` or `expo start`.
- Expo will build the project and display development options in a browser window as well as the terminal console. Scan the QR Code provided in your browser (or your terminal) using the Expo Client app for Android or the built-in QR code scanner of your iPhone camera. If for some reason you couldn’t scan it on the iPhone, you can click on the Send link with email option from the left menu.

### Database configuration

Follow these steps if you want to create a database of your own:

- Head over to [Google Firebase](https://firebase.google.com/) and use your existing Google credentials to sign in and create a new Firebase account.
- Next head to the Firebase console and create a new project (**Create Project**).
- Once on the Google Firebase dashboard of your project, click **Develop** from the menu on the left-hand side and, from the additional menu that appears, select **Cloud Firestore**, then select **Create Database**.
- Follow the instructions to create a new database.
- Create a new collection called "messages".
- Under **Project settings**, you’ll find a section called **Your apps**, which is where you can generate configurations for different platforms. Click the **Firestore for Web** button (it may be shown as the </> icon). This will open a new screen asking you to register your web application, which will connect to the Cloud Firestore database you just created.
- Fill in a name for your chat application, then click **Register** to generate the configuration code. Copy the contents of the `firebaseConfig` object and paste them in the firebase.js file.
