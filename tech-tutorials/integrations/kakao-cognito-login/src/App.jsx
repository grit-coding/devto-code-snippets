import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  signInWithRedirect,
} from 'aws-amplify/auth';
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  Tabs,
  Field,
  Separator,
} from '@chakra-ui/react';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      await fetchAuthSession();
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleKakaoLogin() {
    setError('');
    try {
      await signInWithRedirect({
        provider: {
          custom: 'kakao', //소셜 로그인 프로바이더 이름과 동일
        },
      });
    } catch (err) {
      setError(err?.message || 'Kakao login failed');
    }
  }

  async function handleSignIn() {
    setError('');
    try {
      await signIn({
        username: signInEmail,
        password: signInPassword,
      });
      await checkUser();
    } catch (err) {
      setError(err?.message || 'Sign in failed');
    }
  }

  async function handleSignUp() {
    setError('');
    try {
      await signUp({
        username: signUpEmail,
        password: signUpPassword,
        options: {
          userAttributes: {
            email: signUpEmail,
          },
        },
      });
      setError('Sign up successful. Check your email for confirmation if required.');
    } catch (err) {
      setError(err?.message || 'Sign up failed');
    }
  }

  async function handleSignOut() {
    await signOut();
    setUser(null);
  }

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (user) {
    return (
      <Box bg="gray.50" minH="100vh" py="20">
        <Container maxW="md">
          <Box bg="white" p="8" rounded="2xl" shadow="lg">
            <Heading size="lg" mb="2">
              Welcome
            </Heading>
            <Text color="gray.600" mb="6">
              Signed in as {user.username}
            </Text>
            <Button colorScheme="blackAlpha" onClick={handleSignOut} w="full">
              Sign out
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py="20">
      <Container maxW="md">
        <Box bg="white" p="8" rounded="2xl" shadow="lg">
          <Stack gap="6">
            <Box textAlign="center">
              <Heading size="2xl" mb="2">
                Cognito Demo
              </Heading>
              <Text color="gray.600">Sign in with Kakao or email</Text>
            </Box>

            <Button
              onClick={handleKakaoLogin}
              bg="#FEE500"
              color="#191919"
              _hover={{ bg: '#f6dc00' }}
              size="lg"
              rounded="xl"
            >
              Continue with Kakao
            </Button>

            <Separator />

            <Tabs.Root defaultValue="signin" fitted variant="outline">
              <Tabs.List mb="6">
                <Tabs.Trigger value="signin">Sign In</Tabs.Trigger>
                <Tabs.Trigger value="signup">Create Account</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="signin">
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Input
                      type="password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </Field.Root>

                  <Button colorScheme="blue" size="lg" onClick={handleSignIn}>
                    Sign in
                  </Button>
                </Stack>
              </Tabs.Content>

              <Tabs.Content value="signup">
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Input
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create a password"
                    />
                  </Field.Root>

                  <Button colorScheme="blue" size="lg" onClick={handleSignUp}>
                    Create account
                  </Button>
                </Stack>
              </Tabs.Content>
            </Tabs.Root>

            {error ? (
              <Text fontSize="sm" color="red.500">
                {error}
              </Text>
            ) : null}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
