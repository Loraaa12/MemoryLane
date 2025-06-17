import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddSurpriseForm from '../AddSurpriseForm';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AddSurpriseForm', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    it('renders all category options', () => {
        render(<AddSurpriseForm />);
        
        expect(screen.getByText('Film')).toBeInTheDocument();
        expect(screen.getByText('Photo')).toBeInTheDocument();
        expect(screen.getByText('Quote')).toBeInTheDocument();
    });

    it('shows film fields when film is selected', () => {
        render(<AddSurpriseForm />);
        
        fireEvent.click(screen.getByText('Film'));
        
        expect(screen.getByLabelText(/movie name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    });

    it('shows photo fields when photo is selected', () => {
        render(<AddSurpriseForm />);
        
        fireEvent.click(screen.getByText('Photo'));
        
        expect(screen.getByLabelText(/photo url/i)).toBeInTheDocument();
    });

    it('shows quote fields when quote is selected', () => {
        render(<AddSurpriseForm />);
        
        fireEvent.click(screen.getByText('Quote'));
        
        expect(screen.getByLabelText(/quote text/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    });

    it('submits film data correctly', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });
        
        render(<AddSurpriseForm />);
        
        // Select film category
        fireEvent.click(screen.getByText('Film'));
        
        // Fill in form
        fireEvent.change(screen.getByLabelText(/movie name/i), {
            target: { value: 'Test Movie' }
        });
        fireEvent.change(screen.getByLabelText(/year/i), {
            target: { value: '2024' }
        });
        fireEvent.change(screen.getByLabelText(/note/i), {
            target: { value: 'Test note' }
        });
        
        // Submit form
        fireEvent.click(screen.getByText('Add Surprise'));
        
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8000/api/surprises/',
                expect.objectContaining({
                    category: 'film',
                    name: 'Test Movie',
                    year: 2024,
                    note: 'Test note'
                })
            );
        });
    });

    it('submits photo data correctly', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });
        
        render(<AddSurpriseForm />);
        
        // Select photo category
        fireEvent.click(screen.getByText('Photo'));
        
        // Fill in form
        fireEvent.change(screen.getByLabelText(/photo url/i), {
            target: { value: 'https://example.com/test.jpg' }
        });
        fireEvent.change(screen.getByLabelText(/note/i), {
            target: { value: 'Test note' }
        });
        
        // Submit form
        fireEvent.click(screen.getByText('Add Surprise'));
        
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8000/api/surprises/',
                expect.objectContaining({
                    category: 'photo',
                    image_url: 'https://example.com/test.jpg',
                    note: 'Test note'
                })
            );
        });
    });

    it('submits quote data correctly', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });
        
        render(<AddSurpriseForm />);
        
        // Select quote category
        fireEvent.click(screen.getByText('Quote'));
        
        // Fill in form
        fireEvent.change(screen.getByLabelText(/quote text/i), {
            target: { value: 'Test quote' }
        });
        fireEvent.change(screen.getByLabelText(/author/i), {
            target: { value: 'Test Author' }
        });
        fireEvent.change(screen.getByLabelText(/note/i), {
            target: { value: 'Test note' }
        });
        
        // Submit form
        fireEvent.click(screen.getByText('Add Surprise'));
        
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8000/api/surprises/',
                expect.objectContaining({
                    category: 'quote',
                    text: 'Test quote',
                    author: 'Test Author',
                    note: 'Test note'
                })
            );
        });
    });

    it('shows error message on submission failure', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Failed to submit'));
        
        render(<AddSurpriseForm />);
        
        // Select film category
        fireEvent.click(screen.getByText('Film'));
        
        // Fill in form
        fireEvent.change(screen.getByLabelText(/movie name/i), {
            target: { value: 'Test Movie' }
        });
        fireEvent.change(screen.getByLabelText(/year/i), {
            target: { value: '2024' }
        });
        fireEvent.change(screen.getByLabelText(/note/i), {
            target: { value: 'Test note' }
        });
        
        // Submit form
        fireEvent.click(screen.getByText('Add Surprise'));
        
        await waitFor(() => {
            expect(screen.getByText(/failed to add surprise/i)).toBeInTheDocument();
        });
    });
}); 