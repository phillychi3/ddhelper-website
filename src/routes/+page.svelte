<script lang="ts">
	import { onMount } from 'svelte';
	import type { LiveStream } from '$lib/types.js';
	import { fetchLiveStreams } from '$lib/api.js';
	import StreamCard from '$lib/components/StreamCard.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	let streams: LiveStream[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let sortBy = $state<'title' | 'channel' | 'recent'>('recent');

	let filteredStreams = $derived(() => {
		let liveStreams = streams.filter((stream) => stream.status === 'LIVE');
		const uniqueStreams = liveStreams.reduce((acc, stream) => {
			if (!acc.find(s => s.video_id === stream.video_id)) {
				acc.push(stream);
			}
			return acc;
		}, [] as LiveStream[]);

		let filtered = uniqueStreams.filter(
			(stream) =>
				stream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				stream.channel.toLowerCase().includes(searchTerm.toLowerCase())
		);

		switch (sortBy) {
			case 'title':
				return filtered.sort((a, b) => a.title.localeCompare(b.title));
			case 'channel':
				return filtered.sort((a, b) => a.channel.localeCompare(b.channel));
			case 'recent':
			default:
				return filtered;
		}
	});

	async function loadStreams() {
		try {
			loading = true;
			error = '';
			streams = await fetchLiveStreams();
		} catch (err) {
			error = err instanceof Error ? err.message : '未知錯誤';
			console.error('Failed to load streams:', err);
		} finally {
			loading = false;
		}
	}

	function handleRetry() {
		loadStreams();
	}

	onMount(() => {
		loadStreams();
	});
</script>

<svelte:head>
	<title>Live 列表 - DD Helper</title>
</svelte:head>

<div class="space-y-6">
	<div
		class="flex flex-col items-center justify-between gap-4 rounded-lg bg-slate-800 p-4 md:flex-row"
	>
		<div class="relative max-w-md flex-1">
			<input
				type="text"
				placeholder="搜尋直播或頻道..."
				bind:value={searchTerm}
				class="w-full rounded-lg bg-slate-700 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
			<svg
				class="absolute top-2.5 right-3 h-5 w-5 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</div>

		<div class="flex items-center space-x-4">
			<select
				bind:value={sortBy}
				class="rounded-lg bg-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="recent">最近直播</option>
				<option value="title">標題排序</option>
				<option value="channel">頻道排序</option>
			</select>

			{#if !loading && !error}
				<div class="text-sm text-gray-400">
					共 {filteredStreams().length} 個直播
				</div>
			{/if}
			<button
				onclick={loadStreams}
				class="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
				disabled={loading}
			>
				<svg
					class="h-4 w-4 {loading ? 'animate-spin' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
				<span>{loading ? '載入中' : '重新整理'}</span>
			</button>
		</div>
	</div>

	{#if loading}
		<LoadingSpinner />
	{:else if error}
		<ErrorMessage {error} onRetry={handleRetry} />
	{:else if filteredStreams().length === 0}
		<div class="py-12 text-center">
			<div class="mx-auto max-w-md rounded-lg bg-slate-800 p-8">
				<svg
					class="mx-auto mb-4 h-16 w-16 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
				<h3 class="mb-2 text-lg font-medium text-gray-300">目前沒有直播</h3>
				<p class="text-sm text-gray-400">
					{searchTerm ? '沒有符合搜尋條件的直播' : '所有 VTuber 都不在線上'}
				</p>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredStreams() as stream (`${stream.video_id}-${stream.platform}`)}
				<StreamCard {stream} />
			{/each}
		</div>
	{/if}
</div>
