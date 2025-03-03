import { useState, useEffect, useCallback } from 'react';
import { Prompt, getPrompts, searchPrompts, deletePrompt } from '@/app/lib/prompts';
import PromptCard from './PromptCard';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import { TextInput, Container, Grid, LoadingOverlay, Text, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons-react';

export default function PromptList() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadPrompts = async () => {
        try {
            const data = await getPrompts();
            setPrompts(data);
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to load prompts',
                color: 'red'
            });
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            if (!query.trim()) {
                loadPrompts();
                return;
            }
            try {
                setLoading(true);
                const results = await searchPrompts(query);
                setPrompts(results);
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: 'Search failed',
                    color: 'red'
                });
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        loadPrompts();
    }, []);

    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this prompt?')) {
            try {
                await deletePrompt(id);
                notifications.show({
                    title: 'Success',
                    message: 'Prompt deleted successfully',
                    color: 'green'
                });
                loadPrompts();
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to delete prompt',
                    color: 'red'
                });
            }
        }
    };

    return (
        <Container size="xl">
            <Box pos="relative">
                <TextInput
                    placeholder="Search prompts..."
                    size="md"
                    mb="xl"
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <LoadingOverlay visible={loading} />

                <Grid>
                    {prompts.map((prompt) => (
                        <Grid.Col key={prompt._id} span={{ base: 12, sm: 6, lg: 4 }}>
                            <PromptCard
                                prompt={prompt}
                                onEdit={() => router.push(`/prompts/edit/${prompt._id}`)}
                                onDelete={() => handleDelete(prompt._id)}
                            />
                        </Grid.Col>
                    ))}
                </Grid>

                {!loading && prompts.length === 0 && (
                    <Text ta="center" c="dimmed" size="lg" mt="xl">
                        No prompts found
                    </Text>
                )}
            </Box>
        </Container>
    );
}