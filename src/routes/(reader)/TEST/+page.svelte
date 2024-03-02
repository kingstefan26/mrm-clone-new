<script>
</script>

<div class="carona">
	<div />
</div>

<style>
	div.carona {
		width: 500px;
		max-width: 80%;
		height: 400px;
		margin: 200px auto;
	}

	div.carona div {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #111;
		box-shadow: 0px 0px 60px #fff;
		position: relative;
	}

	div.carona div::before {
		content: '';
		display: block;
		width: 80%;
		height: 80%;
		/*border: 2px solid red;*/
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(50deg);
		border-radius: 40%;
		box-shadow: 40px 0px 90px #fff;
		z-index: 1;
		animation: carona_a 10s linear infinite;
	}

	div.carona div::after {
		content: '';
		display: block;
		width: 86%;
		height: 80%;
		/*border: 2px solid red;*/
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-82deg);
		border-radius: 40%;
		box-shadow: 40px 0 90px #fff;
		z-index: 1;
		animation: carona_a 8s linear infinite;
	}

	@keyframes carona_a {
		from {
			transform: translate(-50%, -50%) rotate(-30deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(700deg);
		}
	}
</style>
