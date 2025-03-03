'use client';

import { useEffect, useState } from 'react';
import { getPrompt, Prompt, getCurrentUserId } from '@/app/lib/prompts';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/app/lib/auth';
import { Container, Paper, Title, Badge, Text, Group, Button, Loader, Stack, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconEdit } from '@tabler/icons-react';

export default function PromptDetail({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const isAuthenticated = !!getAuthToken();
    const currentUserId = getCurrentUserId();
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        params.then((resolvedParams) => {
            setId(resolvedParams.id);
        });
    }, [params]);

    useEffect(() => {
        const loadPrompt = async () => {
            if (!id) return;
            try {
                const data = await getPrompt(id);
                setPrompt(data);
            } catch {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to load prompt',
                    color: 'red'
                });
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadPrompt();
        }
    }, [id, router]);

    if (isLoading) {
        return (
            <Container size="xl" py="xl">
                <Box ta="center" py="xl">
                    <Loader size="md" />
                </Box>
            </Container>
        );
    }

    if (!prompt) {
        return null;
    }

    const isOwner = currentUserId === prompt.userId;

    return (
        <Container size="xl" py="xl">
            <Paper shadow="sm" p="xl" radius="md" withBorder>
                <Stack gap="xl">
                    <Group justify="space-between">
                        <Button
                            leftSection={<IconArrowLeft size={16} />}
                            variant="subtle"
                            color="gray"
                            onClick={() => router.back()}
                            styles={{
                                root: {
                                    '&:hover': {
                                        backgroundColor: 'var(--mantine-color-gray-1)',
                                    },
                                },
                            }}
                        >
                            Back
                        </Button>
                        {isAuthenticated && isOwner && (
                            <Button
                                variant="light"
                                onClick={() => router.push(`/prompts/edit/${prompt._id}`)}
                                leftSection={<IconEdit size={16} />}
                                styles={{
                                    root: {
                                        backgroundColor: 'var(--mantine-color-blue-0)',
                                        color: 'var(--mantine-color-blue-6)',
                                        '&:hover': {
                                            backgroundColor: 'var(--mantine-color-blue-1)',
                                        },
                                    },
                                }}
                            >
                                Edit Prompt
                            </Button>
                        )}
                    </Group>

                    <Box>
                        <Title
                            order={1}
                            mb="md"
                            style={{
                                fontWeight: 500,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            {prompt.title}
                        </Title>
                        <Badge
                            size="lg"
                            radius="sm"
                            variant="dot"
                            color="blue.6"
                            styles={{
                                root: {
                                    textTransform: 'capitalize',
                                },
                            }}
                        >
                            {prompt.category}
                        </Badge>
                    </Box>

                    <Text
                        size="lg"
                        c="gray.7"
                        style={{
                            lineHeight: 1.6,
                        }}
                    >
                        {prompt.description}
                    </Text>

                    <Group gap="xs">
                    {prompt.tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="light"
                            color="gray.6"
                            size="md"
                            styles={{
                                root: {
                                    textTransform: 'lowercase',
                                    letterSpacing: '0.02em',
                                },
                            }}
                        >
                            {tag}
                        </Badge>
                    ))}
                </Group>
            </Stack>
        </Paper>
        </Container >
    );
}