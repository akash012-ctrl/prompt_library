import { Prompt, getCurrentUserId } from '@/app/lib/prompts';
import { getAuthToken } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Card, Text, Badge, Group, Button, Stack, Box } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface PromptCardProps {
    prompt: Prompt;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function PromptCard({ prompt, onEdit, onDelete }: PromptCardProps) {
    const isAuthenticated = !!getAuthToken();
    const router = useRouter();

    const isOwner = useMemo(() => {
        const currentUserId = getCurrentUserId();
        return currentUserId ? currentUserId === prompt.userId._id : false;
    }, [prompt.userId]);

    return (
        <Card
            shadow="xs"
            padding="lg"
            radius="md"
            withBorder
            onClick={() => router.push(`/prompts/${prompt._id}`)}
            style={{ cursor: 'pointer' }}
            styles={{
                root: {
                    backgroundColor: 'var(--mantine-color-white)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 'var(--mantine-shadow-sm)',
                    },
                },
            }}
        >
            <Stack gap="md">
                <Box>
                    <Text fz="lg" fw={500} mb="xs" lineClamp={2}>
                        {prompt.title}
                    </Text>
                    <Badge
                        variant="dot"
                        color="blue.4"
                        size="sm"
                        styles={{ root: { textTransform: 'capitalize' } }}
                    >
                        {prompt.category}
                    </Badge>
                </Box>

                <Text size="sm" c="gray.6" lineClamp={3}>
                    {prompt.description}
                </Text>

                <Group gap="xs" wrap="nowrap">
                    {prompt.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                            key={index}
                            variant="light"
                            color="gray.5"
                            size="sm"
                            styles={{
                                root: {
                                    textTransform: 'lowercase',
                                    letterSpacing: '0.02em',
                                }
                            }}
                        >
                            {tag}
                        </Badge>
                    ))}
                    {prompt.tags.length > 3 && (
                        <Text size="sm" c="dimmed">+{prompt.tags.length - 3}</Text>
                    )}
                </Group>

                {isAuthenticated && isOwner && (
                    <Group gap="xs" onClick={(e) => e.stopPropagation()} mt="auto">
                        {onEdit && (
                            <Button
                                variant="subtle"
                                size="xs"
                                color="blue.6"
                                onClick={onEdit}
                                leftSection={<IconEdit size={14} />}
                                styles={{
                                    root: {
                                        padding: '4px 8px',
                                    }
                                }}
                            >
                                Edit
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="subtle"
                                size="xs"
                                color="red.6"
                                onClick={onDelete}
                                leftSection={<IconTrash size={14} />}
                                styles={{
                                    root: {
                                        padding: '4px 8px',
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        )}
                    </Group>
                )}
            </Stack>
        </Card>
    );
}