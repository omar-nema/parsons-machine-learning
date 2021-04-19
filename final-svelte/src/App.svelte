


<script>
	import Posters from './Posters.svelte'
</script>


<body>
	<header>
		<div class="header-large">Palestine Poster Project</div>
		<Posters></Posters>
	</header>
</body>


<style>

	@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');

	:global(body) {
		margin: 0;
		padding: 0;
	}

	* {
		font-family: 'Rubik', 'sans-serif';
		margin: 0;
	}

	body {
		margin: 0;
		padding: 0 !important;
		overflow: hidden;
		background: rgb(40,40,40);
		font-weight: 400;
	}

	header {
		background: rgb(10,10,10);
		width: 100%;
		padding: 0 50px; 
		margin: 0;
		display: flex;
		align-items: center;
		height: 50px;
		box-shadow: 0px 2px 3px 3px rgb(37 37 37 / 24%);
	}
	.header-large {
		color: white;
		font-size: 18px;
	}
	canvas {
		margin-top: 20px;
		margin-left: 50px;
	}


</style>