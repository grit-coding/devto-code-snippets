import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  signInWithRedirect,
  confirmSignUp,
  resendSignUpCode,
  fetchUserAttributes,
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
  const [attributes, setAttributes] = useState(null);
  const [loading, setLoading] = useState(true);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');

  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadAttributes() {
      try {
        const attrs = await fetchUserAttributes();
        if (!cancelled) {
          setAttributes(attrs);
        }
      } catch {
        if (!cancelled) {
          setAttributes(null);
        }
      }
    }

    loadAttributes();

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function checkUser() {
    try {
      await fetchAuthSession();
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setAttributes(null);
    } catch {
      setUser(null);
      setAttributes(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleKakaoLogin() {
    setError('');
    setMessage('');

    try {
      await signInWithRedirect({
        provider: {
          custom: 'Kakao', // OIDC 공급자 이름과 동일해야 합니다
        },
      });
    } catch (err) {
      setError(err?.message || 'Kakao login failed');
    }
  }

  async function handleSignIn() {
    setError('');
    setMessage('');

    try {
      const result = await signIn({
        username: signInEmail,
        password: signInPassword,
      });

      if (result?.isSignedIn) {
        await checkUser();
        return;
      }

      if (result?.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        setConfirmEmail(signInEmail);
        setNeedsConfirmation(true);
        setMessage('Please enter the verification code sent to your email.');
      }
    } catch (err) {
      setError(err?.message || 'Sign in failed');
    }
  }

  async function handleSignUp() {
    setError('');
    setMessage('');

    try {
      const result = await signUp({
        username: signUpEmail,
        password: signUpPassword,
        options: {
          userAttributes: {
            email: signUpEmail,
            name: signUpName,
          },
        },
      });

      if (result?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        setConfirmEmail(signUpEmail);
        setNeedsConfirmation(true);
        setMessage('Verification code sent. Please check your email.');
      } else {
        setMessage('Sign up completed. You can sign in now.');
      }
    } catch (err) {
      setError(err?.message || 'Sign up failed');
    }
  }

  async function handleConfirmSignUp() {
    setError('');
    setMessage('');

    try {
      await confirmSignUp({
        username: confirmEmail,
        confirmationCode,
      });

      setNeedsConfirmation(false);
      setSignInEmail(confirmEmail);
      setConfirmationCode('');
      setMessage('Email verified successfully. Please sign in.');
    } catch (err) {
      setError(err?.message || 'Verification failed');
    }
  }

  async function handleResendCode() {
    setError('');
    setMessage('');

    try {
      await resendSignUpCode({
        username: confirmEmail,
      });

      setMessage('A new verification code was sent.');
    } catch (err) {
      setError(err?.message || 'Failed to resend code');
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
    } finally {
      setUser(null);
      setAttributes(null);
    }
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
              로그인 성공!
            </Heading>
            <Text color="gray.600" mb="6">
              {attributes?.name || attributes?.profile_nickname || user?.username}로 로그인
              되었습니다.
            </Text>
            <Button colorScheme="blackAlpha" onClick={handleSignOut} w="full">
              로그아웃
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
                Cognito 데모
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
              카카오로 계속하기
            </Button>

            <Separator />

            {needsConfirmation ? (
              <Stack gap="4">
                <Heading size="md">인증 코드 확인</Heading>

                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Input
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Verification Code</Field.Label>
                  <Input
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    placeholder="Enter verification code"
                  />
                </Field.Root>

                <Button colorScheme="blue" size="lg" onClick={handleConfirmSignUp}>
                  인증 완료
                </Button>

                <Button variant="outline" onClick={handleResendCode}>
                  코드 재전송
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setNeedsConfirmation(false);
                    setConfirmationCode('');
                    setMessage('');
                    setError('');
                  }}
                >
                  뒤로가기
                </Button>
              </Stack>
            ) : (
              <Tabs.Root defaultValue="signin" fitted variant="outline">
                <Tabs.List mb="6">
                  <Tabs.Trigger value="signin">로그인</Tabs.Trigger>
                  <Tabs.Trigger value="signup">계정생성</Tabs.Trigger>
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
                      <Field.Label>비밀번호</Field.Label>
                      <Input
                        type="password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </Field.Root>

                    <Button colorScheme="blue" size="lg" onClick={handleSignIn}>
                      로그인
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
                      <Field.Label>이름</Field.Label>
                      <Input
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>비밀번호</Field.Label>
                      <Input
                        type="password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Create a password"
                      />
                    </Field.Root>

                    <Button colorScheme="blue" size="lg" onClick={handleSignUp}>
                      계정생성
                    </Button>
                  </Stack>
                </Tabs.Content>
              </Tabs.Root>
            )}

            {message ? (
              <Text fontSize="sm" color="green.600">
                {message}
              </Text>
            ) : null}

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
