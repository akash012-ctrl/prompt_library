'use client';

import { createPrompt, Prompt } from '@/app/lib/prompts';
import PromptForm from '@/app/components/prompts/PromptForm';
import { useRouter } from 'next/navigation';
import { Container, Title, Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { useState } from 'react';

type PromptData = Omit<Prompt, '_id'>;

interface ApiError {
    errors?: Array<{
        msg: string;
        param: string;
    }>;
    message?: string;
}

export default function NewPrompt() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: PromptData) => {
        try {
            setIsLoading(true);
            const response = await createPrompt(data);
            notifications.show({
                title: 'Success',
                message: 'Prompt created successfully',
                color: 'green'
            });
            router.push(`/prompts/${response._id}`);
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const errorMessage = apiError.errors?.[0]?.msg || 'Failed to create prompt';
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

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
                <Title order={2}>Create New Prompt</Title>
                <div style={{ width: 100 }} /> {/* Spacer for layout balance */}
            </Group>

            <PromptForm onSubmit={handleSubmit} isLoading={isLoading} />
        </Container>
    );
}