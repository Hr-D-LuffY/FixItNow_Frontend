import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "your-image-host.example.com" },
		],
	},
};

export default nextConfig;
