<script lang="ts">
	import type { LiveStream } from '$lib/types.js';
	import { getYouTubeUrl, getChannelName, formatTitle } from '$lib/api.js';

	interface Props {
		stream: LiveStream;
	}

	let { stream }: Props = $props();

	function handleCardClick() {
		window.open(getYouTubeUrl(stream.video_id), '_blank');
	}

	function handleChannelClick(event: MouseEvent) {
		event.stopPropagation();
		window.open(stream.channel, '_blank');
	}
</script>

<div
	class="group cursor-pointer overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
			<span class="flex items-center rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
				<span class="mr-1 h-2 w-2 animate-pulse rounded-full bg-white"></span>
				LIVE
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

	<div class="p-4">
		<h3 class="mb-2 line-clamp-2 text-sm leading-tight font-medium text-white">
			{formatTitle(stream.title)}
		</h3>

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

		<div class="mt-3 flex items-center justify-between text-xs text-gray-400">
			<span class="capitalize">{stream.platform}</span>
			<span class="text-green-400">● {stream.status}</span>
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
