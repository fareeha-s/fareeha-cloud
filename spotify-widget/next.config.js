/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable CORS for development
  async headers() {
    return [
      {
        // Allow requests from the ngrok domain
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  // Configure images if needed
  images: {
    domains: ['i.scdn.co'], // For Spotify album art
  }
};

module.exports = nextConfig; 