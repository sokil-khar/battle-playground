## Common information

The UI code here.

The battle prototype engine code is in `/battle` directory. It's needed to be refactored and maybe rewrited, bcz it existed only for
balanced purposes and have very complex business logic so very complex to many changes, especially for new devs.

## Deployment

AWS Secret ID for deployment -> `XXXXXXXXXXXXXXXXXXXXXXXX`
AWS Secret Key for deployment -> `XXXXXXXXXXXXXXXXXXXXXXXX`

1. `npm run build`
2. `aws s3 cp --recursive ./build s3://battlefly-battle-playground/`
3. Open `http://battlefly-battle-playground.s3-website-us-west-2.amazonaws.com`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
