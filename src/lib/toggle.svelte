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
			: 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
		role="switch"
		aria-checked="false"
		aria-labelledby="annual-billing-label"
	>
		<!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
		<span
			aria-hidden="true"
			class="{enabled
				? 'translate-x-5'
				: 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
		/>
	</button>
	<span class="mt-1">
		<span class="text-sm font-medium text-gray-700">{label}</span>
	</span>
</div>
