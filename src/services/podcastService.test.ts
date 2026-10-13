import { getTopPodcasts } from './podcastService';

describe('podcastService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getTopPodcasts', () => {
    it('obtiene y transforma correctamente los podcasts', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          feed: {
            entry: [
              {
                id: {
                  attributes: {
                    'im:id': '123',
                  },
                },
                'im:name': {
                  label: 'Test Podcast',
                },
                'im:artist': {
                  label: 'Test Author',
                },
                'im:image': [
                  { label: 'image-55.jpg' },
                  { label: 'image-60.jpg' },
                  { label: 'image-100.jpg' },
                ],
                summary: {
                  label: 'Podcast description',
                },
                link: {
                  attributes: {
                    href: 'https://example.com/podcast',
                  },
                },
              },
            ],
          },
        }),
      } as Response);

      const result = await getTopPodcasts();

      expect(result).toEqual([
        {
          id: '123',
          title: 'Test Podcast',
          author: 'Test Author',
          image: 'image-100.jpg',
          description: 'Podcast description',
          podcastUrl: 'https://example.com/podcast',
        },
      ]);

      expect(mockFetch).toHaveBeenCalledTimes(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json',
      );
    });

    it('utiliza la primera imagen cuando no existe la imagen de mayor resolución', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          feed: {
            entry: [
              {
                id: {
                  attributes: {
                    'im:id': '123',
                  },
                },
                'im:name': {
                  label: 'Test Podcast',
                },
                'im:artist': {
                  label: 'Test Author',
                },
                'im:image': [{ label: 'image-55.jpg' }],
              },
            ],
          },
        }),
      } as Response);

      const result = await getTopPodcasts();

      expect(result[0].image).toBe('image-55.jpg');
    });

    it('utiliza una descripción vacía cuando no existe summary', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          feed: {
            entry: [
              {
                id: {
                  attributes: {
                    'im:id': '123',
                  },
                },
                'im:name': {
                  label: 'Test Podcast',
                },
                'im:artist': {
                  label: 'Test Author',
                },
                'im:image': [{ label: 'image.jpg' }],
              },
            ],
          },
        }),
      } as Response);

      const result = await getTopPodcasts();

      expect(result[0].description).toBe('');
    });

    it('utiliza undefined cuando el podcast no tiene URL', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          feed: {
            entry: [
              {
                id: {
                  attributes: {
                    'im:id': '123',
                  },
                },
                'im:name': {
                  label: 'Test Podcast',
                },
                'im:artist': {
                  label: 'Test Author',
                },
                'im:image': [{ label: 'image.jpg' }],
              },
            ],
          },
        }),
      } as Response);

      const result = await getTopPodcasts();

      expect(result[0].podcastUrl).toBeUndefined();
    });

    it('lanza un error cuando la petición de podcasts falla', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getTopPodcasts()).rejects.toThrow(
        'Failed to fetch podcasts: 500',
      );
    });
  });
});