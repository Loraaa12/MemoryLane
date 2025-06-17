import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SurpriseViewer from '../SurpriseViewer';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock timer functions
jest.useFakeTimers();

describe('SurpriseViewer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders initial state correctly', () => {
        render(<SurpriseViewer />);
        
        expect(screen.getByText(/click to reveal/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('fetches and displays a random surprise', async () => {
        const mockSurprise = {
            category: 'film',
            note: 'Test film',
            name: 'Test Movie',
            year: 2024
        };
        
        mockedAxios.get.mockResolvedValueOnce({ data: mockSurprise });
        
        render(<SurpriseViewer />);
        
        // Click to reveal
        fireEvent.click(screen.getByRole('button'));
        
        await waitFor(() => {
            expect(screen.getByText('Test film')).toBeInTheDocument();
            expect(screen.getByText('Test Movie')).toBeInTheDocument();
            expect(screen.getByText('2024')).toBeInTheDocument();
        });
    });

    it('shows cooldown timer after viewing surprise', async () => {
        const mockSurprise = {
            category: 'film',
            note: 'Test film',
            name: 'Test Movie',
            year: 2024
        };
        
        mockedAxios.get.mockResolvedValueOnce({ data: mockSurprise });
        
        render(<SurpriseViewer />);
        
        // Click to reveal
        fireEvent.click(screen.getByRole('button'));
        
        await waitFor(() => {
            expect(screen.getByText(/cooldown/i)).toBeInTheDocument();
        });
        
        // Fast-forward time
        act(() => {
            jest.advanceTimersByTime(15000);
        });
        
        expect(screen.getByText(/click to reveal/i)).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
        
        render(<SurpriseViewer />);
        
        // Click to reveal
        fireEvent.click(screen.getByRole('button'));
        
        await waitFor(() => {
            expect(screen.getByText(/failed to fetch surprise/i)).toBeInTheDocument();
        });
    });

    it('disables button during cooldown', async () => {
        const mockSurprise = {
            category: 'film',
            note: 'Test film',
            name: 'Test Movie',
            year: 2024
        };
        
        mockedAxios.get.mockResolvedValueOnce({ data: mockSurprise });
        
        render(<SurpriseViewer />);
        
        // Click to reveal
        fireEvent.click(screen.getByRole('button'));
        
        await waitFor(() => {
            expect(screen.getByRole('button')).toBeDisabled();
        });
        
        // Fast-forward time
        act(() => {
            jest.advanceTimersByTime(15000);
        });
        
        expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('displays different surprise types correctly', async () => {
        const mockPhoto = {
            category: 'photo',
            note: 'Test photo',
            image_url: 'https://example.com/test.jpg'
        };
        
        mockedAxios.get.mockResolvedValueOnce({ data: mockPhoto });
        
        render(<SurpriseViewer />);
        
        // Click to reveal
        fireEvent.click(screen.getByRole('button'));
        
        await waitFor(() => {
            expect(screen.getByText('Test photo')).toBeInTheDocument();
            expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/test.jpg');
        });
    });
}); 