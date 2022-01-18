<!-- When file is named __layout.reset.svelte, then parent layout is not included -->
<div class="prose">
	<slot />
	<aside>
		<h5>Archive</h5>
		<ul>
			<li><a href="/posts">Home</a></li>
			<li><a href="/posts/about">About Blog</a></li>
			<li><a href="">Three</a></li>
			<li><a href="">Four</a></li>
			<li><a href="">Five</a></li>
		</ul>
	</aside>
</div>
