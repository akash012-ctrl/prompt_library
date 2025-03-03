import { useState } from 'react';
import { login, register } from '@/app/lib/auth';
import { TextInput, PasswordInput, Button, Paper, Title, Stack, Text, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';

interface AuthFormProps {
    onSuccess: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
                notifications.show({
                    title: 'Success',
                    message: 'Logged in successfully',
                    color: 'green'
                });
            } else {
                await register(email, password);
                notifications.show({
                    title: 'Success',
                    message: 'Registered successfully',
                    color: 'green'
                });
            }
            onSuccess();
        } catch (error: any) {
            const errorMessage = error.errors?.[0]?.msg || 'An error occurred';
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maw={400} mx="auto" mt={40}>
            <Paper p="xl" radius="md" withBorder>
                <Title order={2} ta="center" mb="xl" fw={500}>
                    {isLogin ? 'Welcome back' : 'Create account'}
                </Title>

                <form onSubmit={handleSubmit}>
                    <Stack>
                        <TextInput
                            required
                            label="Email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            styles={{
                                input: {
                                    '&:focus-within': {
                                        borderColor: 'var(--mantine-color-blue-5)',
                                    },
                                },
                            }}
                        />

                        <PasswordInput
                            required
                            label="Password"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            styles={{
                                input: {
                                    '&:focus-within': {
                                        borderColor: 'var(--mantine-color-blue-5)',
                                    },
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            loading={loading}
                            fullWidth
                            mt="md"
                            variant="filled"
                        >
                            {isLogin ? 'Sign in' : 'Create account'}
                        </Button>

                        <Text ta="center" size="sm" mt="sm"></Text>
                        <Text
                            component="button"
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            c="blue.6"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            {isLogin ? 'Dont have an account? Sign up' : 'Already have an account? Sign in'}
                        </Text>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}