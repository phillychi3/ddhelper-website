<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Live 列表 - DD Helper</title>
	<meta name="description" content="Vtuber Live Streams" />
</svelte:head>

<div class="min-h-screen bg-slate-900 text-white">
	<header class="sticky top-0 z-50 border-b border-slate-700 bg-slate-800">
		<div class="container mx-auto px-4 py-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<h1 class="text-2xl font-bold text-blue-400">DDHelper</h1>
				</div>

				<nav class="hidden items-center space-x-6 md:flex">
					<a href="/" class="text-gray-300 transition-colors hover:text-white"> Live Streams </a>
					<a href="/vtuber" class="text-gray-300 transition-colors hover:text-white">
						VTuber 列表
					</a>
				</nav>

				<button class="text-gray-300 hover:text-white md:hidden" aria-label="開啟選單">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</div>
	</header>

	<main class="container mx-auto px-4 py-6">
		{@render children?.()}
	</main>

	<footer class="mt-12 border-t border-slate-700 bg-slate-800">
		<div class="container mx-auto px-4 py-6 text-center text-gray-400">
			<p>&copy; 2025 DDHelper</p>
		</div>
	</footer>
</div>
