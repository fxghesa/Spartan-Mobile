# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

### Install Capacitor:
https://capacitorjs.com/solution/react

### Export studio.sh path:
export CAPACITOR_ANDROID_STUDIO_PATH="/home/ghesa/Documents/program/android-studio/bin/studio.sh"

### Build capacitor:
https://capacitorjs.com/docs/v2/basics/building-your-app

### Deploy android:
`npm run build` \
`npx cap add android` => required only for initialize \
`npx cap copy android` \
`npx cap open android` 

### Firebase Cloud Message (FCM) with capacitor:
https://github.com/capacitor-community/fcm \
copy public/google-services.json to android/app 

`server key qc:` AAAAfvFyFkM:APA91bHCvoVe9wXdtD7PM6on0qebHHkin2Cd28psimpNtS3jtthSBYOi4lBDC2lQNzeD_p2hMmvRhdI-STVbm-4TjfNQQ8a_BRjnBhJPdyRMQhIiCqtXwqJrwqz8rvEgrEw8F7I02Dqg \
`token qc:` eSp46GjjSxe3SLcDJdGba9:APA91bFR7BXTIdk10n6ISKXitbqi28eaTg8fuv4VBMKJWH2UNdlIBOiAq-VOnT1TnL4kA8P-av3wM7k7JbDBcLJodWd-GI8o25TNcWE2GHb61SE_vfr8Ik87rwQXf0enwr8qSMmdFFS9 

### Firebase Hosting
to initialize, run:
`npm install -g firebase-tools` \
`firebase login` or `firebase login --reauth` \
`firebase init` \
`npm run build` \
`firebase deploy` \
deployed app url: \
https://apps-2ee38.firebaseapp.com/ 
