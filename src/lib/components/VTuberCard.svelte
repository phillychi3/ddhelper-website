<script lang="ts">
	import type { VTuber } from '$lib/types.js';
	import { formatNumber } from '$lib/api.js';

	export let vtuber: VTuber;

	$: statusColor = vtuber.activity_status === 'active' ? 'text-green-400' : 'text-gray-400';
</script>

<div
	class="hover:bg-slate-750 rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-lg transition-all duration-200 hover:shadow-xl"
>
	<div class="flex items-start space-x-4">
		{#if vtuber.thumbnail}
			<img
				src={vtuber.thumbnail}
				alt={vtuber.name}
				class="h-16 w-16 rounded-full object-cover ring-2 ring-slate-600"
			/>
		{:else}
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 ring-2 ring-slate-600"
			>
				<span class="text-2xl font-semibold text-gray-300">{vtuber.name.charAt(0)}</span>
			</div>
		{/if}

		<div class="min-w-0 flex-1">
			<h3 class="truncate text-lg font-semibold text-white">{vtuber.name}</h3>
			<p class="text-sm text-gray-300">{vtuber.company} • {vtuber.country}</p>
			<p class="text-sm {statusColor} font-medium capitalize">{vtuber.activity_status}</p>
		</div>
	</div>

	<div class="mt-4 grid grid-cols-3 gap-4 text-sm">
		<div>
			<p class="text-gray-400">訂閱者</p>
			<p class="font-medium text-white">{formatNumber(vtuber.subscriber_count)}</p>
		</div>
		<div>
			<p class="text-gray-400">觀看次數</p>
			<p class="font-medium text-white">{formatNumber(vtuber.view_count)}</p>
		</div>
		<div>
			<p class="text-gray-400">影片數</p>
			<p class="font-medium text-white">{vtuber.video_count}</p>
		</div>
	</div>

	{#if vtuber.debut_date}
		<div class="mt-3">
			<p class="text-xs text-gray-400">出道日期: {vtuber.debut_date}</p>
		</div>
	{/if}

	<div class="mt-4">
		<a
			href={vtuber.channel_url}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm leading-4 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 focus:outline-none"
		>
			查看頻道
			<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
				></path>
			</svg>
		</a>
	</div>
</div>
