import type { LiveStream, VTuber } from './types.js';

const API_URL = 'https://ddapi.cloudowo.com/live?status=ALL';
const VTUBER_API_URL = 'https://ddapi.cloudowo.com/allvtuber';

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

export function getTimestampMs(timestamp: string | number | null): number | null {
	if (timestamp === null || timestamp === undefined) {
		return null;
	}

	if (typeof timestamp === 'number') {
		if (!Number.isFinite(timestamp)) {
			return null;
		}
		return timestamp < 1000000000000 ? timestamp * 1000 : timestamp;
	}

	const numericTimestamp = Number(timestamp);
	if (Number.isFinite(numericTimestamp) && timestamp.trim() !== '') {
		return numericTimestamp < 1000000000000 ? numericTimestamp * 1000 : numericTimestamp;
	}

	const parsed = Date.parse(timestamp);
	return Number.isNaN(parsed) ? null : parsed;
}

export function getScheduledStartText(timestamp: string | number | null): string {
	const timestampMs = getTimestampMs(timestamp);
	if (!timestampMs) {
		return '開播時間待定';
	}

	const startDate = new Date(timestampMs);
	const now = new Date();
	const isToday = startDate.toDateString() === now.toDateString();

	if (isToday) {
		return `今天 ${new Intl.DateTimeFormat('zh-TW', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		}).format(startDate)} 開始`;
	}

	return `${new Intl.DateTimeFormat('zh-TW', {
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).format(startDate)} 開始`;
}

export function getLiveDurationText(
	timestamp: string | number | null,
	nowMs: number = Date.now()
): string {
	const timestampMs = getTimestampMs(timestamp);
	if (!timestampMs) {
		return '直播中';
	}

	const diffMs = nowMs - timestampMs;
	if (diffMs <= 0) {
		return '直播中';
	}

	const totalMinutes = Math.floor(diffMs / 60000);
	if (totalMinutes < 1) {
		return '已直播 1 分鐘內';
	}

	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	if (hours === 0) {
		return `已直播 ${minutes} 分鐘`;
	}

	return `已直播 ${hours} 小時 ${minutes} 分鐘`;
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
