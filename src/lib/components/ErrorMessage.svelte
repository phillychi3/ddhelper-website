<script lang="ts">
	interface Props {
		error: string;
		onRetry?: () => void;
	}

	let { error, onRetry }: Props = $props();
</script>

<div class="flex items-center justify-center py-12">
	<div class="text-center">
		<div class="max-w-md rounded-lg border border-red-800 bg-red-900/20 p-6">
			<div class="mb-4 flex justify-center">
				<svg class="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>

			<h3 class="mb-2 font-medium text-red-400">載入失敗</h3>
			<p class="mb-4 text-sm text-gray-400">{error}</p>

			{#if onRetry}
				<button
					onclick={onRetry}
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
				>
					重試
				</button>
			{/if}
		</div>
	</div>
</div>
