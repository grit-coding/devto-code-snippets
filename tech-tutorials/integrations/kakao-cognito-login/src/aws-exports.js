const awsExports = {
  Auth: {
    Cognito: {
      userPoolId: 'eu-west-1_xxxxxxxx',
      userPoolClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
      loginWith: {
        email: true,
        // or username: true depending on your pool setup
        oauth: {
          domain: 'your-domain.auth.eu-west-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:5173/'],
          redirectSignOut: ['http://localhost:5173/'],
          responseType: 'code',
        },
      },
    },
  },
};

export default awsExports;
