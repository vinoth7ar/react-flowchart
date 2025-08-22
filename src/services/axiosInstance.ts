// Simplified axios instance for demonstration
// In a real implementation, you would configure this with proper environment variables

const createAxiosInstance = () => {
  // Mock axios-like interface for demonstration
  // In production, you would import actual axios here
  return {
    create: (config: any) => ({
      request: async (requestConfig: any) => {
        // Mock implementation - replace with real axios in production
        const url = `${config.baseURL || ''}${requestConfig.url}`;
        const response = await fetch(url, {
          method: requestConfig.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...requestConfig.headers,
          },
          body: requestConfig.data ? JSON.stringify(requestConfig.data) : undefined,
        });
        
        return {
          data: await response.json(),
          status: response.status,
          statusText: response.statusText,
        };
      },
    }),
  };
};

const axiosLib = createAxiosInstance();

const instance = axiosLib.create({
  baseURL: '/api', // Default base URL
});

export default instance;