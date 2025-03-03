'use client';

import { useState, useEffect } from 'react';
import AuthForm from './components/auth/AuthForm';
import PromptList from './components/prompts/PromptList';
import { getAuthToken, logout } from './lib/auth';
import { useRouter } from 'next/navigation';
import { AppShell, Container, Button, Group, Title, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPencilPlus, IconLogout } from '@tabler/icons-react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(!!getAuthToken());
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    notifications.show({
      title: 'Success',
      message: 'Logged out successfully',
      color: 'green'
    });
  };

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
      styles={{
        main: {
          background: 'var(--mantine-color-gray-0)',
        },
      }}
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" px="md" justify="space-between">
            <Title
              order={3}
              c="blue.6"
              style={{
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              Prompt Library
            </Title>
            <Group>
              {isAuthenticated && (
                <>
                  <Button
                    variant="light"
                    onClick={() => router.push('/prompts/new')}

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
                    Create New Prompt
                    
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={handleLogout}
                    
                    color="gray"
                    styles={{
                      root: {
                        '&:hover': {
                          backgroundColor: 'var(--mantine-color-gray-1)',
                        },
                      },
                    }}
                  >
                    <IconLogout stroke={1.5} />
                    Logout
                  </Button>
                </>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        {!isAuthenticated ? (
          <Container size="sm">
            <AuthForm onSuccess={handleAuthSuccess} />
          </Container>
        ) : (
          <PromptList />
        )}
      </AppShell.Main>
    </AppShell>
  );
}
