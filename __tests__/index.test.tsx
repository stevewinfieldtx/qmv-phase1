import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Landing from '../pages/index';
import React from 'react';
import { describe, it, expect } from '@jest/globals';

jest.mock('next/head', () => ({ __esModule: true, default: ({ children }: any) => <>{children}</> }));

describe('Landing Page', () => {
  it('renders heading', () => {
    render(<Landing />);
    expect(screen.getByRole('heading', { name: /create your custom music video/i })).toBeInTheDocument();
  });
});

export {};