import { render, screen } from '@testing-library/react';
import { PodcastGrid } from './PodcastGrid';
import type { Podcast } from '@/types/podcast';


jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    priority,
    loading,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      {...props}
      loading={priority ? 'eager' : loading ?? 'lazy'}
    />
  ),
}));

const podcasts: Podcast[] = [
  {
    id: '1',
    title: 'Podcast One',
    author: 'Author One',
    image: 'https://example.com/image1.jpg',
    description: 'Description One',
    podcastUrl: 'https://example.com/podcast1',
  },
  {
    id: '2',
    title: 'Podcast Two',
    author: 'Author Two',
    image: 'https://example.com/image2.jpg',
    description: 'Description Two',
    podcastUrl: 'https://example.com/podcast2',
  },
  {
    id: '3',
    title: 'Podcast Three',
    author: 'Author Three',
    image: 'https://example.com/image3.jpg',
    description: 'Description Three',
    podcastUrl: 'https://example.com/podcast3',
  },
];

describe('PodcastGrid', () => {
  it('renderiza todos los podcasts', () => {
    render(<PodcastGrid podcasts={podcasts} />);

    expect(
      screen.getByRole('heading', {
        name: 'Podcast One',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Podcast Two',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Podcast Three',
      }),
    ).toBeInTheDocument();
  });

  it('renderiza correctamente los autores', () => {
    render(<PodcastGrid podcasts={podcasts} />);

    expect(screen.getByText('Author: Author One')).toBeInTheDocument();
    expect(screen.getByText('Author: Author Two')).toBeInTheDocument();
    expect(screen.getByText('Author: Author Three')).toBeInTheDocument();
  });

  it('renderiza correctamente las imágenes', () => {
    const { container } = render(<PodcastGrid podcasts={podcasts} />);

    const images = container.querySelectorAll('img');

    expect(images).toHaveLength(3);

    expect(images[0]).toHaveAttribute(
      'src',
      'https://example.com/image1.jpg',
    );

    expect(images[1]).toHaveAttribute(
      'src',
      'https://example.com/image2.jpg',
    );

    expect(images[2]).toHaveAttribute(
      'src',
      'https://example.com/image3.jpg',
    );
  });


  it('carga de forma prioritaria las imágenes de los dos primeros podcasts', () => {
    const { container } = render(<PodcastGrid podcasts={podcasts} />);

    const images = container.querySelectorAll('img');

    expect(images).toHaveLength(3);

    expect(images[0]).toHaveAttribute('loading', 'eager');
    expect(images[1]).toHaveAttribute('loading', 'eager');
    expect(images[2]).toHaveAttribute('loading', 'lazy');
  });
});