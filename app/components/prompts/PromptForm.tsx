import { useState, useEffect } from 'react';
import {
    TextInput,
    Textarea,
    Select,
    Button,
    Paper,
    Stack,
    Combobox,
    PillsInput,
    Pill,
    Group,
    CheckIcon,
    useCombobox
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Prompt } from '@/app/lib/prompts';

interface PromptFormProps {
    initialData?: Prompt;
    onSubmit: (data: Omit<Prompt, '_id' | 'userId'>) => Promise<void>;
    isLoading?: boolean;
}

const CATEGORIES = [
    { value: 'design', label: 'Design' },
    { value: 'coding', label: 'Coding' },
    { value: 'writing', label: 'Writing' },
    { value: 'other', label: 'Other' }
];

// New TagCombobox component
function TagCombobox({
    tags,
    setTags,
    disabled
}: {
    tags: string[];
    setTags: (newTags: string[]) => void;
    disabled: boolean;
}) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active')
    });
    const [search, setSearch] = useState('');
    // suggestions are initially set as the existing tags. You may replace this with a preset list.
    const [suggestions, setSuggestions] = useState<string[]>(tags);

    const exactOptionMatch = suggestions.some(
        (item) => item.toLowerCase() === search.toLowerCase()
    );

    const handleValueSelect = (val: string) => {
        setSearch('');
        if (val === '$create') {
            setSuggestions((current) => [...current, search]);
            setTags([...tags, search]);
        } else {
            if (tags.includes(val)) {
                setTags(tags.filter((v) => v !== val));
            } else {
                setTags([...tags, val]);
            }
        }
    };

    const handleValueRemove = (val: string) =>
        setTags(tags.filter((v) => v !== val));

    const values = tags.map((item) => (
        <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item}
        </Pill>
    ));

    const optionsList = suggestions
        .filter((item) =>
            item.toLowerCase().includes(search.trim().toLowerCase())
        )
        .map((item) => (
            <Combobox.Option value={item} key={item} active={tags.includes(item)}>
                <Group gap="sm">
                    {tags.includes(item) ? <CheckIcon size={12} /> : null}
                    <span>{item}</span>
                </Group>
            </Combobox.Option>
        ));

    return (
        <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
            <Combobox.DropdownTarget>
                <PillsInput disabled={disabled} onClick={() => combobox.openDropdown()}>
                    <Pill.Group>
                        {values}
                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                value={search}
                                placeholder="Add relevant tags"
                                disabled={disabled}
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
                                    setSearch(event.currentTarget.value);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && search.length === 0 && tags.length > 0) {
                                        event.preventDefault();
                                        handleValueRemove(tags[tags.length - 1]);
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>
            <Combobox.Dropdown>
                <Combobox.Options>
                    {optionsList}
                    {!exactOptionMatch && search.trim().length > 0 && (
                        <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
                    )}
                    {exactOptionMatch && search.trim().length > 0 && optionsList.length === 0 && (
                        <Combobox.Empty>Nothing found</Combobox.Empty>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

export default function PromptForm({ initialData, onSubmit, isLoading = false }: PromptFormProps) {
    const [formData, setFormData] = useState<Omit<Prompt, '_id' | 'userId'>>({
        title: '',
        description: '',
        tags: [],
        category: ''
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            const { userId, _id, ...rest } = initialData;
            setFormData(rest);
        }
    }, [initialData]);

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.category) errors.category = 'Category is required';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await onSubmit(formData);
        } catch (error: any) {
            if (error.errors?.length) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err: any) => {
                    newErrors[err.param] = err.msg;
                });
                setValidationErrors(newErrors);
            } else {
                notifications.show({
                    title: 'Error',
                    message: error.message || 'An error occurred',
                    color: 'red'
                });
            }
        }
    };

    return (
        <Paper
            shadow="xs"
            p="xl"
            radius="md"
            withBorder
            styles={{
                root: {
                    backgroundColor: 'var(--mantine-color-white)'
                }
            }}
        >
            <form onSubmit={handleSubmit}>
                <Stack gap={16}>
                    <TextInput
                        required
                        label="Title"
                        placeholder="Enter a descriptive title"
                        value={formData.title}
                        onChange={(e) => {
                            setFormData((prev) => ({ ...prev, title: e.target.value }));
                            if (validationErrors.title) {
                                setValidationErrors((prev) => ({ ...prev, title: '' }));
                            }
                        }}
                        error={validationErrors.title}
                        disabled={isLoading}
                        styles={{
                            input: {
                                '&:focus': {
                                    borderColor: 'var(--mantine-color-blue-5)'
                                }
                            }
                        }}
                    />

                    <Textarea
                        label="Description"
                        placeholder="Describe your prompt"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        minRows={4}
                        disabled={isLoading}
                        styles={{
                            input: {
                                '&:focus': {
                                    borderColor: 'var(--mantine-color-blue-5)'
                                }
                            }
                        }}
                    />

                    {/* Replaced MultiSelect with TagCombobox */}
                    <TagCombobox
                        tags={formData.tags}
                        setTags={(newTags) => setFormData((prev) => ({ ...prev, tags: newTags }))}
                        disabled={isLoading}
                    />

                    <Select
                        required
                        label="Category"
                        placeholder="Select a category"
                        value={formData.category}
                        onChange={(value) => {
                            setFormData((prev) => ({ ...prev, category: value || '' }));
                            if (validationErrors.category) {
                                setValidationErrors((prev) => ({ ...prev, category: '' }));
                            }
                        }}
                        data={CATEGORIES}
                        error={validationErrors.category}
                        disabled={isLoading}
                        styles={{
                            input: {
                                '&:focus': {
                                    borderColor: 'var(--mantine-color-blue-5)'
                                }
                            }
                        }}
                    />

                    <Button
                        type="submit"
                        loading={isLoading}
                        fullWidth
                        variant="filled"
                        color="blue.6"
                        mt="md"
                    >
                        {initialData ? 'Update Prompt' : 'Create Prompt'}
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
}