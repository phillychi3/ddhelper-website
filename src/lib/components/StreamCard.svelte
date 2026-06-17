<script lang="ts">
	import { onMount } from 'svelte';
	import type { LiveStream } from '$lib/types.js';
	import {
		getYouTubeUrl,
		getChannelName,
		formatTitle,
		getScheduledStartText,
		getLiveDurationText
	} from '$lib/api.js';

	interface Props {
		stream: LiveStream;
	}

	let { stream }: Props = $props();
	let nowMs = $state(Date.now());

	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	}

	function handleCardClick() {
		if (stream.platform === 'twitch') {
			window.open(stream.channel, '_blank');
			return;
		}
		window.open(getYouTubeUrl(stream.video_id), '_blank');
	}

	function handleChannelClick(event: MouseEvent) {
		event.stopPropagation();
		window.open(stream.channel, '_blank');
	}

	function getStatusLabel(stream: LiveStream): string {
		return stream.status === 'READY_TO_LIVE' ? '即將直播' : '直播中';
	}

	function getStatusTimeText(stream: LiveStream): string {
		return stream.status === 'READY_TO_LIVE'
			? getScheduledStartText(stream.timestamp)
			: getLiveDurationText(stream.timestamp, nowMs);
	}

	onMount(() => {
		const timer = setInterval(() => {
			nowMs = Date.now();
		}, 60000);

		return () => clearInterval(timer);
	});
</script>

<div
	class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-slate-900 shadow-lg"
	onclick={handleCardClick}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleCardClick()}
>
	<div class="relative">
		<img
			src={stream.thumbnail}
			alt={stream.title}
			class="aspect-video w-full object-cover transition-opacity group-hover:opacity-90"
			loading="lazy"
		/>

		<div class="absolute top-2 left-2">
			<span
				class="flex items-center rounded px-2 py-1 text-xs font-bold text-white {stream.status ===
				'READY_TO_LIVE'
					? 'bg-amber-500'
					: stream.platform === 'youtube'
						? 'bg-red-600'
						: stream.platform === 'twitch'
							? 'bg-purple-600'
							: 'bg-gray-600'}"
			>
				{#if stream.status === 'LIVE'}
					<span class="mr-1 h-2 w-2 animate-pulse rounded-full bg-white"></span>
				{/if}
				{getStatusLabel(stream)}
			</span>
		</div>

		<div class="absolute top-2 right-2">
			<span class="rounded bg-black/70 px-2 py-1 text-xs text-white capitalize">
				{stream.platform}
			</span>
		</div>

		<div
			class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
		>
			<div class="rounded-full bg-red-600 p-3">
				<svg class="h-6 w-6 fill-current text-white" viewBox="0 0 24 24">
					<path d="M8 5v14l11-7z" />
				</svg>
			</div>
		</div>
	</div>

	<div class="flex flex-1 flex-col p-4">
		<h3 class="mb-2 line-clamp-2 text-sm leading-tight font-medium text-white">
			{formatTitle(stream.title)}
		</h3>

		{#if stream.vtuber}
			<div class="mb-3 flex items-center space-x-2">
				<div class="min-w-0 flex-1">
					<button
						class="block truncate text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
						onclick={handleChannelClick}
					>
						{stream.vtuber.name}
					</button>
				</div>
			</div>
		{:else}
			<button
				class="flex items-center space-x-2 text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
				onclick={handleChannelClick}
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
					/>
				</svg>
				<span class="truncate">{getChannelName(stream.channel)}</span>
			</button>
		{/if}

		<div class="mt-auto flex items-center justify-between pt-3 text-xs text-gray-400">
			<span class="capitalize">{stream.platform}</span>
			<span class={stream.status === 'READY_TO_LIVE' ? 'text-amber-300' : 'text-green-400'}>
				{getStatusTimeText(stream)}
			</span>
		</div>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
