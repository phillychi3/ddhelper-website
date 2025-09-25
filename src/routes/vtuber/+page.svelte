<script lang="ts">
	import { onMount } from 'svelte';
	import type { VTuber } from '$lib/types.js';
	import { fetchVTubers } from '$lib/api.js';
	import VTuberCard from '$lib/components/VTuberCard.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	let vtubers: VTuber[] = [];
	let isLoading = true;
	let error: string | null = null;
	let searchTerm = '';
	let selectedCompany = '';
	let selectedCountry = '';
	let selectedStatus = '';

	$: companies = [...new Set(vtubers.map((v) => v.company))].sort();
	$: countries = [...new Set(vtubers.map((v) => v.country))].sort();
	$: statuses = [...new Set(vtubers.map((v) => v.activity_status))].sort();

	$: filteredVtubers = (() => {
		const uniqueVtubers = vtubers.reduce((acc, vtuber) => {
			if (!acc.find((v) => v.channel_id === vtuber.channel_id)) {
				acc.push(vtuber);
			}
			return acc;
		}, [] as VTuber[]);

		return uniqueVtubers.filter((vtuber) => {
			const matchesSearch = vtuber.name.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCompany = !selectedCompany || vtuber.company === selectedCompany;
			const matchesCountry = !selectedCountry || vtuber.country === selectedCountry;
			const matchesStatus = !selectedStatus || vtuber.activity_status === selectedStatus;

			return matchesSearch && matchesCompany && matchesCountry && matchesStatus;
		});
	})();

	async function loadVTubers() {
		try {
			isLoading = true;
			error = null;
			vtubers = await fetchVTubers();
		} catch (err) {
			error = err instanceof Error ? err.message : '載入 VTuber 資料時發生錯誤';
		} finally {
			isLoading = false;
		}
	}

	onMount(loadVTubers);
</script>

<svelte:head>
	<title>VTuber 列表 - DD Helper</title>
	<meta name="description" content="瀏覽所有 VTuber 的詳細資訊" />
</svelte:head>

{#if error}
	<ErrorMessage {error} />
	<div class="text-center">
		<button
			on:click={loadVTubers}
			class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
		>
			重新載入
		</button>
	</div>
{:else if isLoading}
	<LoadingSpinner />
{:else}
	<div class="mb-6">
		<div
			class="flex flex-col items-center justify-between gap-4 rounded-lg bg-slate-800 p-4 md:flex-row"
		>
			<div class="relative max-w-md flex-1">
				<input
					type="text"
					placeholder="搜尋 VTuber 名稱..."
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
					bind:value={selectedCompany}
					class="rounded-lg bg-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">所有公司</option>
					{#each companies as company}
						<option value={company}>{company}</option>
					{/each}
				</select>

				<select
					bind:value={selectedCountry}
					class="rounded-lg bg-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">所有地區</option>
					{#each countries as country}
						<option value={country}>{country}</option>
					{/each}
				</select>

				<select
					bind:value={selectedStatus}
					class="rounded-lg bg-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">所有狀態</option>
					{#each statuses as status}
						<option value={status}>{status}</option>
					{/each}
				</select>

				<div class="text-sm text-gray-400">
					共 {filteredVtubers.length} 個 VTuber
				</div>

				<button
					on:click={loadVTubers}
					class="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					disabled={isLoading}
				>
					<svg
						class="h-4 w-4 {isLoading ? 'animate-spin' : ''}"
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
					<span>{isLoading ? '載入中' : '重新整理'}</span>
				</button>
			</div>
		</div>
	</div>

	{#if filteredVtubers.length === 0}
		<div class="py-12 text-center">
			<p class="text-lg text-gray-400">沒有找到符合條件的 VTuber</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredVtubers as vtuber, index (`${vtuber.channel_id || vtuber.name}-${index}`)}
				<VTuberCard {vtuber} />
			{/each}
		</div>
	{/if}
{/if}
