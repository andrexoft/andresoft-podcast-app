import { render, screen } from '@testing-library/react';

import { Loading } from './Loading';

describe('Loading', () => {
  it('renderiza el mensaje por defecto', () => {
    render(<Loading />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renderiza un mensaje personalizado', () => {
    render(<Loading message="Loading podcasts..." />);

    expect(screen.getByText('Loading podcasts...')).toBeInTheDocument();
  });

  it('tiene el estado accesible de carga', () => {
    render(<Loading />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('incluye el spinner visual', () => {
    render(<Loading />);

    const status = screen.getByRole('status');
    const spinner = status.querySelector('[aria-hidden="true"]');

    expect(spinner).toBeInTheDocument();
  });
});
