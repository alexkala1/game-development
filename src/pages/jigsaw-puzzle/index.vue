<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12" md="4">
				<v-form
					ref="form"
					lazy-validation
					v-model="valid"
					@submit.prevent="submit"
				>
					<v-card>
						<v-card-title class="justify-center display-1 font-weight-light">
							Παζλ
						</v-card-title>
						<v-card-text>
							<v-select
								required
								:rules="urlRule"
								rounded
								filled
								:items="images"
								prepend-inner-icon="mdi-image"
								v-model="selectedImage"
								label="Σύνδεσμος Εικόνας"
							></v-select>
						</v-card-text>
						<v-divider></v-divider>
						<v-card-actions class="justify-center">
							<v-btn type="submit" rounded color="primary">
								<v-icon left>mdi-play</v-icon>
								Ξεκινήστε νέο δωμάτιο
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-form>
			</v-col>
			<v-col cols="12" md="4">
				<v-img
					v-if="selectedImage !== null"
					:src="require(`@/assets/puzzles-images/${selectedImage}.png`)"
				></v-img>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import router from '@/router'

export default {
	data() {
		return {
			valid: true,
			urlRule: [(v) => !!v || 'Τοποθετήστε σύνδεσμο εικόνας για να παίξετε.'],
			images: [1, 2, 3, 4, 5],
			selectedImage: null,
		}
	},

	methods: {
		submit() {
			return router.push('/jigsaw-puzzle/' + this.selectedImage)
		},
	},
}
</script>

<style></style>
