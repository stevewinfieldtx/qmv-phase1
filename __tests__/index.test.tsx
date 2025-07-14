/// <reference types="jest" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import Landing from '../pages/index';
import '@testing-library/jest-dom';

jest.mock('next/head', () => ({ __esModule: true, default: ({ children }: any) => <>{children}</> }));

describe('Landing Page', () => {
  it('renders heading', () => {
    render(<Landing />);
    expect(screen.getByRole('heading', { name: /create your custom music video/i })).toBeInTheDocument();
  });
});

export {};