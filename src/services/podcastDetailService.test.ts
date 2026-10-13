import { getPodcastDetail } from './podcastDetailService';

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getPodcastDetail', () => {
    it('obtiene y transforma correctamente el detalle del podcast', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            results: [
              {
                kind: 'podcast',
                collectionId: 123,
                collectionName: 'Test Podcast',
                artistName: 'Test Author',
                artworkUrl600: 'image-600.jpg',
                artworkUrl100: 'image-100.jpg',
                description: 'Podcast description',
                feedUrl: 'https://example.com/feed',
              },
              {
                kind: 'podcast-episode',
                collectionId: 123,
                trackId: 456,
                trackName: 'Episode 1',
                description: 'Episode description',
                releaseDate: '2026-01-15T10:00:00Z',
                trackTimeMillis: 125000,
                episodeUrl: 'https://example.com/episode.mp3',
              },
            ],
          }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result).toEqual({
        id: '123',
        title: 'Test Podcast',
        author: 'Test Author',
        image: 'image-600.jpg',
        description: 'Podcast description',
        podcastUrl: 'https://example.com/feed',
        episodes: [
          {
            id: '456',
            title: 'Episode 1',
            description: 'Episode description',
            releaseDate: '2026-01-15T10:00:00Z',
            duration: 125,
            audioUrl: 'https://example.com/episode.mp3',
          },
        ],
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://itunes.apple.com/lookup?id=123&media=podcast&entity=podcastEpisode&limit=20',
      );
    });

    it('convierte correctamente la duración de milisegundos a segundos', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            results: [
              {
                kind: 'podcast',
                collectionId: 123,
                collectionName: 'Test Podcast',
                artistName: 'Test Author',
              },
              {
                kind: 'podcast-episode',
                trackId: 456,
                trackName: 'Episode 1',
                trackTimeMillis: 3665000,
              },
            ],
          }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result.episodes[0].duration).toBe(3665);
    });

    it('utiliza artworkUrl100 cuando no existe artworkUrl600', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            results: [
              {
                kind: 'podcast',
                collectionId: 123,
                collectionName: 'Test Podcast',
                artistName: 'Test Author',
                artworkUrl100: 'image-100.jpg',
              },
            ],
          }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result.image).toBe('image-100.jpg');
    });

    it('utiliza valores vacíos cuando faltan datos opcionales', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            results: [
              {
                kind: 'podcast',
                collectionId: 123,
              },
              {
                kind: 'podcast-episode',
                trackId: 456,
              },
            ],
          }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result).toEqual({
        id: '123',
        title: '',
        author: '',
        image: '',
        description: '',
        podcastUrl: undefined,
        episodes: [
          {
            id: '456',
            title: '',
            description: '',
            releaseDate: '',
            duration: 0,
            audioUrl: '',
          },
        ],
      });
    });

    it('ignora resultados que no sean episodios', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            results: [
              {
                kind: 'podcast',
                collectionId: 123,
                collectionName: 'Test Podcast',
                artistName: 'Test Author',
              },
              {
                kind: 'podcast-episode',
                trackId: 456,
                trackName: 'Episode 1',
              },
              {
                kind: 'artist',
                trackId: 789,
                trackName: 'Something else',
              },
            ],
          }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result.episodes).toHaveLength(1);
      expect(result.episodes[0].id).toBe('456');
    });

    it('utiliza previewUrl cuando no existe episodeUrl', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            results: [
              {
                kind: 'podcast',
                collectionId: 123,
                collectionName: 'Test Podcast',
                artistName: 'Test Author',
              },
              {
                kind: 'podcast-episode',
                trackId: 456,
                trackName: 'Episode 1',
                previewUrl: 'https://example.com/preview.mp3',
              },
            ],
          }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result.episodes[0].audioUrl).toBe(
        'https://example.com/preview.mp3',
      );
    });

    it('lanza un error cuando la petición del detalle falla', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      } as Response);

      await expect(getPodcastDetail('123')).rejects.toThrow(
        'Failed to fetch podcast detail: 404',
      );
    });

    it('lanza un error cuando el podcast no existe en la respuesta', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            results: [
              {
                kind: 'podcast',
                collectionId: 999,
                collectionName: 'Another Podcast',
                artistName: 'Another Author',
              },
            ],
          }),
      } as Response);

      await expect(getPodcastDetail('123')).rejects.toThrow(
        'Podcast not found: 123',
      );
    });
  });