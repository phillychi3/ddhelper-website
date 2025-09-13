import type { LiveStream, VTuber } from './types.js';

const API_URL = 'http://141.147.153.185:7600/live';
const VTUBER_API_URL = 'http://141.147.153.185:7600/allvtuber';

export async function fetchLiveStreams(): Promise<LiveStream[]> {
	try {
		const response = await fetch(API_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: LiveStream[] = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching live streams:', error);
		throw error;
	}
}

export function getYouTubeUrl(videoId: string): string {
	return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getChannelName(channelUrl: string): string {
	const match = channelUrl.match(/(?:channel\/|@)([^/?]+)/);
	return match ? match[1] : '未知頻道';
}

export function formatTitle(title: string): string {
	if (title.length > 80) {
		return title.substring(0, 80) + '...';
	}
	return title;
}

export function getRelativeTime(timestamp: string | null): string {
	if (!timestamp) return '';

	const now = new Date();
	const time = new Date(timestamp);
	const diffMs = now.getTime() - time.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMins < 1) return '剛剛開始';
	if (diffMins < 60) return `${diffMins} 分鐘前開始`;
	if (diffHours < 24) return `${diffHours} 小時前開始`;
	return `${diffDays} 天前開始`;
}

export function extractChannelId(channelUrl: string): string {
	const match = channelUrl.match(/channel\/([^/?]+)/);
	return match ? match[1] : '';
}

export async function fetchVTubers(): Promise<VTuber[]> {
	try {
		const response = await fetch(VTUBER_API_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: VTuber[] = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching VTubers:', error);
		throw error;
	}
}

export function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K';
	}
	return num.toString();
}
