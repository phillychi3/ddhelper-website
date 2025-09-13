export interface LiveStream {
	status: 'LIVE' | 'READY_TO_LIVE';
	channel: string;
	video_id: string;
	title: string;
	thumbnail: string;
	platform: 'youtube' | 'twitch' | 'bilibili';
	timestamp: string | null;
}

export interface ApiResponse {
	streams: LiveStream[];
	total: number;
	fetched_at: string;
}

export interface StreamCardProps {
	stream: LiveStream;
}

export interface VTuber {
	name: string;
	company: string;
	country: string;
	channel_url: string;
	platform: string;
	subscriber_count: number;
	view_count: number;
	video_count: number;
	activity_status: string;
	debut_date: string;
	thumbnail: string;
	channel_id: string;
}
