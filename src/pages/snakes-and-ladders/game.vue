<template>
	<v-container v-if="players">
		<v-snackbar v-model="specialAlert" :color="specialMessageColor" top right>
			{{ specialMessage }}
		</v-snackbar>
		<v-row justify="center">
			<v-col v-if="!winner.value" cols="auto"> </v-col>
			<v-dialog
				max-width="600"
				v-model="dialog"
				persistent
				transition="scale"
				v-else
			>
				<v-card elevation="12">
					<v-card-title color="primary" class="justify-center" dark>
						ΣΥΓΧΑΡΗΤΗΡΙΑ
					</v-card-title>
					<v-card-text>
						<div class="text-h2 pa-12">
							Κέρδισες {{ winner.player.name }} !!!!
						</div>
					</v-card-text>
					<v-card-actions class="justify-end">
						<v-btn rounded color="primary" @click="navigateToStart"
							>Πίσω στην αρχική</v-btn
						>
						<v-btn rounded color="primary" @click="restart">Παίξτε Ξανά</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-row>
		<v-row justify="center" align="start">
			<v-col cols="auto">
				<h1 class="text-center display-3 font-weight-light">
					Σειρα του παικτη {{ players[playersTurn].name }}
					<v-icon
						size="100"
						right
						:color="players[playersTurn].color.value"
						:style="`text-shadow: 2px 2px 10px ${playerShadow(
							players[playersTurn].color.value
						)}`"
						>{{ players[playersTurn].icon.value }}</v-icon
					>
				</h1>
			</v-col>
		</v-row>
		<v-row justify="center" align="start">
			<v-col cols="3" style="position: fixed; top: 25vh; left: 0px">
				<v-row justify="center" align="start" v-if="!winner.value">
					<v-col cols="12">
						<v-row justify="start" align="center">
							<v-col cols="auto">
								<v-btn
									rounded
									icon
									x-large
									color="primary"
									@click="diceroll"
									:disabled="dicerollInProgress || winner.value"
									width="150"
									height="150"
								>
									<v-icon size="150">mdi-dice-multiple</v-icon>
								</v-btn>
								<span class="pl-2 display-2 font-weight-light">Ρίξε ζάρι</span>
							</v-col>
							<v-col cols="auto">
								<v-icon color="green" size="100">
									mdi-dice-{{ diceNumber }}
								</v-icon>
							</v-col>
							<v-col cols="auto">
								<h1 class="display-4 font-weight-light">
									{{ diceNumber }}
								</h1>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="6">
				<v-row justify="center">
					<v-col
						cols="2"
						v-for="(tile, index) in tiles"
						:key="index"
						class="pa-0"
					>
						<v-card tile flat dark width="150" height="150" :color="tile.color">
							<v-card-title class="justify-center">
								{{ tile.tileNumber }}
							</v-card-title>
							<v-card-text class="d-flex justify-center pb-0">
								<v-row no-gutters justify="center" align="center">
									<v-col cols="6">
										<v-icon large class="d-flex">
											{{ tile.icon }}
										</v-icon>
									</v-col>
									<v-col cols="6" v-if="tile.hasSnake">
										<v-icon large class="d-flex">
											{{ tile.hasSnake.icon }}
										</v-icon>
									</v-col>
									<v-col cols="6" v-if="tile.hasLadder">
										<v-icon large class="d-flex">
											{{ tile.hasLadder.icon }}
										</v-icon>
									</v-col>

									<v-col
										cols="auto"
										v-for="(player, playerIndex) in players"
										:key="playerIndex"
									>
										<v-tooltip top>
											<template #activator="{ on, attrs }">
												<v-icon
													:color="player.color.value"
													large
													v-on="on"
													v-bind="attrs"
													:class="
														player.tile === tile.tileNumber
															? 'd-flex'
															: 'd-none'
													"
													style="
														text-stroke: 1px black;
														text-shadow: 2px 2px 12px black;
													"
												>
													{{ player.icon.value }}
												</v-icon>
											</template>
											<span>{{ player.name }}</span>
										</v-tooltip>
									</v-col>
								</v-row>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			tiles: [],
			players: [],
			playerNames: [],
			playersTurn: 0,
			dicerollInProgress: false,
			diceNumber: null,
			winner: {
				value: false,
				player: null,
			},
			colors: ['green', 'red', 'blue', 'orange', 'pink', 'lime', 'purple'],
			dialog: false,
			specialAlert: false,
			specialMessage: '',
			specialMessageColor: '',
		}
	},

	async mounted() {
		await this.fetchPlayers()
		await this.createBlocks()
	},

	methods: {
		createBlocks() {
			let blocks = this.$store.state.snakesAndLadders.settings.blocks
			const blockRows = blocks / 6

			for (let row = 0; row < blockRows; row++) {
				if (row % 2 === 0) {
					for (
						let currentBlock = blocks;
						currentBlock > blocks - 6;
						currentBlock--
					) {
						this.tiles.push({
							color: this.colors[this.colorPicker()],
							tileNumber: currentBlock,
							icon: 'mdi-arrow-left',
						})
					}
				} else {
					for (
						let currentBlock = blocks - 5;
						currentBlock <= blocks;
						currentBlock++
					) {
						this.tiles.push({
							color: this.colors[this.colorPicker()],
							tileNumber: currentBlock,
							icon: 'mdi-arrow-right',
						})
					}
				}

				blocks -= 6
			}

			if (this.$store.state.snakesAndLadders.settings.blocks === 24)
				this.tiles.forEach((tile) => {
					if (tile.tileNumber === 10 || tile.tileNumber === 16)
						tile.hasLadder = {
							value: true,
							icon: 'mdi-ladder',
							goForwardBlocks: 2,
						}

					if (tile.tileNumber === 3 || tile.tileNumber === 9)
						tile.hasLadder = {
							value: true,
							icon: 'mdi-ladder',
							goForwardBlocks: 3,
						}

					if (tile.tileNumber === 14 || tile.tileNumber === 18)
						tile.hasSnake = {
							value: true,
							icon: 'mdi-snake',
							goBackwardBlocks: 2,
						}

					if (tile.tileNumber === 7 || tile.tileNumber === 11)
						tile.hasSnake = {
							value: true,
							icon: 'mdi-snake',
							goBackwardBlocks: 3,
						}
				})

			if (this.$store.state.snakesAndLadders.settings.blocks === 30)
				this.tiles.forEach((tile) => {
					if (tile.tileNumber === 16 || tile.tileNumber === 24)
						tile.hasLadder = {
							value: true,
							icon: 'mdi-ladder',
							goForwardBlocks: 2,
						}

					if (tile.tileNumber === 4 || tile.tileNumber === 10)
						tile.hasLadder = {
							value: true,
							icon: 'mdi-ladder',
							goForwardBlocks: 3,
						}

					if (tile.tileNumber === 14 || tile.tileNumber === 28)
						tile.hasSnake = {
							value: true,
							icon: 'mdi-snake',
							goBackwardBlocks: 2,
						}

					if (tile.tileNumber === 7 || tile.tileNumber === 11)
						tile.hasSnake = {
							value: true,
							icon: 'mdi-snake',
							goBackwardBlocks: 3,
						}
				})

			if (this.$store.state.snakesAndLadders.settings.blocks === 36)
				this.tiles.forEach((tile) => {
					if (
						tile.tileNumber === 16 ||
						tile.tileNumber === 24 ||
						tile.tileNumber === 30
					)
						tile.hasLadder = {
							value: true,
							icon: 'mdi-ladder',
							goForwardBlocks: 2,
						}

					if (tile.tileNumber === 4 || tile.tileNumber === 10)
						tile.hasLadder = {
							value: true,
							icon: 'mdi-ladder',
							goForwardBlocks: 3,
						}

					if (tile.tileNumber === 14 || tile.tileNumber === 28)
						tile.hasSnake = {
							value: true,
							icon: 'mdi-snake',
							goBackwardBlocks: 2,
						}

					if (
						tile.tileNumber === 7 ||
						tile.tileNumber === 11 ||
						tile.tileNumber === 37
					)
						tile.hasSnake = {
							value: true,
							icon: 'mdi-snake',
							goBackwardBlocks: 3,
						}
				})

			if (this.$store.state.snakesAndLadders.settings.blocks === 42)
				this.tiles.forEach((tile) => {
					if (
						tile.tileNumber === 16 ||
						tile.tileNumber === 24 ||
						tile.tileNumber === 30 ||
						tile.tileNumber === 33
					)
						tile.hasLadder = {
							value: true,
							icon: 'mdi-ladder',
							goForwardBlocks: 2,
						}

					if (tile.tileNumber === 4 || tile.tileNumber === 10)
						tile.hasLadder = {
							value: true,
							icon: 'mdi-ladder',
							goForwardBlocks: 3,
						}

					if (
						tile.tileNumber === 14 ||
						tile.tileNumber === 28 ||
						tile.tileNumber === 34
					)
						tile.hasSnake = {
							value: true,
							icon: 'mdi-snake',
							goBackwardBlocks: 2,
						}

					if (
						tile.tileNumber === 7 ||
						tile.tileNumber === 11 ||
						tile.tileNumber === 37
					)
						tile.hasSnake = {
							value: true,
							icon: 'mdi-snake',
							goBackwardBlocks: 3,
						}
				})

			if (this.$store.state.snakesAndLadders.settings.blocks === 48)
				this.tiles.forEach((tile) => {
					if (
						tile.tileNumber === 16 ||
						tile.tileNumber === 24 ||
						tile.tileNumber === 34
					)
						tile.hasLadder = {
							value: true,
							icon: 'mdi-ladder',
							goForwardBlocks: 2,
						}

					if (
						tile.tileNumber === 4 ||
						tile.tileNumber === 10 ||
						tile.tileNumber === 30
					)
						tile.hasLadder = {
							value: true,
							icon: 'mdi-ladder',
							goForwardBlocks: 3,
						}

					if (
						tile.tileNumber === 14 ||
						tile.tileNumber === 28 ||
						tile.tileNumber === 36
					)
						tile.hasSnake = {
							value: true,
							icon: 'mdi-snake',
							goBackwardBlocks: 2,
						}

					if (
						tile.tileNumber === 7 ||
						tile.tileNumber === 11 ||
						tile.tileNumber === 41
					)
						tile.hasSnake = {
							value: true,
							icon: 'mdi-snake',
							goBackwardBlocks: 3,
						}
				})
		},

		diceroll() {
			let player = this.players[this.playersTurn]
			let winningTile = this.$store.state.snakesAndLadders.settings.blocks

			// die roll
			this.diceNumber = Math.floor(Math.random() * 6 + 1)

			// Move player according to die and if win condition exit the function
			if (player.tile + this.diceNumber >= winningTile) {
				player.tile = winningTile
				this.winner.value = true
				this.dialog = true
				return (this.winner.player = player)
			}

			for (let roll = 0; roll < this.diceNumber; roll++) {
				this.$nextTick(() => {
					window.setTimeout(
						() => {
							++player.tile
						},
						roll * 750,
						roll
					)
				})
			}

			let tile = this.tiles.find(
				(tile) => tile.tileNumber === this.diceNumber + player.tile
			)

			if (tile.hasSnake)
				this.showSnakeAlert(
					tile.hasSnake.goBackwardBlocks,
					player,
					this.diceNumber * 750
				)

			if (tile.hasLadder)
				this.showLadderAlert(
					tile.hasLadder.goForwardBlocks,
					player,
					this.diceNumber * 750
				)

			// Switches the player turn

			if (this.playersTurn !== this.players.length - 1) this.playersTurn++
			else this.playersTurn = 0
		},

		fetchPlayers() {
			this.playerNames = this.$store.state.snakesAndLadders.players

			this.playerNames.forEach((player, index) => {
				this.players.push({
					playerNumber: index + 1,
					name: player.name,
					score: null,
					tile: 1,
					isPlaying: index !== 0 ? false : true,
					icon: player.icon,
					color: player.color,
				})
			})

			this.playersTurn = 0
		},

		colorPicker() {
			return Math.floor(Math.random() * this.colors.length)
		},

		playerShadow(color) {
			return color.replace(' lighten-2', '')
		},

		navigateToStart() {
			this.dialog = false
			this.$router.push('/')
		},

		restart() {
			location.reload()
		},

		showSnakeAlert(blocks, player, time) {
			setTimeout(() => {
				this.snakeAlert = true
				for (let roll = blocks; roll > 0; roll--) {
					this.$nextTick(() => {
						window.setTimeout(
							() => {
								--player.tile
							},
							roll * 750,
							roll
						)
					})
				}
				this.snakeAlert = false
			}, time)

			this.specialAlert = true
			this.specialMessage = `Έπεσες επάνω σε φιδάκι. Θα πας ${blocks} βήματα πίσω :(`
			this.specialMessageColor = 'error'
		},

		showLadderAlert(blocks, player, time) {
			setTimeout(() => {
				this.ladderAlert = true
				for (let roll = 0; roll < blocks; roll++) {
					this.$nextTick(() => {
						window.setTimeout(
							() => {
								++player.tile
							},
							roll * 750,
							roll
						)
					})
				}
				this.ladderAlert = false
			}, time)

			this.specialAlert = true
			this.specialMessage = `Έπεσες επάνω σε σκάλα. Θα πας ${blocks} βήματα μπροστά :)`
			this.specialMessageColor = 'success'
		},
	},
}
</script>

<style>
.v-dialog.v-dialog--active.v-dialog--persistent {
	box-shadow: 0 0 64px white;
}
</style>
