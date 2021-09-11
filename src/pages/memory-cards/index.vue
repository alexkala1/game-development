<template>
	<v-container>
		<v-row align="stretch" justify="center">
			<v-col cols="12" md="4">
				<v-form
					lazy-validation
					ref="form"
					v-model="valid"
					@submit.prevent="submit"
				>
					<v-card>
						<v-card-title class="justify-center display-1 font-weight-light">
							Κάρτες Μνήμης
						</v-card-title>
						<v-card-text>
							<v-select
								v-model="form.players"
								:items="players"
								rounded
								filled
								required
								label="Αριθμός παικτών"
								prepend-inner-icon="mdi-account"
								@change="setPlayerNumber"
							></v-select>
							<v-select
								v-model="form.items"
								:items="items"
								rounded
								filled
								required
								label="Αριθμός αντικειμένων"
								prepend-inner-icon="mdi-account"
							></v-select>
						</v-card-text>
						<v-divider></v-divider>
						<v-card-actions class="justify-center">
							<v-btn type="submit" rounded color="primary" block>
								<v-icon left>mdi-play</v-icon>
								Ξεκινήστε νέο δωμάτιο
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-form>
			</v-col>
			<v-expand-transition>
				<v-col cols="12" md="6" v-if="selectedPlayers">
					<v-card height="100%">
						<v-card-title class="justify-center display-1 font-weight-light">
							Ονόματα παικτών
						</v-card-title>
						<v-card-text>
							<v-row
								justify="center"
								align="center"
								v-for="(player, index) in selectedPlayers"
								:key="index"
							>
								<v-col cols="12" md="4">
									<v-text-field
										v-model="player.name"
										rounded
										filled
										required
										:label="`Παίκτης ${index + 1}`"
										prepend-inner-icon="mdi-account"
										:color="player.color.value || 'grey darken-2'"
									></v-text-field>
								</v-col>
								<v-col cols="12" md="4">
									<v-select
										rounded
										filled
										required
										:label="`Χρώμα Παίκτη ${index + 1}`"
										prepend-inner-icon="mdi-account"
										:items="colors"
										return-object
										item-text="name"
										v-model="player.color"
										:color="player.color.value || 'grey darken-2'"
									>
										<template #item="{ item }">
											<v-sheet
												elevation="2"
												rounded
												:color="item.value"
												width="20"
												height="20"
											></v-sheet>
											<span class="pl-2">
												{{ item.name }}
											</span>
										</template>
										<template #selection="{ item }">
											<v-sheet
												elevation="2"
												rounded
												:color="item.value"
												width="20"
												height="20"
											></v-sheet>
											<span class="pl-2">
												{{ item.name }}
											</span>
										</template>
									</v-select>
								</v-col>
								<v-col cols="12" md="4">
									<v-select
										:color="player.color.value || 'grey darken-2'"
										rounded
										filled
										required
										:label="`Χαρακτήρας Παίκτη ${index + 1}`"
										prepend-inner-icon="mdi-account"
										:items="icons"
										return-object
										item-text="name"
										v-model="player.icon"
									>
										<template #item="{ item }">
											<v-icon :color="player.color.value || 'grey darken-2'">
												{{ item.value }}
											</v-icon>
											<span class="pl-2">
												{{ item.name }}
											</span>
										</template>
										<template #selection="{ item }">
											<v-icon :color="player.color.value || 'grey darken-2'">
												{{ item.value }}
											</v-icon>
											<span class="pl-2">
												{{ item.name }}
											</span>
										</template>
									</v-select>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
			</v-expand-transition>
		</v-row>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			valid: true,
			rules: {},
			form: {
				players: null,
				items: null,
				remote: null,
			},
			players: [1, 2],
			items: [3, 5, 7, 9, 11],
			selectedPlayers: null,
			colors: [
				{
					name: 'Κοκκινο',
					value: 'red lighten-2',
				},
				{
					name: 'Ροζ',
					value: 'pink lighten-2',
				},
				{
					name: 'Μωβ',
					value: 'purple lighten-2',
				},
				{
					name: 'Βαθύ Μωβ',
					value: 'deep-purple lighten-2',
				},
				{
					name: 'Σκούρο Μπλε',
					value: 'indigo lighten-2',
				},
				{
					name: 'Μπλε',
					value: 'blue lighten-2',
				},
				{
					name: 'Ανοιχτό Μπλε',
					value: 'light-blue lighten-2',
				},
				{
					name: 'Θαλασσί',
					value: 'cyan lighten-2',
				},
				{
					name: 'Τιρκουάζ',
					value: 'teal lighten-2',
				},
				{
					name: 'Πράσινο',
					value: 'green lighten-2',
				},
				{
					name: 'Λαχανί',
					value: 'light-green lighten-2',
				},
				{
					name: 'Ανοιχτό Πράσινο',
					value: 'lime lighten-2',
				},
				{
					name: 'Κίτρινο',
					value: 'yellow lighten-2',
				},
				{
					name: 'Σκούρο Κίτρινο',
					value: 'amber lighten-2',
				},
				{
					name: 'Πορτοκαλί',
					value: 'orange lighten-2',
				},
				{
					name: 'Σκούρο Πορτοκαλί',
					value: 'deep-orange lighten-2',
				},
				{
					name: 'Καφέ',
					value: 'brown lighten-2',
				},
			],
			icons: [
				{
					name: 'Σκύλος',
					value: 'mdi-dog',
				},
				{
					name: 'Αυτοκίνητο',
					value: 'mdi-car',
				},
				{
					name: 'Γάτα',
					value: 'mdi-cat',
				},
				{
					name: 'Ψάρι',
					value: 'mdi-fish',
				},
			],
		}
	},

	methods: {
		submit() {
			this.$store.dispatch('setMemoryCards', {
				settings: this.form,
				players: this.selectedPlayers,
			})
			this.$router.push('/memory-cards/game/')
		},

		setPlayerNumber() {
			this.selectedPlayers = []
			for (let i = 0; i < this.form.players; i++) {
				this.selectedPlayers.push({
					name: '',
					color: '',
					icon: '',
				})
			}
		},
	},
}
</script>

<style></style>
