'use client';

import { useEffect, useState } from 'react';
import { getPrompt, updatePrompt, Prompt, getCurrentUserId } from '@/app/lib/prompts';
import PromptForm from '@/app/components/prompts/PromptForm';
import { useRouter } from 'next/navigation';
import { Container, Title, Button, Group, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';

type PromptData = Omit<Prompt, '_id' | 'userId'>;

export default function EditPrompt({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const router = useRouter();
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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

                if (!currentUserId || currentUserId !== data.userId._id) {
                    notifications.show({
                        title: 'Error',
                        message: 'You are not authorized to edit this prompt',
                        color: 'red'
                    });
                    router.push(`/prompts/${id}`);
                    return;
                }
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

        if (!currentUserId) {
            router.push('/');
            return;
        }

        if (id) {
            loadPrompt();
        }
    }, [id, router, currentUserId]);

    const handleSubmit = async (data: PromptData) => {
        if (!id) return;
        try {
            setIsLoading(true);
            await updatePrompt(id, data);
            notifications.show({
                title: 'Success',
                message: 'Prompt updated successfully',
                color: 'green'
            });
            router.push(`/prompts/${id}`);
        } catch (error: unknown) {
            const errorMessage = error && typeof error === 'object' && 'message' in error
                ? error.message
                : 'Failed to update prompt';
            notifications.show({
                title: 'Error',
                message: errorMessage as string,
                color: 'red'
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !prompt) {
        return (
            <Container size="xl" py="xl">
                <div className="flex items-center justify-center">
                    <Loader size="lg" />
                </div>
            </Container>
        );
    }

    if (!prompt || !currentUserId || currentUserId !== prompt.userId._id) {
        return null;
    }

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Button
                    leftSection={<IconArrowLeft size={16} />}
                    variant="subtle"
                    onClick={() => router.back()}
                >
                    Back
                </Button>
                <Title order={2}>Edit Prompt</Title>
                <div style={{ width: 100 }} /> {/* Spacer for layout balance */}
            </Group>

            <PromptForm initialData={prompt} onSubmit={handleSubmit} isLoading={isLoading} />
        </Container>
    );
}