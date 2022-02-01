<script>
	export let label;
	export let enabled = true;
	export let handleStore;

	function handleClick() {
		handleStore();
		enabled = !enabled;
	}
</script>

<div class="flex flex-col items-center">
	<!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
	<button
		on:click={handleClick}
		type="button"
		class="{enabled
			? 'bg-orange-500'
			: 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
		role="switch"
		aria-checked="false"
		aria-labelledby="annual-billing-label"
	>
		<!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
		<span
			aria-hidden="true"
			class="{enabled
				? 'translate-x-5'
				: 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
		/>
	</button>
	<span class="mt-1">
		<span class="text-sm font-medium text-gray-700">{label}</span>
	</span>
</div>
