<template>
	<v-container>
		<v-dialog max-width="600" v-model="dialog" persistent transition="scale">
			<v-card v-if="winner !== null">
				<v-card-title color="primary" class="justify-center" dark>
					ΣΥΓΧΑΡΗΤΗΡΙΑ
				</v-card-title>
				<v-card-text>
					<div class="text-h2 pa-12">Κέρδισες {{ winner.name }} !!!!</div>
				</v-card-text>
				<v-card-actions class="justify-end">
					<v-btn rounded color="primary" @click="navigateToStart"
						>Πίσω στην αρχική</v-btn
					>
					<v-btn rounded color="primary" @click="restart">Παίξτε Ξανά</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-row align="start" justify="center">
			<v-col cols="12" sm="2">
				<v-card flat>
					<v-card-title class="justify-center display-2 font-weight-light">
						Σκορ
					</v-card-title>
					<v-card-text v-for="player in players" :key="player.playerNumber">
						<h1 class="display-1 font-weight-light py-3">
							{{ player.name }}:
							<!-- eslint-disable -->
							<v-icon
								:color="player.color"
								right
								x-large
								v-for="point in player.score"
								:key="point"
								v-if="player.score !== null"
								>{{ player.icon }}
							</v-icon>
						</h1>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" sm="10">
				<v-card flat>
					<v-card-text>
						<v-row>
							<v-col
								cols="4"
								md="2"
								v-for="(item, index) in items"
								:key="index"
							>
								<v-card :color="item.color">
									<v-card-text>
										<v-row dense justify="center">
											<v-col cols="auto">
												<v-btn
													icon
													@click="selectItem(index, item)"
													:disabled="item.clicked"
													width="150"
													height="150"
												>
													<v-icon
														size="150"
														:style="!item.clicked ? `visibility: hidden` : ''"
													>
														{{ item.card }}
													</v-icon>
												</v-btn>
											</v-col>
										</v-row>
									</v-card-text>
								</v-card>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			items: [],
			players: [],
			playerNames: [],
			allItems: [
				'mdi-account',
				'mdi-cellphone',
				'mdi-castle',
				'mdi-fire-truck',
				'mdi-meteor',
				'mdi-flask-empty',
				'mdi-flower-tulip',
				'mdi-music-clef-treble',
				'mdi-speaker',
				'mdi-fountain',
			],
			itemsNumber: null,
			firstItem: null,
			secondItem: null,
			clickCount: 0,
			solvedItems: 0,
			dialog: false,
			winner: null,
		}
	},

	mounted() {
		this.initializeCards()
	},

	methods: {
		initializeCards() {
			const randomizedItems = this.allItems.sort(() => Math.random() - 0.5)
			this.itemsNumber = this.$store.state.memoryCards.settings.items
			this.playerNames = this.$store.state.memoryCards.players

			this.playerNames.forEach((player, index) => {
				this.players.push({
					playerNumber: index + 1,
					name: player.name,
					icon: player.icon.value,
					color: player.color.value,
					score: null,
					isPlaying: index !== 0 ? false : true,
				})
			})

			if (this.$store.state.memoryCards === null)
				this.$store.dispatch('setMemoryCardsPlayers', this.players)

			for (let item = 0; item < this.itemsNumber; item++) {
				this.items.push({
					card: randomizedItems[item],
					index: 1,
					clicked: false,
					color: 'primary',
				})
				this.items.push({
					card: randomizedItems[item],
					index: 2,
					clicked: false,
					color: 'primary',
				})
			}

			return this.items.sort(() => Math.random() - 0.5)
		},

		selectItem(value, item) {
			item.clicked = true
			this.clickCount++

			if (this.firstItem == null) this.firstItem = value
			else this.secondItem = value

			if (this.clickCount > 1) {
				this.checkEqual(this.items[this.firstItem], this.items[this.secondItem])
				this.clickCount = 0
			}
		},

		checkEqual(firstSelection, secondSelection) {
			if (
				firstSelection.card === secondSelection.card &&
				firstSelection.index !== secondSelection.index
			) {
				let player = this.players.find((player) => player.isPlaying === true)

				firstSelection.color = player.color
				secondSelection.color = player.color

				this.players.forEach((player) => {
					if (player.isPlaying === true) player.score += 1
				})

				this.firstItem = null
				this.secondItem = null

				this.solvedItems++
				if (this.solvedItems === this.itemsNumber) {
					this.winner = this.players.reduce((max, player) =>
						player.score > max.score ? player : max
					)
					this.dialog = true
				}
			} else {
				firstSelection.color = 'error'
				secondSelection.color = 'error'

				this.firstItem = null
				this.secondItem = null

				setTimeout(() => {
					firstSelection.color = 'primary'
					firstSelection.clicked = false

					secondSelection.color = 'primary'
					secondSelection.clicked = false
				}, 2000)
			}

			if (this.players.length > 0) this.switchPlayerTurn()
		},

		switchPlayerTurn() {
			this.players.forEach((player) => (player.isPlaying = !player.isPlaying))
		},

		navigateToStart() {
			this.dialog = false
			this.$router.push('/')
		},

		restart() {
			location.reload()
		},
	},
}
</script>

<style>
.v-dialog.v-dialog--active.v-dialog--persistent {
	box-shadow: 0 0 64px white;
}
</style>
