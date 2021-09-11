<template>
	<v-container>
		<v-dialog
			transition="dialog-top-transition"
			max-width="600"
			v-model="dialog"
		>
			<v-card>
				<v-card-title color="primary" class="justify-center" dark>
					ΣΥΓΧΑΡΗΤΗΡΙΑ
				</v-card-title>
				<v-card-text>
					<div class="text-h2 pa-12">Κέρδισες !!!!</div>
				</v-card-text>
				<v-card-actions class="justify-end">
					<v-btn text @click="navigateToStart">Πίσω στην αρχική</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-row align="center" justify="center" v-if="loading">
			<v-col cols="4">
				<v-card flat tile>
					<v-card-title class="justify-center">
						Παρακαλώ περιμένετε
					</v-card-title>
					<v-progress-linear indeterminate color="cyan"></v-progress-linear>
				</v-card>
			</v-col>
		</v-row>
		<v-row align="start" justify="center" v-if="!loading">
			<v-col cols="4">
				<v-img :src="image"></v-img>
			</v-col>
		</v-row>
		<v-row align="center" justify="space-around" v-if="!loading">
			<v-col cols="5">
				<v-card color="primary" height="100%">
					<v-card-title class="justify-center font-weight-light display-2">
						Κομμάτια Παζλ
					</v-card-title>
					<v-card-text>
						<draggable
							group="puzzle"
							class="list-group row"
							:list="imagePieces"
							@change="calculatePuzzle"
							@start="dragging = true"
							@end="dragging = false"
						>
							<v-col
								v-for="(imagePiece, index) in imagePieces"
								:key="index"
								cols="3"
								class="pa-0 d-flex justify-center"
								style="border: 1px solid black"
							>
								<v-img
									:src="imagePiece.image"
									width="100%"
									height="100%"
									aspect-ratio="1"
									class="list-group-item"
									:lazy-src="imagePiece.image"
									:alt="imagePiece.image"
								>
									{{ imagePiece.id }}
									<!-- {{ imagePiece.image }} -->
								</v-img>
							</v-col>
						</draggable>
					</v-card-text>
				</v-card>
			</v-col>

			<v-col cols="5">
				<v-card color="green" height="100%">
					<v-card-title class="justify-center font-weight-light display-2">
						Λύση Παζλ
					</v-card-title>
					<v-card-text>
						<draggable
							group="puzzle"
							class="list-group row"
							:list="solvedImagePieces"
							@start="dragging = true"
							@end="dragging = false"
							@change="dragging = false"
						>
							<v-col
								cols="3"
								v-for="(imagePiece, index) in solvedImagePieces"
								:key="index"
								class="pa-0 d-flex justify-center"
								style="border: 1px solid black"
							>
								<v-img
									v-if="imagePiece"
									width="100%"
									height="100%"
									:src="imagePiece.image"
									aspect-ratio="1"
									class="list-group-item"
								></v-img>
								<div v-else style="border: 1px solid black"></div>
							</v-col>
						</draggable>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
		<v-row justify="center" v-if="!loading">
			<v-col cols="auto">
				<v-btn rounded @click="resetPuzzle()">Επανεκκινηση Παζλ</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import draggable from 'vuedraggable'

export default {
	components: {
		draggable,
	},

	data() {
		return {
			solvedImagePieces: [],
			imagePieces: [],
			order: 1,
			dragging: false,
			image: null,
			imageWidth: null,
			imageHeight: null,
			dialog: false,
			loading: true,
		}
	},

	mounted() {
		this.$nextTick(() => {
			this.cutImage()
		})
	},

	methods: {
		async cutImage() {
			const image = new Image()
			image.src =
				await require(`@/assets/puzzles-images/${this.$route.params.id}.png`)
			this.image = image.src

			const width = Math.round(Math.abs(image.width / 4))
			const height = Math.round(Math.abs(image.height / 3))
			let id = 1
			for (let y = 0; y < 3; y++) {
				for (let x = 0; x < 4; x++) {
					let imageCanvas = document.createElement('canvas')
					imageCanvas.width = width
					imageCanvas.height = height
					this.imageWidth = width
					this.imageHeight = height
					let imageContext = imageCanvas.getContext('2d')

					imageContext.drawImage(
						image,
						x * imageCanvas.width,
						y * imageCanvas.height,
						imageCanvas.width,
						imageCanvas.height,
						0,
						0,
						imageCanvas.width,
						imageCanvas.height
					)
					let imagePiece = imageCanvas.toDataURL('image/png')
					console.log(imagePiece)
					this.imagePieces.push({
						id,
						mock: false,
						image: imagePiece,
					})

					const blankCanvas = document.createElement('canvas')
					const blankContext = blankCanvas.getContext('2d')
					blankContext.fillStyle = 'white'
					blankContext.fillRect(0, 0, 1000, 1000)

					this.solvedImagePieces.push({
						mock: true,
						image: blankCanvas.toDataURL(),
					})
					id++
				}
			}

			this.shufflePuzzle(this.imagePieces)
		},

		shufflePuzzle(image) {
			for (let i = image.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[image[i], image[j]] = [image[j], image[i]]
			}

			this.loading = false
		},

		resetPuzzle() {
			this.solvedImagePieces = []
			this.imagePieces = []
			this.cutImage()
		},

		calculatePuzzle(evt) {
			if (evt.removed) {
				for (
					let i = evt.removed.oldIndex;
					i < this.solvedImagePieces.length;
					i++
				) {
					if (
						this.solvedImagePieces[i].mock &&
						this.solvedImagePieces[i].mock === true
					) {
						this.solvedImagePieces.splice(i, 1)
						break
					}
				}
			} else {
				const blankCanvas = document.createElement('canvas')
				const blankContext = blankCanvas.getContext('2d')
				blankContext.fillStyle = 'white'
				blankContext.fillRect(0, 0, this.imageWidth, this.imageHeight)

				this.solvedImagePieces.push({
					mock: true,
					image: blankCanvas.toDataURL(),
				})
			}

			const checkWin = this.solvedImagePieces.some(
				(image) => image.mock === true
			)

			if (!checkWin) {
				if (
					this.solvedImagePieces.every((image, index) => image.id === index + 1)
				)
					this.dialog = true
			}
		},

		navigateToStart() {
			this.dialog = false
			this.$router.push('/')
		},
	},
}
</script>

<style>
.v-dialog.v-dialog--active.v-dialog--persistent {
	box-shadow: 0 0 64px white;
}
</style>
